import React from 'react';
import { motion } from 'framer-motion';
import { Copyright } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-gray-800 bg-gray-900/95 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          className="flex items-center justify-center gap-2 text-gray-400 text-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Copyright className="w-4 h-4" />
          <span>{currentYear} TapAss. All rights reserved.</span>
        </motion.div>
      </div>
    </footer>
  );
}; 