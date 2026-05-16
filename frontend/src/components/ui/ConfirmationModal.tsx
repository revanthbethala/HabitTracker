import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, LogOut, X } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
  icon?: 'delete' | 'logout';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  icon = 'delete'
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-[var(--bg)] rounded-2xl shadow-2xl border border-[var(--border)] w-full max-w-sm overflow-hidden"
        >
          <div className="relative p-6 text-center">
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-1 rounded-full text-[var(--text)] hover:bg-[var(--social-bg)] transition-colors"
            >
              <X size={20} />
            </button>

            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              variant === 'danger' 
                ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' 
                : 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              {icon === 'logout' ? <LogOut size={32} /> : <AlertCircle size={32} />}
            </div>

            <h3 className="text-xl font-bold text-[var(--text-h)] mb-2 font-heading">
              {title}
            </h3>
            <p className="text-[var(--text)] text-sm mb-8 px-2 leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col gap-2">
              <Button 
                variant={variant === 'danger' ? 'danger' : 'primary'} 
                className="w-full py-3 text-base font-bold shadow-lg shadow-rose-500/10"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
              >
                {confirmText}
              </Button>
              <Button 
                variant="ghost" 
                className="w-full text-[var(--text)] hover:text-[var(--text-h)]"
                onClick={onClose}
              >
                {cancelText}
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
