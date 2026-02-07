import {
    formatBytes,
    useFileUpload,
    type FileMetadata,
    type FileWithPreview,
} from '@/hooks/use-file-upload';
import * as React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { cn } from '@/lib/utils';
import {
    Check,
    FileArchive,
    File as FileIcon,
    FileSpreadsheet,
    FileText,
    Headphones,
    Image as ImageIcon,
    Paperclip,
    PenLine,
    SquareArrowOutUpRight,
    Trash2,
    Video,
    X,
    type LucideIcon,
} from 'lucide-react';


export interface FileUploadProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'value' | 'onChange'
    > {
    value: FileWithPreview[];
    onValueChange: (files: FileWithPreview[]) => void;
    maxFiles?: number;
    maxSizeMB?: number;
    texts?: {
        dropAreaTitle?: string;
        dropAreaHeader?: string;
        dropAreaSubtext?: string;
        selectButton?: string;
        filesHeader?: string;
        addFilesButton?: string;
        removeAllButton?: string;
        removeFileAriaLabel?: string;
        renameFileAriaLabel?: string;
        previewFileAriaLabel?: string;
        errorPrefix?: string;
        FileUploadLabel?: string;
        AttachmentsLabel?: string;
        emptyAttachmentsText?: string;
    };
}

export interface FileUploadTexts {
    dropAreaTitle?: string;
    dropAreaHeader?: string;
    dropAreaSubtext?: string;
    selectButton?: string;
    filesHeader?: string;
    addFilesButton?: string;
    removeAllButton?: string;
    removeFileAriaLabel?: string;
    renameFileAriaLabel?: string;
    previewFileAriaLabel?: string;
    errorPrefix?: string;
    FileUploadLabel?: string;
    AttachmentsLabel?: string;
    emptyAttachmentsText?: string;
}


const iconMap = [
    {
        icon: FileText,
        test: (type: string, name: string) =>
            type.includes('pdf') ||
            name.endsWith('.pdf') ||
            type.includes('word') ||
            /\.(docx?|DOCX?)$/.test(name),
    },
    {
        icon: FileArchive,
        test: (type: string, name: string) =>
            type.includes('zip') ||
            type.includes('archive') ||
            /\.(zip|rar)$/i.test(name),
    },
    {
        icon: FileSpreadsheet,
        test: (type: string, name: string) =>
            type.includes('excel') || /\.xlsx?$/i.test(name),
    },
    { icon: Video, test: (type: string) => type.startsWith('video/') },
    { icon: Headphones, test: (type: string) => type.startsWith('audio/') },
    { icon: ImageIcon, test: (type: string) => type.startsWith('image/') },
];

function getFileIcon(file: FileWithPreview['file']): LucideIcon {
    const type = file.type || '';
    const name = file.name || '';
    const found = iconMap.find((m) => m.test(type, name));
    return found ? found.icon : FileIcon;
}


interface FileCardProps {
    fileWrapper: FileWithPreview;
    onRemove: () => void;
    onRename: (newName: string) => void;
    texts: FileUploadTexts;
    disabled?: boolean;
}

