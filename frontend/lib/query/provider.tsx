"use client"
import React, { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { getQueryClient } from './client'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools"

export const QueryProvider = ({ children }: { children: React.ReactNode }) => {

    const [queryClient] = useState(
        () => getQueryClient()
    )
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

