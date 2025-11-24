import React, { useState, useEffect } from 'react';
import { Copy, Trash2, AlertTriangle } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { cn } from '../lib/utils';

export default function JwtTool() {
    const [input, setInput] = useState('');
    const [header, setHeader] = useState('');
    const [payload, setPayload] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        if (!input) {
            setHeader('');
            setPayload('');
            return;
        }

        try {
            const parts = input.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format (must have 3 parts separated by dots)');
            }

            const decodePart = (part) => {
                try {
                    return JSON.stringify(JSON.parse(atob(part.replace(/-/g, '+').replace(/_/g, '/'))), null, 2);
                } catch (e) {
                    throw new Error('Failed to decode part');
                }
            };

            setHeader(decodePart(parts[0]));
            setPayload(decodePart(parts[1]));
        } catch (err) {
            setError(err.message);
            setHeader('');
            setPayload('');
        }
    }, [input]);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <ToolCard
            title="JWT Decoder"
            description="Decode JSON Web Tokens to view their header and payload."
        >
            <div className="grid gap-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Encoded Token</label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setInput('')}
                                className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                title="Clear"
                            >
                                <Trash2 size={16} />
                            </button>
                            <button
                                onClick={() => handleCopy(input)}
                                className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={cn(
                            "w-full h-32 p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-input resize-none font-mono text-sm",
                            error && "border-destructive focus:border-destructive"
                        )}
                        placeholder="Paste JWT here..."
                    />
                    {error && (
                        <div className="flex items-center gap-2 text-destructive text-sm mt-2">
                            <AlertTriangle size={16} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Header</label>
                            <button
                                onClick={() => handleCopy(header)}
                                className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={header}
                            className="w-full h-64 p-4 rounded-lg border border-input bg-muted/50 focus:outline-none resize-none font-mono text-sm"
                            placeholder="Header will appear here..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Payload</label>
                            <button
                                onClick={() => handleCopy(payload)}
                                className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                title="Copy"
                            >
                                <Copy size={16} />
                            </button>
                        </div>
                        <textarea
                            readOnly
                            value={payload}
                            className="w-full h-64 p-4 rounded-lg border border-input bg-muted/50 focus:outline-none resize-none font-mono text-sm"
                            placeholder="Payload will appear here..."
                        />
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
