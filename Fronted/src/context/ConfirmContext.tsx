import React, { createContext, useContext, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Info, X } from 'lucide-react'

export interface ConfirmOptions {
  title?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
}

interface ConfirmContextType {
  confirm: (message: string, options?: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | null>(null)

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [options, setOptions] = useState<ConfirmOptions>({})
  
  const resolveRef = useRef<(value: boolean) => void>()
  const confirmButtonRef = useRef<HTMLButtonElement>(null)

  const confirm = (msg: string, opts: ConfirmOptions = {}) => {
    setMessage(msg)
    setOptions(opts)
    setIsOpen(true)
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve
    })
  }

  const handleConfirm = () => {
    setIsOpen(false)
    if (resolveRef.current) {
      resolveRef.current(true)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    if (resolveRef.current) {
      resolveRef.current(false)
    }
  }

  // Keyboard navigation & accessibility
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        handleConfirm()
      }
    }

    // Small delay to auto-focus confirm button
    const timer = setTimeout(() => {
      confirmButtonRef.current?.focus()
    }, 50)

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timer)
    }
  }, [isOpen])

  // Get color and icon details based on confirmation variant
  const getVariantDetails = () => {
    const variant = options.variant || 'info'
    switch (variant) {
      case 'danger':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-pink-500" />,
          accentClass: 'border-pink-500/30 bg-pink-500/10',
          confirmBtnClass: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/20 focus:ring-pink-500/50',
          cancelBtnClass: 'border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white',
          glowClass: 'shadow-[0_0_30px_rgba(244,114,182,0.15)] border-pink-500/20'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-yellow-500" />,
          accentClass: 'border-yellow-500/30 bg-yellow-500/10',
          confirmBtnClass: 'bg-yellow-500 hover:bg-yellow-600 text-slate-950 font-extrabold focus:ring-yellow-500/50',
          cancelBtnClass: 'border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white',
          glowClass: 'shadow-[0_0_30px_rgba(250,204,21,0.15)] border-yellow-500/20'
        }
      case 'info':
      default:
        return {
          icon: <Info className="w-6 h-6 text-cyan-400" />,
          accentClass: 'border-cyan-400/30 bg-cyan-400/10',
          confirmBtnClass: 'bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-extrabold focus:ring-cyan-500/50',
          cancelBtnClass: 'border-slate-800 text-slate-400 hover:bg-slate-850 hover:text-white',
          glowClass: 'shadow-[0_0_30px_rgba(34,211,238,0.15)] border-cyan-500/20'
        }
    }
  }

  const details = getVariantDetails()

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={`relative bg-slate-900 border max-w-md w-full rounded-2xl overflow-hidden shadow-2xl p-6 select-none ${details.glowClass}`}
            >
              {/* Close Button */}
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-4">
                {/* Visual Icon Badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center ${details.accentClass}`}>
                  {details.icon}
                </div>

                <div className="flex-1 space-y-2">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-white leading-snug">
                    {options.title || 'Confirm Action'}
                  </h3>

                  {/* Body Message */}
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    {message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 text-xs font-bold rounded-xl border bg-transparent transition-all hover:scale-[1.02] active:scale-[0.98] ${details.cancelBtnClass}`}
                >
                  {options.cancelText || 'Cancel'}
                </button>
                <button
                  ref={confirmButtonRef}
                  onClick={handleConfirm}
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${details.confirmBtnClass}`}
                >
                  {options.confirmText || 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  )
}

export const useConfirm = () => {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context.confirm
}
