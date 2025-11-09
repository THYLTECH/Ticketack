import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTrans } from '@/lib/translation';
import { Crop, Upload, X } from 'lucide-react';
import React, { useRef, useState } from 'react';
import Cropper, { Area } from 'react-easy-crop';

interface AvatarUploadProps {
    name: string;
    defaultUrl?: string | null;
    ratio?: '1:1' | '16:9' | 'free';
    onFileSelect?: (file: File | null) => void;
}

export default function AvatarUpload({
    name,
    defaultUrl = null,
    ratio = '1:1',
    onFileSelect,
}: Readonly<AvatarUploadProps>) {
    // Translation helper
    const __ = useTrans();

    // Max upload size allowed (frontend check)
    const MAX_SIZE_MB = 2;

    // Reference for <input type="file" />
    const inputRef = useRef<HTMLInputElement>(null);

    // originalPreview: always keeps the raw image (used for re-cropping)
    const [originalPreview, setOriginalPreview] = useState<string | null>(
        defaultUrl,
    );

    // preview: shows the cropped or original preview in UI
    const [preview, setPreview] = useState<string | null>(defaultUrl);

    // Dialog state for cropper modal
    const [isDialogOpen, setDialogOpen] = useState(false);

    // Cropper states
    const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [zoom, setZoom] = useState<number>(1);

    // Stores crop pixel area returned by Cropper
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    // Aspect ratio handler
    let aspect: number | undefined;
    if (ratio === '1:1') aspect = 1;
    if (ratio === '16:9') aspect = 16 / 9;

    // Selects image style based on chosen ratio
    let imgClass = 'max-h-32 rounded-lg object-contain';
    if (ratio === '1:1') imgClass = 'h-32 w-32 rounded-lg object-cover';
    if (ratio === '16:9') imgClass = 'h-32 w-56 rounded-lg object-cover';

    /**
     * Load image from URL so canvas can draw it later.
     */
    const createImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.src = url;
            image.onload = () => resolve(image);
            image.onerror = reject;
        });
    };

    /**
     * Generate the cropped file using canvas.
     */
    const getCroppedImg = async (
        imgSrc: string,
        pixelCrop: Area,
    ): Promise<File | null> => {
        const img = await createImage(imgSrc);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Canvas size = exact cropped size
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;

        // Draw selected area
        ctx.drawImage(
            img,
            pixelCrop.x,
            pixelCrop.y,
            pixelCrop.width,
            pixelCrop.height,
            0,
            0,
            pixelCrop.width,
            pixelCrop.height,
        );

        // Convert to File
        return new Promise<File | null>((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) return resolve(null);
                    resolve(
                        new File([blob], 'avatar_cropped.jpg', {
                            type: 'image/jpeg',
                        }),
                    );
                },
                'image/jpeg',
                0.95,
            );
        });
    };

    /**
     * Handle selection via input.
     */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;

        // Size check
        if (selected && selected.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(
                __(
                    'settings.pages.profile.info_form.errors.avatar_too_big',
                ).replace(':size', MAX_SIZE_MB.toString()),
            );
            return;
        }

        const url = selected ? URL.createObjectURL(selected) : null;

        // Always reset originalPreview when file changes
        setOriginalPreview(url);

        // Update UI preview
        setPreview(url);

        // Notify parent
        onFileSelect?.(selected);
    };

    /**
     * Handle drag & drop upload.
     */
    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        const dropped = e.dataTransfer.files?.[0] ?? null;

        if (dropped && dropped.size > MAX_SIZE_MB * 1024 * 1024) {
            alert(
                __(
                    'settings.pages.profile.info_form.errors.avatar_too_big',
                ).replace(':size', MAX_SIZE_MB.toString()),
            );
            return;
        }

        const url = dropped ? URL.createObjectURL(dropped) : null;

        setOriginalPreview(url);
        setPreview(url);

        onFileSelect?.(dropped);
    };

    /**
     * Remove preview/reset input.
     */
    const handleRemove = () => {
        setPreview(null);
        setOriginalPreview(null);
        if (inputRef.current) inputRef.current.value = '';
        onFileSelect?.(null);
    };

    return (
        <div className="space-y-2">
            {/* Upload area */}
            <label
                htmlFor={name}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition hover:bg-muted/30"
            >
                {preview ? (
                    <div className="group relative">
                        <img
                            src={preview ? (preview.startsWith('blob:') ? preview : `/storage/${preview}`) : ''}
                            alt="Preview"
                            className={imgClass}
                        />

                        {/* Hover actions */}
                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition group-hover:opacity-100">
                            {/* Open crop dialog */}
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setDialogOpen(true);
                                }}
                            >
                                <Crop className="h-5 w-5 text-white" />
                            </Button>

                            {/* Remove image */}
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                <X className="h-5 w-5 text-white" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            {__(
                                'settings.pages.profile.info_form.fields.avatar.max_size',
                            ).replace(':size', MAX_SIZE_MB.toString())}
                        </p>
                    </>
                )}
            </label>

            {/* Hidden input */}
            <input
                id={name}
                ref={inputRef}
                type="file"
                name={name}
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Crop dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {__('settings.pages.profile.info_form.crop_title')}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Cropper */}
                    <div className="relative h-64 w-full overflow-hidden rounded-md bg-black">
                        <Cropper
                            image={originalPreview || ''}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_, croppedPixels) =>
                                setCroppedAreaPixels(croppedPixels)
                            }
                        />
                    </div>

                    {/* Validate button */}
                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={async () => {
                                if (!originalPreview || !croppedAreaPixels)
                                    return;

                                // Create final cropped file
                                const file = await getCroppedImg(
                                    originalPreview,
                                    croppedAreaPixels,
                                );

                                if (file) {
                                    const newUrl = URL.createObjectURL(file);
                                    setPreview(newUrl); // update UI
                                    onFileSelect?.(file); // send file to parent
                                }

                                setDialogOpen(false);
                            }}
                        >
                            {__(
                                'settings.pages.profile.info_form.crop_confirm',
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
