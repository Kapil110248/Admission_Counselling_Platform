import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ isOpen: false, message: '', type: 'error' });

  const showAlert = useCallback((message, type = 'error') => {
    setToast({ isOpen: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, isOpen: false }));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ showAlert }}>
      {children}
      <AnimatePresence>
        {toast.isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[99999] min-w-[320px] max-w-[90vw] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
              toast.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
              toast.type === 'info' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="h-6 w-6 text-green-600" /> : 
             toast.type === 'info' ? <Info className="h-6 w-6 text-blue-600" /> :
             <AlertCircle className="h-6 w-6 text-red-600" />}
            <span className="font-bold text-sm tracking-tight">{toast.message}</span>
            <button onClick={() => setToast(prev => ({...prev, isOpen: false}))} className="ml-auto opacity-70 hover:opacity-100 flex-shrink-0">
               <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ToastContext.Provider>
  );
};
