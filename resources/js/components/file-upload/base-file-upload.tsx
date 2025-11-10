// components/file-upload/base-file-upload.tsx

import React, { useRef } from "react";
import { Upload, Crop, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTrans } from "@/lib/translation";

interface BaseFileUploadProps {
    name: string;
    preview: string | null;
    maxSizeMB: number;
    ratio?: "1:1" | "16:9" | "free";
    onFileSelect: (file: File | null, url: string | null) => void;
    onOpenCrop: () => void;
    onRemove: () => void;
}

/**
 * BaseFileUpload component for uploading files with preview, cropping, and removal functionality.
 * @param name
 * @param preview
 * @param maxSizeMB
 * @param ratio
 * @param onFileSelect
 * @param onOpenCrop
 * @param onRemove
 * @constructor
 */
export default function BaseFileUpload({
    name,
    preview,
    maxSizeMB,
    ratio = '1:1',
    onFileSelect,
    onOpenCrop,
    onRemove,
}: Readonly<BaseFileUploadProps>) {
    const __ = useTrans();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = (file: File | null) => {
        if (!file) {
            onFileSelect(null, null);
            return;
        }

        if (file.size > maxSizeMB * 1024 * 1024) {
            alert(
                __(
                    'settings.pages.profile.info_form.errors.avatar_too_big',
                ).replace(':size', maxSizeMB.toString()),
            );
            return;
        }

        const url = URL.createObjectURL(file);
        onFileSelect(file, url);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        handleFile(e.dataTransfer.files?.[0] ?? null);
    };

    let imgClass = 'max-h-32 rounded-lg object-contain';
    if (ratio === '1:1') imgClass = 'h-32 w-32 rounded-lg object-cover';
    if (ratio === '16:9') imgClass = 'h-32 w-56 rounded-lg object-cover';

    return (
        <div className="space-y-2">
            <label
                htmlFor={name}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition hover:bg-muted/30"
            >
                {preview ? (
                    <div className="group relative">
                        <img
                            src={
                                preview.startsWith('blob:')
                                    ? preview
                                    : `${preview}`
                            }
                            className={imgClass}
                        />

                        <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    setTimeout(() => {
                                        onOpenCrop(); // ✅ call parent to open the crop modal
                                    }, 50);
                                }}
                            >
                                <Crop className="h-5 w-5 text-white" />
                            </Button>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onRemove();
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
                            ).replace(':size', maxSizeMB.toString())}
                        </p>
                    </>
                )}
            </label>

            <input
                ref={inputRef}
                id={name}
                type="file"
                name={name}
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
        </div>
    );
}
