import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTrans } from '@/lib/translation';
import { Minus, Plus, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface ImageModalProps {
    src: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ImageModal({ src, isOpen, onClose }: ImageModalProps) {
    const __ = useTrans();
    const [zoomLevel, setZoomLevel] = useState(1);
    const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const panStartRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (isOpen) {
            setZoomLevel(1);
            setPanPosition({ x: 0, y: 0 });
        }
    }, [isOpen]);

    const handleWheelZoom = (e: React.WheelEvent) => {
        const delta = e.deltaY * -0.001;
        const newZoom = Math.min(Math.max(1, zoomLevel + delta), 5);
        setZoomLevel(newZoom);
        if (newZoom === 1) setPanPosition({ x: 0, y: 0 });
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoomLevel > 1) {
            e.preventDefault();
            setIsPanning(true);
            panStartRef.current = {
                x: e.clientX - panPosition.x,
                y: e.clientY - panPosition.y,
            };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning && zoomLevel > 1) {
            e.preventDefault();
            setPanPosition({
                x: e.clientX - panStartRef.current.x,
                y: e.clientY - panStartRef.current.y,
            });
        }
    };

    const handleMouseUp = () => setIsPanning(false);

    const updateZoom = (delta: number) => {
        setZoomLevel((z) => {
            const next = Math.min(Math.max(1, z + delta), 5);
            if (next === 1) setPanPosition({ x: 0, y: 0 });
            return next;
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                className="h-screen w-screen max-w-none border-none bg-black/95 p-0 shadow-none outline-none [&>button]:hidden"
                onWheel={handleWheelZoom}
            >
                <DialogHeader className="sr-only">
                    <DialogTitle>
                        {__('tickets.pages.show.comments.image_modal.title')}
                    </DialogTitle>
                </DialogHeader>
                {src && (
                    <div
                        className="relative flex h-full w-full items-center justify-center overflow-hidden"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                    >
                        <div className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full bg-white/10 px-4 py-2 backdrop-blur-md">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full text-white hover:bg-white/20"
                                onClick={() => updateZoom(-0.5)}
                            >
                                <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center text-sm font-medium text-white">
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-full text-white hover:bg-white/20"
                                onClick={() => updateZoom(0.5)}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-red-500/80"
                        >
                            <X className="h-6 w-6" />
                        </button>

                        <div
                            className="flex h-full w-full items-center justify-center"
                            style={{
                                cursor:
                                    zoomLevel > 1
                                        ? isPanning
                                            ? 'grabbing'
                                            : 'grab'
                                        : 'default',
                            }}
                        >
                            <img
                                src={src}
                                alt={__(
                                    'tickets.pages.show.comments.image_modal.alt',
                                )}
                                className="max-h-full max-w-full object-contain transition-transform duration-75 ease-linear"
                                style={{
                                    transform: `translate(${panPosition.x}px, ${panPosition.y}px) scale(${zoomLevel})`,
                                }}
                                draggable={false}
                            />
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
