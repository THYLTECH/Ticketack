// components/file-upload/image-cropper.tsx

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Cropper, { Area } from "react-easy-crop";
import { useTrans } from "@/lib/translation";

interface ImageCropperProps {
    open: boolean;
    fileUrl: string | null;
    ratio?: number;
    onClose: () => void;
    onConfirm: (file: File) => void;
}

/**
 * ImageCropper component for cropping images before upload.
 * @param open
 * @param fileUrl
 * @param ratio
 * @param onClose
 * @param onConfirm
 * @constructor
 */
export default function ImageCropper({
    open,
    fileUrl,
    ratio = 1,
    onClose,
    onConfirm,
}: Readonly<ImageCropperProps>) {
    const __ = useTrans();

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(
        null,
    );

    const createImage = (url: string): Promise<HTMLImageElement> =>
        new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = url;
            img.onload = () => resolve(img);
            img.onerror = reject;
        });

    const getCroppedImg = async (url: string, pixels: Area) => {
        const img = await createImage(url);
        const canvas = document.createElement('canvas');
        canvas.width = pixels.width;
        canvas.height = pixels.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        ctx.drawImage(
            img,
            pixels.x,
            pixels.y,
            pixels.width,
            pixels.height,
            0,
            0,
            pixels.width,
            pixels.height,
        );

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

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {__('settings.pages.profile.info_form.crop_title')}
                    </DialogTitle>
                </DialogHeader>

                <div className="relative h-64 w-full overflow-hidden rounded-md bg-black">
                    {fileUrl && (
                        <Cropper
                            image={fileUrl}
                            crop={crop}
                            zoom={zoom}
                            aspect={ratio}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={(_, area) =>
                                setCroppedAreaPixels(area)
                            }
                        />
                    )}
                </div>

                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={async () => {
                            if (!fileUrl || !croppedAreaPixels) return;
                            const file = await getCroppedImg(
                                fileUrl,
                                croppedAreaPixels,
                            );
                            if (file) onConfirm(file);
                            onClose();
                        }}
                    >
                        {__('settings.pages.profile.info_form.crop_confirm')}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
