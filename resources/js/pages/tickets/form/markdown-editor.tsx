import { MarkdownEditor as SharedMarkdownEditor } from '@/components/markdown/markdown-editor';
import { useTrans } from '@/lib/translation';

interface MarkdownEditorProps {
    value: string;
    onChange: (val: string) => void;
    disabled?: boolean;
}

export function MarkdownEditor({
    value,
    onChange,
    disabled,
}: MarkdownEditorProps) {
    const __ = useTrans();

    return (
        <SharedMarkdownEditor
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={__('tickets.pages.form.editor.placeholder')}
            variant="default"
            minHeight="400px"
        />
    );
}
