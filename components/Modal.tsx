import React, { useEffect, useRef } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md transition-all duration-300"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.1)] w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col animate-[fadeInScale_0.3s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-50 sticky top-0 bg-white/90 backdrop-blur-sm z-20">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2.5 bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
};