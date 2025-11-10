import React, { useEffect, useState } from 'react';
import BaseFileUpload from "@/components/file-upload/base-file-upload";
import ImageCropper from "@/components/file-upload/image-cropper";

interface AvatarUploadProps {
    name: string;
    defaultUrl?: string | null;
    ratio?: "1:1" | "16:9" | "free";
    onFileSelect?: (file: File | null) => void;
}

/**
 * Avatar upload component with cropping functionality.
 * @param name
 * @param defaultUrl
 * @param ratio
 * @param onFileSelect
 * @constructor
 */
export default function AvatarUpload({
    name,
    defaultUrl = null,
    ratio = '1:1',
    onFileSelect,
}: Readonly<AvatarUploadProps>) {
    const MAX_SIZE_MB = 2;

    // URL affichée (preview visuelle uniquement)
    const [displayPreview, setDisplayPreview] = useState<string | null>(null);

    // URL utilisée par le cropper (source)
    const [originalPreview, setOriginalPreview] = useState<string | null>(null);

    // fichier résultat du crop
    const [preview, setPreview] = useState<string | null>(null);

    const [cropOpen, setCropOpen] = useState(false);
    const [fileToCrop, setFileToCrop] = useState<File | null>(null);

    // Normalisation du defaultUrl AVEC UN ÉTAT SÉPARÉ
    useEffect(() => {
        if (!defaultUrl) {
            setDisplayPreview(null);
            setOriginalPreview(null);
            return;
        }

        // Cas 1: Blob → direct
        if (defaultUrl.startsWith('blob:')) {
            setDisplayPreview(defaultUrl);
            setOriginalPreview(defaultUrl);
            return;
        }

        // Cas 2: /storage/... → direct
        if (defaultUrl.startsWith('/storage/')) {
            setDisplayPreview(defaultUrl);
            setOriginalPreview(defaultUrl);
            return;
        }

        //Cas 3: path DB → normalisation
        const normalized = `/storage/${defaultUrl}`;
        setDisplayPreview(normalized);
        setOriginalPreview(normalized);
    }, [defaultUrl]);

    let aspect: number | undefined;
    if (ratio === '1:1') aspect = 1;
    if (ratio === '16:9') aspect = 16 / 9;

    return (
        <>
            <BaseFileUpload
                name={name}
                //on utilise displayPreview (pas preview)
                preview={preview ?? displayPreview}
                maxSizeMB={MAX_SIZE_MB}
                ratio={ratio}
                onFileSelect={(file, url) => {
                    if (!file || !url) {
                        setPreview(null);
                        setOriginalPreview(null);
                        onFileSelect?.(null);
                        return;
                    }
                    setOriginalPreview(url);
                    setFileToCrop(file);
                    setCropOpen(true);
                }}
                onOpenCrop={() => {
                    if (originalPreview) setCropOpen(true);
                }}
                onRemove={() => {
                    setDisplayPreview(null);
                    setOriginalPreview(null);
                    setPreview(null);
                    setFileToCrop(null);
                    onFileSelect?.(null);
                }}
            />

            <ImageCropper
                open={cropOpen}
                fileUrl={originalPreview}
                ratio={aspect}
                onClose={() => setCropOpen(false)}
                onConfirm={(cropped) => {
                    const newUrl = URL.createObjectURL(cropped);
                    setPreview(newUrl);
                    onFileSelect?.(cropped);
                    setCropOpen(false);
                }}
            />
        </>
    );
}
