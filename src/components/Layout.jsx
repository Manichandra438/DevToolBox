import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out flex flex-col h-screen",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}
            >
                <motion.div
                    className="p-6 border-b border-border flex items-center justify-between shrink-0"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                        DevTools
                    </h1>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 hover:bg-accent rounded-md"
                    >
                        <X size={20} />
                    </motion.button>
                </motion.div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto min-h-0">
                    {tools.map((tool, index) => {
                        const Icon = tool.icon;
                        const isActive = location.pathname === tool.path;
                        return (
                            <motion.div
                                key={tool.path}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <Link
                                    to={tool.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group relative overflow-hidden",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md"
                                            : "hover:bg-accent hover:text-accent-foreground"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-primary"
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        className="relative z-10"
                                    >
                                        <Icon size={20} />
                                    </motion.div>
                                    <span className="font-medium relative z-10">{tool.name}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                <motion.div
                    className="p-4 border-t border-border shrink-0"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={toggleTheme}
                        className="flex items-center justify-center gap-2 w-full p-2 rounded-lg hover:bg-accent transition-colors"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {isDark ? (
                                <motion.div
                                    key="sun"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Sun size={20} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="moon"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Moon size={20} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                    </motion.button>
                </motion.div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0">
                <header className="h-16 border-b border-border flex items-center px-4 lg:hidden bg-card shrink-0">
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleSidebar}
                        className="p-2 hover:bg-accent rounded-md"
                    >
                        <Menu size={24} />
                    </motion.button>
                    <span className="ml-4 font-semibold">Menu</span>
                </header>

                <div className="flex-1 overflow-y-auto p-4 lg:p-8">
                    <div className="max-w-5xl mx-auto">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={location.pathname}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                {children}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </main>
        </div>
    );
}
