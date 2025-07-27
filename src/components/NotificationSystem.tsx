"use client"

import React, { useState, useEffect } from 'react'
import { X, Check, AlertCircle, Info, ShoppingCart } from 'lucide-react'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationSystemProps {
  notifications: Notification[]
  onRemove: (id: string) => void
}

const NotificationItem = ({ notification, onRemove }: { 
  notification: Notification
  onRemove: (id: string) => void 
}) => {
  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(notification.id)
      }, notification.duration)
      
      return () => clearTimeout(timer)
    }
  }, [notification.id, notification.duration, onRemove])

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <Check className="w-5 h-5 text-green-400" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />
      default:
        return <Info className="w-5 h-5 text-primary" />
    }
  }

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success':
        return 'border-green-400/30 bg-green-400/10'
      case 'error':
        return 'border-red-400/30 bg-red-400/10'
      case 'warning':
        return 'border-yellow-400/30 bg-yellow-400/10'
      case 'info':
        return 'border-blue-400/30 bg-blue-400/10'
      default:
        return 'border-primary/30 bg-primary/10'
    }
  }

  return (
    <div className={`
      relative p-4 rounded-lg border cyberpunk-border 
      ${getBorderColor()}
      backdrop-blur-sm
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
    `}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="font-orbitron text-sm font-bold text-foreground mb-1">
            {notification.title}
          </h4>
          <p className="text-sm text-muted-foreground font-mono">
            {notification.message}
          </p>
          {notification.action && (
            <button
              onClick={notification.action.onClick}
              className="mt-2 text-xs font-mono text-primary hover:text-primary/80 underline"
            >
              {notification.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Progress bar for timed notifications */}
      {notification.duration && notification.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-border/20 rounded-b-lg overflow-hidden">
          <div 
            className="h-full bg-primary transition-all linear"
            style={{
              animation: `shrink ${notification.duration}ms linear forwards`
            }}
          />
        </div>
      )}
    </div>
  )
}

export function NotificationSystem({ notifications, onRemove }: NotificationSystemProps) {
  if (notifications.length === 0) return null

  return (
    <>
      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slide-in-from-right-full {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-in {
          animation-duration: 300ms;
          animation-fill-mode: both;
        }
        .slide-in-from-right-full {
          animation-name: slide-in-from-right-full;
        }
      `}</style>
      
      <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md w-full">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onRemove={onRemove}
          />
        ))}
      </div>
    </>
  )
}

// Hook for managing notifications
export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000 // Default 5 seconds
    }
    setNotifications(prev => [...prev, newNotification])
    return id
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  // Convenience methods
  const showSuccess = (title: string, message: string, duration?: number) => {
    return addNotification({ type: 'success', title, message, duration })
  }

  const showError = (title: string, message: string, duration?: number) => {
    return addNotification({ type: 'error', title, message, duration })
  }

  const showInfo = (title: string, message: string, duration?: number) => {
    return addNotification({ type: 'info', title, message, duration })
  }

  const showWarning = (title: string, message: string, duration?: number) => {
    return addNotification({ type: 'warning', title, message, duration })
  }

  const showCartAdd = (itemName: string, onViewCart: () => void) => {
    return addNotification({
      type: 'success',
      title: 'Added to Cart',
      message: `${itemName} has been added to your cart.`,
      duration: 4000,
      action: {
        label: 'View Cart',
        onClick: onViewCart
      }
    })
  }

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showCartAdd
  }
}