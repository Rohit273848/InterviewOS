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
          icon: <AlertTriangle className="w-5 h-5 text-accent-pink" />,
          accentClass: 'bg-accent-pink/10 border-accent-pink/20 shadow-[0_0_15px_rgba(244,114,182,0.08)]',
          confirmBtnClass: 'bg-gradient-to-r from-accent-pink to-rose-600 hover:from-pink-400 hover:to-rose-500 text-bg-primary shadow-lg shadow-accent-pink/10 hover:shadow-accent-pink/20 focus:ring-accent-pink',
          glowClass: 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),_0_0_40px_-5px_rgba(244,114,182,0.15)] border-accent-pink/20',
          topBarClass: 'bg-gradient-to-r from-accent-pink to-rose-600'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-accent-yellow" />,
          accentClass: 'bg-accent-yellow/10 border-accent-yellow/20 shadow-[0_0_15px_rgba(250,204,21,0.08)]',
          confirmBtnClass: 'bg-gradient-to-r from-accent-yellow to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-bg-primary shadow-lg shadow-accent-yellow/10 hover:shadow-accent-yellow/20 focus:ring-accent-yellow',
          glowClass: 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),_0_0_40px_-5px_rgba(250,204,21,0.12)] border-accent-yellow/20',
          topBarClass: 'bg-gradient-to-r from-accent-yellow to-amber-500'
        }
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5 text-accent-cyan" />,
          accentClass: 'bg-accent-cyan/10 border-accent-cyan/20 shadow-[0_0_15px_rgba(34,211,238,0.08)]',
          confirmBtnClass: 'bg-gradient-to-r from-accent-cyan to-blue-500 hover:from-cyan-400 hover:to-blue-500 text-bg-primary shadow-lg shadow-accent-cyan/10 hover:shadow-accent-cyan/20 focus:ring-accent-cyan',
          glowClass: 'shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),_0_0_40px_-5px_rgba(34,211,238,0.12)] border-accent-cyan/20',
          topBarClass: 'bg-gradient-to-r from-accent-cyan to-blue-500'
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
            {/* Backdrop with strong blur and color tint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="fixed inset-0 bg-bg-primary/80 backdrop-blur-md"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className={`relative bg-bg-secondary/95 border max-w-md w-full rounded-2xl overflow-hidden p-6 pt-7 select-none ${details.glowClass}`}
            >
              {/* Top Accent Bar */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${details.topBarClass}`} />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-tertiary/50 transition-colors"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </motion.button>

              <div className="flex gap-4 items-start">
                {/* Visual Icon Badge */}
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 ${details.accentClass}`}>
                  {details.icon}
                </div>

                <div className="flex-1 space-y-2">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-text-primary leading-snug tracking-tight">
                    {options.title || 'Confirm Action'}
                  </h3>

                  {/* Body Message */}
                  <p className="text-sm text-text-secondary leading-relaxed font-normal">
                    {message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancel}
                  className="px-4 py-2.5 text-xs font-bold rounded-xl border border-border-subtle bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-tertiary/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-secondary focus:ring-border-subtle"
                >
                  {options.cancelText || 'Cancel'}
                </motion.button>
                <motion.button
                  ref={confirmButtonRef}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-secondary ${details.confirmBtnClass}`}
                >
                  {options.confirmText || 'Confirm'}
                </motion.button>
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
