// resources/js/pages/assets/edit.tsx

// Necessary imports
import {
    convertAttachmentsToFileWithPreview,
    userHasPermission,
} from '@/lib/utils';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

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
import type {
    Asset,
    AssetAttribute,
    BreadcrumbItem,
    SharedData,
} from '@/types';

// Icons
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
                            {__('assets.pages.form.buttons.back')}
                        </Link>
                    </Button>
                    {userHasPermission({
                        user: usePage<SharedData>().props.auth.user,
                        permission: 'delete assets',
                    }) && (
                        <DeleteAsset asset={asset}>
                            <Button variant={'destructive'}>
                                <Trash2 />
                                {__('assets.pages.form.buttons.delete')}
                            </Button>
                        </DeleteAsset>
                    )}
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
                                {__('assets.pages.form.tabs.informations')}
                            </TabsTrigger>
                            <TabsTrigger value={'attributes'}>
                                <Blocks />
                                {__('assets.pages.form.tabs.attributes')}
                            </TabsTrigger>
                            <TabsTrigger value={'attachments'}>
                                <Paperclip />
                                {__('assets.pages.form.tabs.attachments')}
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
                            data={data}
                            setData={setData}
                        />
                        <AttachmentsTab data={data} setData={setData} />
                    </Tabs>
                </CardContent>
                <Separator className="my-6" />
                {userHasPermission({
                    user: usePage<SharedData>().props.auth.user,
                    permission: 'update assets',
                }) && (
                    <CardFooter>
                        <Button disabled={processing} className="w-full">
                            {processing ? <Spinner /> : <Plus />}
                            {__('assets.pages.form.buttons.update')}
                        </Button>
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}
