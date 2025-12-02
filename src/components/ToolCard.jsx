import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function ToolCard({ title, description, children, className }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ y: -2 }}
            className={cn("bg-card rounded-xl border border-border shadow-sm overflow-hidden transition-shadow hover:shadow-lg", className)}
        >
            <motion.div
                className="p-6 border-b border-border bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
            >
                <h2 className="text-xl font-semibold">{title}</h2>
                {description && <p className="text-muted-foreground mt-1">{description}</p>}
            </motion.div>
            <motion.div
                className="p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.3 }}
            >
                {children}
            </motion.div>
        </motion.div>
    );
}
