import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useTrans } from '@/lib/translation';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';
import { FilterState } from './entries-toolbar';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    filters: FilterState;
}

export function ReportDialog({ open, onOpenChange, filters }: Props) {
    const __ = useTrans();
    const [formatType, setFormatType] = useState('excel');

    const handleDownload = () => {
        const params = new URLSearchParams();

        params.append('format', formatType);

        Object.entries(filters).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.append(key, value);
            }
        });

        window.location.href =
            route('tickets.entries.report') + '?' + params.toString();

        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>{__('entries.report.title')}</DialogTitle>
                    <DialogDescription>
                        {__('entries.report.description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="grid gap-3">
                        <Label>{__('entries.report.format')}</Label>
                        <Select
                            value={formatType}
                            onValueChange={setFormatType}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="excel">
                                    <div className="flex items-center gap-2">
                                        <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
                                        <span>
                                            {__('entries.report.formats.csv')}
                                        </span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="pdf">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-rose-600" />
                                        <span>
                                            {__('entries.report.formats.pdf')}
                                        </span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {__('entries.report.actions.cancel')}
                    </Button>
                    <Button onClick={handleDownload} className="gap-2">
                        <Download className="h-4 w-4" />
                        {__('entries.report.actions.download')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
