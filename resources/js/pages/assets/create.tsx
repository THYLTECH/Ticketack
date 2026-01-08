// resources/js/pages/assets/create.tsx

// Necessary imports
import { userHasPermission } from '@/lib/utils';
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
import { ArrowLeft, Blocks, File, Paperclip, Plus } from 'lucide-react';

export default function Create({
    assets,
    attribute_keys,
}: {
    assets: Asset[];
    attribute_keys: string[];
}) {
    const __ = useTrans();

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('home.pages.breadcrumbs.home'),
            href: route('home'),
        },
        {
            title: __('assets.pages.breadcrumbs.index'),
            href: route('assets.index'),
        },
        {
            title: __('assets.pages.breadcrumbs.create'),
            href: '#',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('assets.pages.create.head_title')} />

            <CreateForm assets={assets} attribute_keys={attribute_keys} />
        </AppLayout>
    );
}

function CreateForm({
    assets,
    attribute_keys,
}: {
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
        title: '',
        parent_id: '',
        icon: '',
        description: '',
        attributes: [],
        attachments: [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('assets.store'));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{__('assets.pages.create.title')}</CardTitle>
                <CardDescription>
                    {__('assets.pages.create.description')}
                </CardDescription>
                <CardAction>
                    <Button asChild variant={'secondary'}>
                        <Link href={route('assets.index')}>
                            <ArrowLeft />
                            {__('assets.pages.form.buttons.back')}
                        </Link>
                    </Button>
                </CardAction>
            </CardHeader>
            <Separator />

            <form onSubmit={handleSubmit}>
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
                    permission: 'create assets',
                }) && (
                    <CardFooter>
                        <Button disabled={processing} className="w-full">
                            {processing ? <Spinner /> : <Plus />}
                            {__('assets.pages.form.buttons.store')}
                        </Button>
                    </CardFooter>
                )}
            </form>
        </Card>
    );
}
