import React, { useState, useEffect } from 'react';
import { Copy, Trash2 } from 'lucide-react';
import ToolCard from '../components/ToolCard';
import { cn } from '../lib/utils';

export default function HtmlEntityTool() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode'); // 'encode' or 'decode'
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        if (!input) {
            setOutput('');
            return;
        }

        try {
            if (mode === 'encode') {
                setOutput(input.replace(/[\u00A0-\u9999<>&]/g, (i) => '&#' + i.charCodeAt(0) + ';'));
            } else {
                const txt = document.createElement("textarea");
                txt.innerHTML = input;
                setOutput(txt.value);
            }
        } catch (err) {
            setError('Invalid input for ' + mode);
        }
    }, [input, mode]);

    const handleCopy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <ToolCard
            title="HTML Entity Encoder/Decoder"
            description="Escape special characters to HTML entities or unescape them back to text."
        >
            <div className="grid gap-6">
                <div className="flex items-center justify-center">
                    <div className="bg-muted p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setMode('encode')}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                mode === 'encode' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => setMode('decode')}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                                mode === 'decode' ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            Decode
                        </button>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium">Input</label>
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
                            className="w-full h-64 p-4 rounded-lg border border-input bg-background focus:ring-2 focus:ring-ring focus:border-input resize-none font-mono text-sm"
                            placeholder={mode === 'encode' ? "Type text to encode..." : "Paste HTML entities to decode..."}
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
                                    "w-full h-64 p-4 rounded-lg border border-input bg-muted/50 focus:outline-none resize-none font-mono text-sm",
                                    error && "border-destructive focus:border-destructive"
                                )}
                                placeholder="Result will appear here..."
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
