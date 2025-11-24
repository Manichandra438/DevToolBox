import React from 'react';
import { cn } from '../lib/utils';

export default function ToolCard({ title, description, children, className }) {
    return (
        <div className={cn("bg-card rounded-xl border border-border shadow-sm overflow-hidden", className)}>
            <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="text-xl font-semibold">{title}</h2>
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
