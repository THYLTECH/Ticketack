"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
    CircleUserRoundIcon,
    XIcon,
    ZoomInIcon,
    ZoomOutIcon,
} from "lucide-react"

import { useFileUpload } from "@/hooks/use-file-upload"
import { Button } from "@/components/ui/button"
import {
    Cropper,
    CropperCropArea,
    CropperDescription,
    CropperImage,
} from "@/components/ui/cropper"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { toast } from 'sonner';

type Area = { x: number; y: number; width: number; height: number }

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image()
        image.addEventListener("load", () => resolve(image))
        image.addEventListener("error", (error) => reject(error))
        image.setAttribute("crossOrigin", "anonymous")
        image.src = url
    })

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File | null> {
    try {
        const image = await createImage(imageSrc)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) return null

        canvas.width = pixelCrop.width
        canvas.height = pixelCrop.height

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height
        )

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return resolve(null)
                resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }))
            }, "image/jpeg")
        })
    } catch {
        return null
    }
}

export default function AvatarUploader({
    onFileChange,
    defaultUrl = null,
}: Readonly<{
    onFileChange: (file: File | null) => void;
    defaultUrl?: string | null;
}>) {
    const [
        { files },
        {
            handleDragEnter,
            handleDragLeave,
            handleDragOver,
            handleDrop,
            openFileDialog,
            removeFile,
            getInputProps,
        },
    ] = useFileUpload({
        accept: 'image/*',
    });

    const MAX_SIZE_MB = 2
    const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

    const validateFile = (file: File): boolean => {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error("File too large", {
                description: "Please choose an image under 2 MB.",
            })
            return false
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            toast.error("Invalid file type", {
                description: "Allowed formats: JPG, PNG, WEBP or GIF.",
            })
            return false
        }

        return true
    }


    let normalizedDefault = null;

    if (defaultUrl) {
        if (defaultUrl.startsWith('http')) {
            normalizedDefault = defaultUrl;
        } else if (defaultUrl.startsWith('/storage/')) {
            normalizedDefault = defaultUrl;
        } else {
            normalizedDefault = `/storage/${defaultUrl}`;
        }
    }
    const [localPreview, setLocalPreview] = useState<string | null>(
        normalizedDefault,
    );

    const previewUrl = localPreview || files[0]?.preview || null;

    const fileId = files[0]?.id;

    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [zoom, setZoom] = useState(1);

    const previousFileIdRef = useRef<string | null>(null);

    const handleCropChange = useCallback((pixels: Area | null) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleApply = async () => {
        if (!previewUrl || !croppedAreaPixels) {
            setIsDialogOpen(false);
            return;
        }

        const croppedFile = await getCroppedImg(previewUrl, croppedAreaPixels);

        if (!croppedFile) {
            setIsDialogOpen(false);
            return;
        }

        const croppedPreview = URL.createObjectURL(croppedFile);

        if (localPreview?.startsWith('blob:')) {
            URL.revokeObjectURL(localPreview);
        }

        setLocalPreview(croppedPreview);

        onFileChange(croppedFile);

        setIsDialogOpen(false);
    };

    useEffect(() => {
        if (files.length > 0) {
            const file = files[0].file as File;

            if (!validateFile(file)) {
                removeFile(files[0].id);
                return;
            }

            if (files[0].id !== previousFileIdRef.current) {
                if (localPreview?.startsWith("blob:")) {
                    URL.revokeObjectURL(localPreview);
                }

                setLocalPreview(null);
                setCroppedAreaPixels(null);
                setZoom(1);
                setIsDialogOpen(true);

                previousFileIdRef.current = files[0].id;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);



    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative inline-flex">
                <button
                    type="button"
                    className="relative flex size-25 items-center justify-center overflow-hidden rounded-full border border-dashed border-input hover:bg-accent/50"
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {previewUrl ? (
                        <img
                            className="size-full object-cover"
                            src={previewUrl}
                            alt="avatar"
                        />
                    ) : (
                        <CircleUserRoundIcon className="size-4 opacity-60" />
                    )}
                </button>

                {previewUrl && (
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (!fileId) {
                                setLocalPreview(null);
                                onFileChange(null);

                                console.log('Removed default avatar');
                                return;
                            }

                            removeFile(fileId);
                            setLocalPreview(null);
                            onFileChange(null);
                        }}
                        size="icon"
                        className="absolute -top-1 -right-1 size-6 rounded-full border-2 border-background shadow-none focus-visible:border-background"
                    >
                        <XIcon className="size-3.5" />
                    </Button>
                )}

                <input {...getInputProps()} className="sr-only" />
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="gap-0 p-0 sm:max-w-140">
                    <DialogHeader>
                        <DialogTitle>Crop image</DialogTitle>
                    </DialogHeader>

                    {previewUrl && (
                        <Cropper
                            className="h-96 sm:h-120"
                            image={previewUrl}
                            zoom={zoom}
                            onCropChange={handleCropChange}
                            onZoomChange={setZoom}
                        >
                            <CropperDescription />
                            <CropperImage />
                            <CropperCropArea />
                        </Cropper>
                    )}

                    <DialogFooter className="border-t px-4 py-6">
                        <div className="mx-auto flex w-full max-w-80 items-center gap-4">
                            <ZoomOutIcon size={16} />
                            <Slider
                                min={1}
                                max={3}
                                step={0.1}
                                value={[zoom]}
                                onValueChange={(v) => setZoom(v[0])}
                            />
                            <ZoomInIcon size={16} />
                        </div>

                        <Button onClick={handleApply} type="button">
                            Apply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
