"use client"
import { Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

const page = () => {

    const searchparams = useSearchParams();
    const session_id = searchparams.get('session_id');
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

export default page
