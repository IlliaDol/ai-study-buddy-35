import { Intent } from '@/types'
import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  // Sync with other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error)
        }
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      return () => window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue, removeValue] as const
}

// Specialized hooks for common use cases
export function useUserPreferences() {
  return useLocalStorage('user-preferences', {
    theme: 'light',
    language: 'uk',
    notifications: true,
    autoSave: true
  })
}

export function useReadingHistory() {
  return useLocalStorage('reading-history', [] as Array<{
    id: string
    result: {
      timestamp: Date
      intent: Intent
      imageUrl: string
      symbol: string
      message: string
      ritual: string
      color: string
    }
    createdAt: Date
    intent: Intent
  }>)
}

export function useUserSession() {
  return useLocalStorage('user-session', {
    freeReadingsCount: 0,
    totalReadings: 0,
    lastReadingDate: null as Date | null,
    subscription: null
  })
}

export function useAppSettings() {
  return useLocalStorage('app-settings', {
    animations: true,
    sound: false,
    quality: 'high',
    autoBackup: true
  })
}
