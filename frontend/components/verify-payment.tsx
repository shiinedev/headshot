"use client"
import { Loader2 } from 'lucide-react';
import { useRouter} from 'next/navigation'
import React, { useEffect } from 'react'
import { Skeleton } from "@/components/ui/skeleton";


export const VerifyPayment = ({session_id}:{session_id: string | null}) => {

 
    const router = useRouter();

    useEffect(() =>{

        if(!session_id){
            router.push("/dashboard/user/credits")
        }

        const timer = setTimeout(() =>{
            router.push("/dashboard/user/credits")
        },5000);


        return () => clearTimeout(timer);

    },[session_id,router])
    
  return (
   
   <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Payment Successful!</h2>
        <p className="text-sm text-muted-foreground">
          Processing your credits...
        </p>
      </div>
    </div>
  )
}


export function LoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-4 text-center">
        {/* Icon placeholder */}
        <Skeleton className="mx-auto h-12 w-12 rounded-full" />

        {/* Title */}
        <Skeleton className="mx-auto h-6 w-48" />

        {/* Description */}
        <Skeleton className="mx-auto h-4 w-64" />
      </div>
    </div>
  );
}

