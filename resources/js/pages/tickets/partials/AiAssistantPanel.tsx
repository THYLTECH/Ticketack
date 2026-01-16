import React, { useState } from 'react';
import { useTrans } from '@/lib/translation';
import { Description, Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { CheckCircle, ChevronLeft, ChevronRight, MessageSquarePlus, Sparkles, XCircle } from 'lucide-react';

interface AiSuggestion {
    id: number;
    generated_content: {
        summary: string;
        steps: Array<{
            description: string;
            details?: string;
        }>;
        analysis: string;
        missing_info?: string;
    };
    confidence_score?: number;
    created_at?: string;
}

interface Props {
    ticketId: number;
    suggestions: AiSuggestion[];
    onAccept: (content: string) => void;
    onReject?: () => void;
}

export default function AiAssistantPanel({ ticketId, suggestions, onAccept, onReject }: Props) {
    const trans = useTrans();
    const t = (key: string, defaultVal?: string): string => trans(key) || defaultVal || key;

    const [activeIndex, setActiveIndex] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [isRejected, setIsRejected] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);

    // Follow-up state
    const [isRefining, setIsRefining] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If no suggestions, or rejected explicitly (visual hide), return null
    if (!suggestions || suggestions.length === 0 || isRejected) return null;

    const currentSuggestion = suggestions[activeIndex];

    const handleAcceptClick = () => {
        setIsOpen(true);
    };

    const confirmAccept = () => {
        const stepsFormatted = currentSuggestion.generated_content.steps
            .map((step, i) => `${i + 1}. **${step.description}**\n   ${step.details || ''}`)
            .join('\n\n');

        const contentToCopy = `**${t('tickets.ai_suggestion_accepted_header', 'AI Solution:')}**\n\n${stepsFormatted}`;

        onAccept(contentToCopy);
        setIsAccepted(true);
        setIsOpen(false);
    };

    const handleReject = () => {
        setIsRejected(true);
        if (onReject) onReject();
    };

    const handlePrevious = () => {
        if (activeIndex < suggestions.length - 1) {
            setActiveIndex(activeIndex + 1);
        }
    };

    const handleNext = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    };

    const submitRefinement = (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        setIsSubmitting(true);
        router.post(route('tickets.ai_followup', ticketId), {
            feedback: feedback
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRefining(false);
                setFeedback('');
                // Usually Inertia reload will update props, reset index to 0 (latest)
                setActiveIndex(0);
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <>
            <div className={`bg-white dark:bg-zinc-900 rounded-lg border border-purple-200 dark:border-purple-800 shadow-sm overflow-hidden mb-6 ${isAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-purple-50 dark:bg-purple-900/20 px-4 py-3 border-b border-purple-100 dark:border-purple-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                            {t('tickets.ai_assistant_title', 'Assistant IA')}
                        </h3>
                        {suggestions.length > 1 && (
                            <span className="text-xs text-purple-600 dark:text-purple-400 ml-2">
                                ({suggestions.length - activeIndex}/{suggestions.length})
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Navigation Buttons */}
                        {suggestions.length > 1 && (
                            <div className="flex items-center rounded-md border border-purple-200 dark:border-purple-700 bg-white dark:bg-zinc-800 mr-2">
                                <button
                                    onClick={handlePrevious}
                                    disabled={activeIndex >= suggestions.length - 1}
                                    className="p-1 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Précédent"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <div className="w-[1px] h-4 bg-purple-200 dark:bg-purple-700"></div>
                                <button
                                    onClick={handleNext}
                                    disabled={activeIndex <= 0}
                                    className="p-1 hover:bg-purple-50 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Suivant"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}

                        {currentSuggestion.confidence_score && (
                            <span className="text-xs font-mono text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded">
                                {(currentSuggestion.confidence_score * 100).toFixed(0)}%
                            </span>
                        )}
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            {t('tickets.ai_summary', 'Résumé')}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            {currentSuggestion.generated_content.summary}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            {t('tickets.ai_steps', 'Étapes suggérées')}
                        </h4>
                        <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                            {currentSuggestion.generated_content.steps.map((step, idx) => (
                                <li key={idx} className="flex gap-2">
                                    <span className="font-bold min-w-[1.5rem] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded flex items-center justify-center h-6 text-xs mt-0.5">
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">
                                            {typeof step === 'string' ? step : step.description}
                                        </p>
                                        {typeof step !== 'string' && step.details && (
                                            <p className="mt-1 text-slate-500 dark:text-slate-400">
                                                {step.details}
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {isRefining ? (
                        <form onSubmit={submitRefinement} className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                                {t('tickets.ai_refine_label', 'Précisez votre demande ou corrigez l\'IA')}
                            </label>
                            <textarea
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full text-sm rounded-md border-slate-300 dark:border-slate-700 dark:bg-zinc-800 focus:border-purple-500 focus:ring-purple-500 min-h-[80px] p-2"
                                placeholder={t('tickets.ai_refine_placeholder', 'Ex: Peux-tu détailler l\'étape 2 ?...')}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsRefining(false)}
                                    className="px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                >
                                    {t('common.cancel', 'Annuler')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !feedback.trim()}
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md shadow-sm disabled:opacity-50"
                                >
                                    {isSubmitting ? '...' : t('tickets.ai_refine_submit', 'Générer nouvelle réponse')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={handleReject}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors border border-transparent hover:border-red-200 dark:hover:border-red-800"
                            >
                                <XCircle className="w-4 h-4" />
                                {t('tickets.btn_reject', 'Refuser')}
                            </button>
                            <button
                                onClick={() => setIsRefining(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-300 dark:hover:bg-purple-900/40 rounded-md transition-colors border border-purple-200 dark:border-purple-800"
                            >
                                <MessageSquarePlus className="w-4 h-4" />
                                {t('tickets.btn_refine', 'Affiner')}
                            </button>
                            <button
                                onClick={handleAcceptClick}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 shadow-sm rounded-md transition-colors"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {t('tickets.btn_accept', 'Accepter')}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="w-full max-w-sm rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-xl border border-slate-200 dark:border-zinc-800">
                        <DialogTitle className="text-lg font-medium text-slate-900 dark:text-white">
                            {t('tickets.confirm_modal_title', 'Valider la solution')}
                        </DialogTitle>
                        <Description className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            {t('tickets.confirm_modal_body', 'Êtes-vous sûr que cette solution est valide ? Elle sera copiée dans le champ de réponse.')}
                        </Description>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-zinc-800 rounded-md transition-colors"
                            >
                                {t('common.cancel', 'Annuler')}
                            </button>
                            <button
                                onClick={confirmAccept}
                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md transition-colors shadow-sm"
                            >
                                {t('common.confirm', 'Confirmer')}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </>
    );
}
