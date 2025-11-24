import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Binary,
    Link as LinkIcon,
    FileJson,
    ShieldCheck,
    Code2,
    Menu,
    X,
    Moon,
    Sun
} from 'lucide-react';
import { cn } from '../lib/utils';

const tools = [
    { path: '/base64', name: 'Base64', icon: Binary },
    { path: '/url', name: 'URL Encoder', icon: LinkIcon },
    { path: '/json', name: 'JSON Formatter', icon: FileJson },
    { path: '/jwt', name: 'JWT Decoder', icon: ShieldCheck },
    { path: '/html', name: 'HTML Entities', icon: Code2 },
];

export default function Layout({ children }) {
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDark, setIsDark] = useState(true); // Default to dark mode

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const toggleTheme = () => {
        setIsDark(!isDark);
        document.documentElement.classList.toggle('dark');
    };

    // Initialize theme on mount
    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <div className="min-h-screen bg-background text-foreground flex transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:transform-none",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-border flex items-center justify-between">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                            DevTools
                        </h1>
                        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-accent rounded-md">
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {tools.map((tool) => {
                            const Icon = tool.icon;
                            const isActive = location.pathname === tool.path;
                            return (
                                <Link
                                    key={tool.path}
                                    to={tool.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    <Icon size={20} />
                                    <span className="font-medium">{tool.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-border">
                        <button
                            onClick={toggleTheme}
                            className="flex items-center justify-center gap-2 w-full p-2 rounded-lg hover:bg-accent transition-colors"
                        >
                            {isDark ? <Sun size={20} /> : <Moon size={20} />}
                            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 border-b border-border flex items-center px-4 lg:hidden bg-card">
                    <button onClick={toggleSidebar} className="p-2 hover:bg-accent rounded-md">
                        <Menu size={24} />
                    </button>
                    <span className="ml-4 font-semibold">Menu</span>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
