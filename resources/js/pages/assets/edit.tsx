// resources/js/pages/assets/edit.tsx

// Necessary imports
import { Head, Link, useForm } from '@inertiajs/react';

// Layout
import AppLayout from '@/layouts/app/layout';

// Translation Hook
import { useTrans } from '@/lib/translation';

// Hooks
import { FileWithPreview } from '@/hooks/use-file-upload';

// Custom components
import { DeleteAsset } from '@/pages/assets/delete';
import {
    AttachmentsTab,
    AttributesTab,
    InformationsTab,
} from '@/pages/assets/form';

// Shadnc UI Components
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type { Asset, AssetAttribute, BreadcrumbItem } from '@/types';

// Icons
import { convertAttachmentsToFileWithPreview } from '@/lib/utils';
import { ArrowLeft, Blocks, File, Paperclip, Plus, Trash2 } from 'lucide-react';

export default function Edit({
    asset,
    assets,
    attribute_keys,
}: {
    asset: Asset;
    assets: Asset[];
    attribute_keys: string[];
}) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('dashboard.pages.breadcrumbs.dashboard'),
            href: route('dashboard'),
        },
        {
            title: __('assets.pages.breadcrumbs.index'),
            href: route('assets.index'),
        },
        {
            title: __('assets.pages.breadcrumbs.edit'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={__('assets.pages.edit.head_title', undefined, {
                    title: asset.title,
                })}
            />

            <EditForm
                asset={asset}
                assets={assets}
                attribute_keys={attribute_keys}
            />
        </AppLayout>
    );
}

function EditForm({
    asset,
    assets,
    attribute_keys,
}: {
    asset: Asset;
    assets?: Asset[];
    attribute_keys?: string[];
}) {
    const __ = useTrans();

    const { data, setData, processing, errors, post } = useForm<{
        title: string;
        parent_id: string;
        icon: string;
        description: string;
        attributes: AssetAttribute[];
        attachments: FileWithPreview[];
    }>({
        title: asset.title,
        parent_id: asset.parent_id || '',
        icon: asset.icon || '',
        description: asset.description || '',
        attributes: asset.attributes || [],
        attachments: convertAttachmentsToFileWithPreview({
            attachments: asset.attachments,
        }),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assets.update', { asset: asset.id }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {__('assets.pages.edit.title', undefined, {
                        title: asset.title,
                    })}
                </CardTitle>
                <CardDescription>
                    {__('assets.pages.edit.description', undefined, {
                        title: asset.title,
                    })}
                </CardDescription>
                <CardAction className="space-x-2">
                    <Button asChild variant={'secondary'}>
                        <Link href={route('assets.index')}>
                            <ArrowLeft />
                            Go back to assets
                        </Link>
                    </Button>
                    <DeleteAsset asset={asset}>
                        <Button variant={'destructive'}>
                            <Trash2 />
                            Delete asset
                        </Button>
                    </DeleteAsset>
                </CardAction>
            </CardHeader>
            <Separator />

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <CardContent>
                    <Tabs
                        defaultValue={'informations'}
                        className="w-full space-y-4"
                    >
                        <TabsList className="w-full">
                            <TabsTrigger value={'informations'}>
                                <File />
                                Informations
                            </TabsTrigger>
                            <TabsTrigger value={'attributes'}>
                                <Blocks />
                                Attributes
                            </TabsTrigger>
                            <TabsTrigger value={'attachments'}>
                                <Paperclip />
                                Attachments
                            </TabsTrigger>
                        </TabsList>

                        <InformationsTab
                            assets={assets}
                            errors={errors}
                            data={data}
                            setData={setData}
                        />
                        <AttributesTab
                            attribute_keys={attribute_keys}
                            errors={errors}
                            data={data}
                            setData={setData}
                        />
                        <AttachmentsTab
                            errors={errors}
                            data={data}
                            setData={setData}
                        />
                    </Tabs>
                </CardContent>
                <Separator className="my-6" />
                <CardFooter>
                    <Button disabled={processing} className="w-full">
                        {processing ? <Spinner /> : <Plus />}
                        Update asset
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}
