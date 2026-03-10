import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const colors = {
    danger: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-500',
      button: 'bg-red-500 hover:bg-red-600 shadow-red-500/20'
    },
    warning: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500',
      button: 'bg-[#c9a84c] hover:bg-[#b08840] shadow-[#c9a84c]/20'
    },
    info: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      text: 'text-blue-500',
      button: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20'
    }
  };

  const activeColor = colors[variant];

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-[#0c0a08]/95 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-[#1a1510] border border-[#c9a84c]/20 rounded-3xl overflow-hidden shadow-2xl"
          >
            {/* Ambient Background Effect */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 ${activeColor.bg} blur-[60px] pointer-events-none`} />

            {/* Header */}
            <div className="relative p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${activeColor.bg} border ${activeColor.border} flex items-center justify-center`}>
                  <AlertTriangle className={`w-4 h-4 ${activeColor.text}`} />
                </div>
                <h3 className="font-cinzel text-sm font-bold text-[#e8d5b0] tracking-widest uppercase">
                  {title}
                </h3>
              </div>
              <button 
                onClick={onCancel}
                className="p-1.5 text-[#4a3820] hover:text-[#c9a84c] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-[#a89070] text-sm leading-relaxed text-center font-medium">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-white/5 border border-white/10 text-[#e8d5b0]/60 rounded-xl font-cinzel text-[10px] font-bold tracking-widest hover:bg-white/10 transition-all uppercase"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-[1.5] px-6 py-3 ${activeColor.button} text-[#0c0a08] rounded-xl font-cinzel text-[10px] font-bold tracking-widest transition-all shadow-lg active:scale-95 uppercase`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
