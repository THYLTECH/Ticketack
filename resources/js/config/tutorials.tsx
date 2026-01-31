import { OnboardingPage } from '@/components/onboarding/onboarding-provider';
import { OnboardingStep } from '@/components/onboarding/page-tutorial';
import { useTrans } from '@/lib/translation';
import { useMemo } from 'react';

export const useTutorials = (): Partial<Record<OnboardingPage, OnboardingStep[]>> => {
    const __ = useTrans();

    return useMemo(() => ({
        settings_appearance: [
            {
                id: 'theme',
                title: __('onboarding.settings.appearance.theme.title'),
                description: __('onboarding.settings.appearance.theme.description'),
                targetSelector: '[data-onboarding="appearance-theme"]',
                position: 'bottom',
                disableScroll: true,
            },
            {
                id: 'color',
                title: __('onboarding.settings.appearance.color.title'),
                description: __('onboarding.settings.appearance.color.description'),
                targetSelector: '[data-onboarding="appearance-color"]',
                position: 'bottom',
                disableScroll: true,
            },
        ],
        roles: [
            {
                id: 'table',
                title: __('onboarding.roles.table.title'),
                description: __('onboarding.roles.table.description'),
                targetSelector: '[data-onboarding="roles-table"]',
                position: 'top',
            },
        ],
        users: [
            {
                id: 'table',
                title: __('onboarding.users.table.title'),
                description: __('onboarding.users.table.description'),
                targetSelector: '[data-onboarding="users-table"]',
                position: 'top',
            },
        ],
        trash: [
            {
                id: 'tabs',
                title: __('onboarding.trash.tabs.title'),
                description: __('onboarding.trash.tabs.description'),
                targetSelector: '[data-onboarding="trash-tabs"]',
                position: 'bottom',
            },
            {
                id: 'retention',
                title: __('onboarding.trash.retention.title'),
                description: __('onboarding.trash.retention.description'),
                targetSelector: '[data-onboarding="trash-retention"]',
                position: 'bottom',
            },
            {
                id: 'table',
                title: __('onboarding.trash.table.title'),
                description: __('onboarding.trash.table.description'),
                targetSelector: '[data-onboarding="trash-table"]',
                position: 'top',
            },
        ],
    }), [__]);
};
