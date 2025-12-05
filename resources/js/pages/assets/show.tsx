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
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
import type {
    Asset,
    AssetAttribute,
    BreadcrumbItem,
    SharedData,
} from '@/types';

// Icons
import { ArrowLeft, Blocks, File, Paperclip, Pen } from 'lucide-react';

export default function Show({
    asset,
    assets,
}: {
    asset: Asset;
    assets: Asset[];
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
            title: __('assets.pages.breadcrumbs.show'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={__('assets.pages.show.head_title', undefined, {
                    title: asset.title,
                })}
            />

            <ShowForm asset={asset} assets={assets} attribute_keys={[]} />
        </AppLayout>
    );
}

function ShowForm({
    asset,
    assets,
    attribute_keys,
}: {
    asset: Asset;
    assets?: Asset[];
    attribute_keys?: string[];
}) {
    const __ = useTrans();

    const { data, setData, errors } = useForm<{
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

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {__('assets.pages.show.title', undefined, {
                        title: asset.title,
                    })}
                </CardTitle>
                <CardDescription>
                    {__('assets.pages.show.description', undefined, {
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
                        permission: 'update assets',
                    }) && (
                        <Button asChild variant={'default'}>
                            <Link
                                href={route('assets.edit', { asset: asset.id })}
                            >
                                <Pen />
                                {__('assets.pages.form.buttons.edit')}
                            </Link>
                        </Button>
                    )}
                </CardAction>
            </CardHeader>
            <Separator />

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
                        disabled
                    />
                    <AttributesTab
                        attribute_keys={attribute_keys}
                        data={data}
                        setData={setData}
                        disabled
                    />
                    <AttachmentsTab data={data} setData={setData} disabled />
                </Tabs>
            </CardContent>
        </Card>
    );
}
