'use client'

import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'

interface ToolContextType {
  isToolLoading: boolean
  setToolLoading: (loading: boolean) => void
}

const ToolContext = createContext<ToolContextType | undefined>(undefined)

interface ToolProviderProps {
  children: ReactNode
}

export function ToolProvider({ children }: Readonly<ToolProviderProps>) {
  const [isToolLoading, setIsToolLoading] = useState(false)

  const setToolLoading = (loading: boolean) => {
    setIsToolLoading(loading)
  }

  const value = useMemo(
    () => ({
      isToolLoading,
      setToolLoading,
    }),
    [isToolLoading]
  )

  return <ToolContext.Provider value={value}>{children}</ToolContext.Provider>
}

export function useToolContext() {
  const context = useContext(ToolContext)
  if (context === undefined) {
    throw new Error('useToolContext must be used within a ToolProvider')
  }
  return context
}
