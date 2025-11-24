import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Minimize2, Maximize2 } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { cn } from '../lib/utils';

export default function JsonTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState(null);
    const [indentSize, setIndentSize] = useState(2);

    useEffect(() => {
        setError(null);
        if (!input) {
            setOutput('');
            return;
        }

        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, indentSize));
        } catch (err) {
            setError(err.message);
        }
    }, [input, indentSize]);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const minify = () => {
        setIndentSize(0);
    };

    const format = () => {
        setIndentSize(2);
    };

    return (
        <ToolCard
            title="JSON Formatter/Minifier"
            description="Format JSON with proper indentation or minify it to save space."
        >
            <div className="grid gap-6">
                <div className="flex items-center justify-center">
                    <div className="bg-muted p-1 rounded-lg flex items-center">
                        <button
                            onClick={format}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                indentSize > 0 ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Maximize2 size={16} />
                            Format
                        </button>
                        <button
                            onClick={minify}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2",
                                indentSize === 0 ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <Minimize2 size={16} />
                            Minify
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Input JSON</label>
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
                            className="w-full h-[500px] p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-input resize-none font-mono text-sm"
                            placeholder="Paste JSON here..."
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Output</label>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleCopy(output)}
                                    className="p-1.5 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                                    title="Copy"
                                >
                                    <Copy size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <textarea
                                readOnly
                                value={output}
                                className={cn(
                                    "w-full h-[500px] p-4 rounded-lg border border-input bg-muted/50 focus:outline-none resize-none font-mono text-sm",
                                    error && "border-destructive focus:border-destructive"
                                )}
                                placeholder="Formatted JSON will appear here..."
                            />
                            {error && (
                                <div className="absolute bottom-4 left-4 right-4 text-destructive text-sm bg-destructive/10 p-2 rounded border border-destructive/20">
                                    {error}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </ToolCard>
    );
}
