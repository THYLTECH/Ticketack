import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Attachment, User, Permission } from '@/types';
import { FileWithPreview } from '@/hooks/use-file-upload';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNotificationDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const sameYear = date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (sameYear) {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
    });
  }

  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function convertAttachmentsToFileWithPreview({
  attachments,
}: {
  attachments: Attachment[];
}): FileWithPreview[] {

  return attachments.map((attachment) => {
    const fileMetadata = {
      name: attachment.file_name || attachment.title || String(attachment.id),
      url: attachment.url,
      type: attachment.mime_type || '',
      size: attachment.file_size || 0,
      id: String(attachment.id),
    };

    return {
      id: String(attachment.id),
      file: fileMetadata,
      preview: attachment.url,
      title: attachment.title,
      description: attachment.description,
    };
  });
}

export function userHasPermission({ user, permission }: { user: User; permission: string }): boolean {
    if (!user || !user.permissions) return false;
    return user.permissions.some((p: Permission) => p.name === permission);
}
