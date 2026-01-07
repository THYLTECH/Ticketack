import AppLogoIcon from '@/components/app-logo-icon';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useInitials } from '@/hooks/use-initials';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTrans } from '@/lib/translation';
import { userHasPermission } from '@/lib/utils';
import type { NavItem, SharedData, User } from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Bell,
    BookOpen,
    Calendar,
    ChevronsUpDown,
    Clock,
    Folder,
    Home,
    LayoutGrid,
    ListTree,
    LogOut,
    Plus,
    Settings,
    Shield,
    Sparkles,
    Ticket,
    Trash2,
    Users,
} from 'lucide-react';
import { type ComponentPropsWithoutRef } from 'react';

interface UserMenuContentProps {
    user: User;
    unread_notifications: number;
}

export function AppSidebar() {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    const mainNavItems: NavItem[] = [
        {
            title: __('app.layout.sidebar.menugroups.platform.items.home'),
            href: route('home'),
            icon: Home,
        },
        {
            title: __('app.layout.sidebar.menugroups.platform.items.dashboard'),
            href: route('dashboard'),
            icon: LayoutGrid,
        },
    ];

    if (userHasPermission({ user: auth.user, permission: 'view planning' })) {
        mainNavItems.push({
            title: __('app.layout.sidebar.menugroups.platform.items.planning'),
            href: route('tickets.planning.index'),
            icon: Calendar,
        });
    }

    if (
        userHasPermission({
            user: auth.user,
            permission: 'view ticket entries',
        })
    ) {
        mainNavItems.push({
            title: __('app.layout.sidebar.menugroups.platform.items.entries'),
            href: route('tickets.entries.index'),
            icon: Clock,
        });
    }

    if (userHasPermission({ user: auth.user, permission: 'view knowledge explorer' })) {
        mainNavItems.push({
            title: __('app.layout.sidebar.menugroups.platform.items.tickets'),
            href: route('tickets.index'),
            icon: Ticket,
        });

        mainNavItems.push({
            title: __('knowledge.pages.search.title'),
            href: route('knowledge.search'),
            icon: Sparkles,
        });
    }

    if (userHasPermission({ user: auth.user, permission: 'view assets' })) {
        mainNavItems.push({
            title: __('app.layout.sidebar.menugroups.platform.items.assets'),
            href: route('assets.index'),
            icon: ListTree,
        });
    }

    if (userHasPermission({ user: auth.user, permission: 'view users' })) {
        mainNavItems.push({
            title: __('app.layout.sidebar.menugroups.platform.items.users'),
            href: route('users.index'),
            icon: Users,
        });
    }

    if (userHasPermission({ user: auth.user, permission: 'view roles' })) {
        mainNavItems.push({
            title: __('app.layout.sidebar.menugroups.platform.items.roles'),
            href: route('roles.index'),
            icon: Shield,
        });
    }

    const footerNavItems: NavItem[] = [
        {
            title: __('app.layout.sidebar.menugroups.footer.items.repository'),
            href: 'https://github.com/THYLTECH/Ticketack',
            icon: Folder,
            external: true,
        },
        {
            title: __(
                'app.layout.sidebar.menugroups.footer.items.documentation',
            ),
            href: '/docs/api',
            icon: BookOpen,
            external: true,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant={'floating'}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={route('home')} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem className="mt-2 px-2 pb-2 group-data-[collapsible=icon]:px-0">
                        <SidebarMenuButton
                            asChild
                            variant="default"
                            className="w-full justify-center gap-2 bg-primary text-primary-foreground shadow-sm transition-all group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:p-0 hover:bg-primary/90"
                        >
                            <Link href={route('tickets.create')}>
                                <Plus className="size-4 shrink-0" />
                                <span className="font-semibold group-data-[collapsible=icon]:hidden">
                                    {__(
                                        'app.layout.sidebar.actions.create_ticket',
                                    )}
                                </span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>{' '}
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavTrash />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

function NavTrash() {
    const __ = useTrans();
    const { auth } = usePage<SharedData>().props;

    if (!userHasPermission({ user: auth.user, permission: 'view trash' })) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton
                    asChild
                    className="text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive data-[active=true]:bg-destructive/10 data-[active=true]:text-destructive"
                    isActive={route().current('trash.*')}
                >
                    <Link href={route('trash.index')}>
                        <Trash2 />
                        <span>
                            {__(
                                'app.layout.sidebar.menugroups.platform.items.trash',
                            )}
                        </span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    return (
        <SidebarGroup
            {...props}
            className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}
        >
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => {
                        const url =
                            typeof item.href === 'string'
                                ? item.href
                                : item.href.url;
                        const isExternal = item.external ?? false;

                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    {isExternal ? (
                                        <a
                                            href={url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="h-4 w-4"
                                                />
                                            )}
                                            <span>{item.title}</span>
                                        </a>
                                    ) : (
                                        <Link href={url} prefetch>
                                            {item.icon && (
                                                <Icon
                                                    iconNode={item.icon}
                                                    className="h-4 w-4"
                                                />
                                            )}
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}

function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                            asChild
                            isActive={page.url.startsWith(
                                typeof item.href === 'string'
                                    ? item.href
                                    : item.href.url,
                            )}
                            tooltip={{ children: item.title }}
                        >
                            <Link href={item.href} prefetch>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

function NavUser() {
    const { auth, unread_notifications } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <UserMenuContent
                            user={auth.user}
                            unread_notifications={unread_notifications}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}

function UserMenuContent({ user, unread_notifications }: UserMenuContentProps) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
    };

    const __ = useTrans();

    return (
        <>
            <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} />
                </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full"
                        href={route('notifications.index')}
                        as="button"
                    >
                        <Bell />
                        {__('app.layout.sidebar.usermenu.items.notifications')}

                        {unread_notifications > 0 && (
                            <Badge variant={'default'} className="ml-auto">
                                {unread_notifications}
                            </Badge>
                        )}
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link
                        className="block w-full"
                        href={route('settings.profile.edit')}
                        as="button"
                        prefetch
                        onClick={cleanup}
                    >
                        <Settings />
                        {__('app.layout.sidebar.usermenu.items.settings')}
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link
                    className="block w-full"
                    href={route('auth.logout')}
                    as="button"
                    onClick={handleLogout}
                    data-test="logout-button"
                >
                    <LogOut className="mr-2" />
                    {__('app.layout.sidebar.usermenu.items.logout')}
                </Link>
            </DropdownMenuItem>
        </>
    );
}

function UserInfo({ user }: { user: User }) {
    const getInitials = useInitials();

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage
                    src={user.avatar?.url ?? undefined}
                    alt={user.name}
                />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                </span>
            </div>
        </>
    );
}

function AppLogo() {
    const { name } = usePage<SharedData>().props;

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    {name}
                </span>
            </div>
        </>
    );
}
