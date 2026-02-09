
import { VerifyPayment } from '@/components/verify-payment';
import { Suspense } from 'react';

const  page = async({params}:{params:Promise<{session_id:string}>}) => {

    const {session_id} = await params
  
    
  return (
   
   <Suspense>
    <VerifyPayment session_id={session_id } />
   </Suspense>
  )
}

export default page
