"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeftIcon, XIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react';

import { useFileUpload } from "@/hooks/use-file-upload";
import { Button } from "@/components/ui/button";
import {
    Cropper,
    CropperCropArea,
    CropperImage,
} from "@/components/ui/cropper";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { useTrans } from "@/lib/translation";

type Area = { x: number; y: number; width: number; height: number };

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", () => {
            reject(new Error(`Failed to load image: ${url}`));
        });
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

async function getCroppedImg(imageSrc: string, pixelCrop: Area): Promise<File | null> {
    try {
        const image = await createImage(imageSrc);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return null;

        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        ctx.drawImage(
            image,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                if (!blob) return resolve(null);
                resolve(new File([blob], "avatar.jpg", { type: "image/jpeg" }));
            }, "image/jpeg");
        });
    } catch {
        return null;
    }
}

interface AvatarUploaderProps {
    defaultUrl?: string | null;
    onFileChange?: (file: File | null) => void;
}

export default function AvatarUploader({
    defaultUrl = null,
    onFileChange,
}: Readonly<AvatarUploaderProps>) {
    const __ = useTrans();

    // --- Normalisation du defaultUrl (id, chemin storage, URL complète) ---
    const normalizedDefault = typeof defaultUrl === 'string' ? defaultUrl : null;
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

    const MAX_SIZE_MB = 2;
    const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

    const validateFile = (file: File): boolean => {
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            toast.error(
                __('settings.pages.profile.info_form.avatar_too_big_title'),
                {
                    description: __(
                        'settings.pages.profile.info_form.avatar_too_big_description',
                    ).replace(':size', String(MAX_SIZE_MB)),
                },
            );
            return false;
        }

        if (!ALLOWED_TYPES.has(file.type)) {
            toast.error(
                __('settings.pages.profile.info_form.avatar_error_type') ||
                    'Invalid file type',
                {
                    description:
                        __(
                            'settings.pages.profile.info_form.avatar_error_type_description',
                        ) || 'Allowed formats: JPG, PNG, WEBP, GIF.',
                },
            );
            return false;
        }

        return true;
    };

    const [finalImageUrl, setFinalImageUrl] = useState<string | null>(
        normalizedDefault,
    );
    const previewUrl = files[0]?.preview || null;
    const fileId = files[0]?.id;

    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [zoom, setZoom] = useState(1);
    const previousFileIdRef = useRef<string | undefined | null>(null);

    const handleCropChange = useCallback((pixels: Area | null) => {
        setCroppedAreaPixels(pixels);
    }, []);

    const handleApply = async () => {
        if (!previewUrl || !fileId || !croppedAreaPixels) {
            if (fileId) {
                removeFile(fileId);
            }
            setCroppedAreaPixels(null);
            setIsDialogOpen(false);
            return;
        }

        const croppedFile = await getCroppedImg(previewUrl, croppedAreaPixels);

        if (!croppedFile) {
            toast.error(
                __('settings.pages.profile.info_form.avatar_error_crop') ||
                    'Error during cropping image.',
            );
            setIsDialogOpen(false);
            return;
        }

        const blobUrl = URL.createObjectURL(croppedFile);

        if (finalImageUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(finalImageUrl);
        }

        setFinalImageUrl(blobUrl);

        if (onFileChange) {
            onFileChange(croppedFile);
        }

        setIsDialogOpen(false);
    };

    const handleRemoveFinalImage = () => {
        if (finalImageUrl && finalImageUrl.startsWith('blob:')) {
            URL.revokeObjectURL(finalImageUrl);
        }

        setFinalImageUrl(null);

        if (onFileChange) {
            onFileChange(null);
        }
    };

    useEffect(() => {
        if (!files.length) return;

        const file = files[0].file as File;
        if (!validateFile(file)) {
            removeFile(files[0].id);
            return;
        }

        if (fileId && fileId !== previousFileIdRef.current) {
            setIsDialogOpen(true);
            setCroppedAreaPixels(null);
            setZoom(1);
        }

        previousFileIdRef.current = fileId ?? null;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [files]);

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="relative inline-flex">
                <button
                    type="button"
                    className="relative flex size-25 items-center justify-center overflow-hidden rounded-full border border-dashed border-input transition-colors outline-none hover:bg-accent/50 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-[img]:border-none data-[dragging=true]:bg-accent/50"
                    onClick={openFileDialog}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
                    {finalImageUrl ? (
                        <img
                            className="size-full object-cover"
                            src={finalImageUrl}
                            alt="avatar"
                        />
                    ) : (
                        <span className="px-4 text-center text-[11px] leading-tight break-words text-muted-foreground">
                            {__(
                                'settings.pages.profile.info_form.fields.avatar.description',
                            ).replace(':size', String(MAX_SIZE_MB))}
                        </span>
                    )}
                </button>

                {finalImageUrl && (
                    <Button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleRemoveFinalImage();
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
                <DialogContent className="gap-0 overflow-hidden rounded-lg p-0 sm:max-w-[640px] [&>button]:hidden">
                    <DialogHeader className="contents space-y-0 text-left">
                        <DialogTitle className="flex items-center justify-between border-b p-4 text-base">
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="-my-1 opacity-60"
                                    onClick={() => setIsDialogOpen(false)}
                                    aria-label={
                                        __(
                                            'settings.pages.profile.info_form.crop_cancel',
                                        ) || 'Cancel'
                                    }
                                >
                                    <ArrowLeftIcon size={16} />
                                </Button>
                                <span>
                                    {__(
                                        'settings.pages.profile.info_form.crop_title',
                                    ) || 'Crop image'}
                                </span>
                            </div>
                            <Button
                                className="-my-1"
                                onClick={handleApply}
                                disabled={!previewUrl}
                                autoFocus
                            >
                                {__(
                                    'settings.pages.profile.info_form.crop_confirm',
                                ) || 'Apply'}
                            </Button>
                        </DialogTitle>
                    </DialogHeader>

                    {previewUrl && (
                        <Cropper
                            className="h-96 sm:h-[480px]"
                            image={previewUrl}
                            zoom={zoom}
                            onCropChange={handleCropChange}
                            onZoomChange={setZoom}
                        >
                            <CropperImage />
                            <CropperCropArea />
                        </Cropper>
                    )}

                    <DialogFooter className="border-t px-4 py-6">
                        <div className="mx-auto flex w-full max-w-80 items-center gap-4">
                            <ZoomOutIcon className="opacity-60" size={16} />
                            <Slider
                                defaultValue={[1]}
                                value={[zoom]}
                                min={1}
                                max={3}
                                step={0.1}
                                onValueChange={(v) => setZoom(v[0])}
                            />
                            <ZoomInIcon className="opacity-60" size={16} />
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