function FileCard({
    fileWrapper,
    onRemove,
    onRename,
    texts,
    disabled = false,
}: FileCardProps) {
    const [isRenaming, setIsRenaming] = React.useState(false);

    const [fileName, setFileName] = React.useState(
        fileWrapper.title || fileWrapper.file.name,
    );

    const inputRef = React.useRef<HTMLInputElement>(null);
    const Icon = getFileIcon(fileWrapper.file);

    React.useEffect(() => {
        if (isRenaming && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isRenaming, fileName]);

    const handleSaveRename = () => {
        if (!fileName.trim()) {
            inputRef.current?.focus();
            return;
        }
        const currentTitle = fileWrapper.title || fileWrapper.file.name;
        if (fileName !== currentTitle) {
            onRename(fileName);
        }
        setIsRenaming(false);
    };

    const handleCancelRename = () => {
        setFileName(fileWrapper.title || fileWrapper.file.name);
        setIsRenaming(false);
    };

    return (
        <div className="flex flex-col gap-1 rounded-lg border bg-input/30 p-2 pe-3 transition-all">
            <div className="flex items-center justify-between gap-2">
                <div className="flex flex-1 items-center gap-3 overflow-hidden">
                    <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded border">
                        <Icon className="size-5 text-muted-foreground" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        {isRenaming ? (
                            <div className="flex items-center gap-1">
                                <Input
                                    ref={inputRef}
                                    value={fileName}
                                    disabled={disabled}
                                    onChange={(e) =>
                                        setFileName(e.target.value)
                                    }
                                    className="mt-1 mr-1 h-7"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter')
                                            handleSaveRename();
                                        if (e.key === 'Escape')
                                            handleCancelRename();
                                    }}
                                />
                            </div>
                        ) : (
                            <p className="truncate text-sm font-medium">
                                {fileWrapper.title || ''}
                            </p>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <p>{formatBytes(fileWrapper.file.size)}</p>∙
                            <p>{fileWrapper.file.name}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <TooltipProvider>
                        {!disabled &&
                            (isRenaming ? (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={handleSaveRename}
                                            size="icon-sm"
                                            variant="secondary"
                                            type="button"
                                        >
                                            <Check />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {texts.renameFileAriaLabel}
                                    </TooltipContent>
                                </Tooltip>
                            ) : (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            onClick={() => setIsRenaming(true)}
                                            size="icon-sm"
                                            variant="ghost"
                                            type="button"
                                        >
                                            <PenLine />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {texts.renameFileAriaLabel}
                                    </TooltipContent>
                                </Tooltip>
                            ))}

                        {fileWrapper.preview && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        size="icon-sm"
                                        variant="ghost"
                                        type="button"
                                        asChild
                                    >
                                        <a
                                            href={fileWrapper.preview}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <SquareArrowOutUpRight />
                                        </a>
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {texts.previewFileAriaLabel}
                                </TooltipContent>
                            </Tooltip>
                        )}

                        {!disabled && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={onRemove}
                                        size="icon-sm"
                                        variant="outline"
                                        type="button"
                                    >
                                        <X />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {texts.removeFileAriaLabel}
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </TooltipProvider>
                </div>
            </div>
        </div>
    );
}

function FileUploadInner(
    {
        value,
        onValueChange,
        maxFiles = 6,
        maxSizeMB = 5,
        texts,
        accept,
        multiple = true,
        disabled = false,
        className,
        ...rest
    }: FileUploadProps,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    const maxSize = maxSizeMB * 1024 * 1024;

    const finalTexts = React.useMemo(
        () => ({
            dropAreaTitle: 'Upload files',
            dropAreaHeader: 'Drag & drop or browse files.',
            dropAreaSubtext: `Max ${maxFiles} files ∙ Up to ${maxSizeMB}MB ∙
            Accepted types: ${accept || 'all file types'}`,
            selectButton: 'Browse files',
            filesHeader: `Files uploaded`,
            removeAllButton: 'Remove all',
            removeFileAriaLabel: 'Remove file',
            renameFileAriaLabel: 'Rename file',
            previewFileAriaLabel: 'Preview file',
            errorPrefix: 'An error occured',
            FileUploadLabel: 'File Upload',
            AttachmentsLabel: 'Attachments',
            emptyAttachmentsText: 'No attachments uploaded yet.',
            ...texts,
        }),
        [texts, maxFiles, maxSizeMB, accept],
    );

    const handleFilesChange = React.useCallback(
        (newFiles: FileWithPreview[]) => {
            requestAnimationFrame(() => {
                onValueChange(newFiles);
            });
        },
        [onValueChange],
    );

    const initialFilesForHook = React.useMemo(() => {
        return value
            .map((v) => v.file)
            .filter((f): f is FileMetadata => !(f instanceof File));
    }, [value]);

    const [state, actions] = useFileUpload({
        multiple,
        accept: accept as string,
        maxFiles,
        maxSize,
        initialFiles: initialFilesForHook,
        onFilesChange: handleFilesChange,
    });

    React.useEffect(() => {
        if (state.errors.length > 0) {
            toast.error(finalTexts.errorPrefix, {
                description:
                    state.errors[0] || 'An error occurred during upload',
            });
        }
    }, [state.errors, finalTexts.errorPrefix]);

    const handleRename = (id: string, newName: string) => {
        const updatedFiles = value.map((fileWrapper) => {
            if (fileWrapper.id === id) {
                return { ...fileWrapper, title: newName };
            }
            return fileWrapper;
        });
        onValueChange(updatedFiles);
    };

    const inputProps = actions.getInputProps();

    return (
        <div className={cn('flex flex-col gap-4', className)}>
            {!disabled && (
                <div className="flex flex-col gap-2">
                    <Label>{finalTexts.FileUploadLabel}</Label>
                    <div
                        className={cn(
                            'relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed transition-colors',
                            state.isDragging &&
                            'border-ring bg-accent/50 ring-2 ring-ring/20',
                            'hover:bg-accent/20',
                        )}
                        onDragEnter={actions.handleDragEnter}
                        onDragLeave={actions.handleDragLeave}
                        onDragOver={actions.handleDragOver}
                        onDrop={actions.handleDrop}
                        data-onboarding="file-upload-dropzone"
                    >
                        <input
                            {...inputProps}
                            {...rest}
                            className="sr-only"
                            ref={(el) => {
                                const internalRef = inputProps.ref as {
                                    current: HTMLInputElement | null;
                                };
                                if (internalRef) {
                                    internalRef.current = el;
                                }
                                if (typeof ref === 'function') {
                                    ref(el);
                                } else if (ref) {
                                    (
                                        ref as {
                                            current: HTMLInputElement | null;
                                        }
                                    ).current = el;
                                }
                            }}
                        />

                        <Empty className="!gap-2 !p-8">
                            <EmptyHeader>
                                <EmptyMedia variant={'icon'}>
                                    <Paperclip />
                                </EmptyMedia>

                                <EmptyTitle>
                                    {finalTexts.dropAreaTitle}
                                </EmptyTitle>

                                <EmptyDescription className="flex flex-col">
                                    <span>{finalTexts.dropAreaHeader}</span>

                                    <span>{finalTexts.dropAreaSubtext}</span>
                                </EmptyDescription>
                            </EmptyHeader>

                            <EmptyContent>
                                <Button
                                    onClick={actions.openFileDialog}
                                    variant="outline"
                                    type="button"
                                    size={'sm'}
                                >
                                    {finalTexts.selectButton}
                                </Button>
                            </EmptyContent>
                        </Empty>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <Label>{finalTexts.AttachmentsLabel}</Label>
                {value.length != 0 ? (
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-foreground/80">
                                {finalTexts.filesHeader} ({value.length}{' '}
                                {maxFiles ? `/ ${maxFiles}` : ''})
                            </h3>
                            <Button
                                onClick={() => {
                                    actions.clearFiles();
                                }}
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                                type="button"
                                disabled={disabled}
                            >
                                <Trash2 />
                                {finalTexts.removeAllButton}
                            </Button>
                        </div>

                        <div className="grid gap-2">
                            {value.map((fileWrapper) => (
                                <FileCard
                                    key={fileWrapper.id}
                                    fileWrapper={fileWrapper}
                                    disabled={disabled}
                                    onRemove={() => {
                                        actions.removeFile(fileWrapper.id);
                                    }}
                                    onRename={(newName) =>
                                        handleRename(fileWrapper.id, newName)
                                    }
                                    texts={finalTexts}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                        {finalTexts.emptyAttachmentsText}
                    </div>
                )}
            </div>
        </div>
    );
}

export const FileUpload = React.forwardRef(FileUploadInner);

FileUpload.displayName = 'FileUpload';
