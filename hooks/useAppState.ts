import { useState, useCallback, useMemo } from 'react'
import { AppState, Step, Intent, ReadingResult, User } from '@/types'

const initialState: AppState = {
  currentStep: 'welcome',
  selectedIntent: null,
  uploadedImage: null,
  readingResult: null,
  user: null,
  isLoading: false,
  error: null
}

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState)

  const setCurrentStep = useCallback((step: Step) => {
    setState(prev => ({ ...prev, currentStep: step }))
  }, [])

  const setSelectedIntent = useCallback((intent: Intent) => {
    setState(prev => ({ ...prev, selectedIntent: intent }))
  }, [])

  const setUploadedImage = useCallback((imageUrl: string | null) => {
    setState(prev => ({ ...prev, uploadedImage: imageUrl }))
  }, [])

  const setReadingResult = useCallback((result: ReadingResult | null) => {
    setState(prev => ({ ...prev, readingResult: result }))
  }, [])

  const setUser = useCallback((user: User | null) => {
    setState(prev => ({ ...prev, user }))
  }, [])

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }))
  }, [])

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error }))
  }, [])

  const resetFlow = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 'welcome',
      selectedIntent: null,
      uploadedImage: null,
      readingResult: null
    }))
  }, [])

  const incrementFreeReadings = useCallback(() => {
    setState(prev => ({
      ...prev,
      user: prev.user ? {
        ...prev.user,
        freeReadingsCount: prev.user.freeReadingsCount + 1,
        totalReadings: prev.user.totalReadings + 1
      } : null
    }))
  }, [])

  const canReadForFree = useMemo(() => {
    if (!state.user) return true
    return state.user.freeReadingsCount < 4
  }, [state.user])

  const freeReadingsLeft = useMemo(() => {
    if (!state.user) return 4
    return Math.max(0, 4 - state.user.freeReadingsCount)
  }, [state.user])

  const hasActiveSubscription = useMemo(() => {
    if (!state.user?.subscription) return false
    return state.user.subscription.status === 'active' && 
           new Date() < state.user.subscription.endDate
  }, [state.user])

  return {
    ...state,
    setCurrentStep,
    setSelectedIntent,
    setUploadedImage,
    setReadingResult,
    setUser,
    setLoading,
    setError,
    resetFlow,
    incrementFreeReadings,
    canReadForFree,
    freeReadingsLeft,
    hasActiveSubscription
  }
}
