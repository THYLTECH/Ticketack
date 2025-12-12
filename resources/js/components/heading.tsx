export default function Heading({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="mb-8 border-b pb-4 flex items-center justify-between">
            <div className="space-y-0.5">
                <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
                {description && (
                    <p className="text-sm text-muted-foreground">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
