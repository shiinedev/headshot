import { useMutation, useQuery } from "@tanstack/react-query"
import { paymentService } from "../services/payment"
import { ProcessPaymentParams } from "@/lib/types"
import { toast } from "sonner"
import { useRouter } from "next/dist/client/components/navigation"


export const userGetCreditPackages = () => {
    return useQuery({
        queryKey: ['credit-packages'],
        queryFn: async () => paymentService.getPackages(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry:2
    })
}


export const useProcessPayment = () =>{
    const router = useRouter();
    return useMutation({
        mutationFn: (data:ProcessPaymentParams) => paymentService.processPayment(data),
        onSuccess: (data) => {

            console.log('data',data);
            
            if(data.redirectUrl){
                window.location.href = data.redirectUrl
            }else{
                toast.success("Payment processed successfully!");
                router.push("dashboard/user/credits")
            }
        },
         onError: (error) => {
            toast.error(error.message || 'Failed to process payment');
        }
    })
}



export const useGetPaymentHistory = (limit?: number) =>{
    return useQuery({
        queryKey: ['payment-history',limit],
        queryFn: async () => paymentService.getPaymentHistory(limit),
        staleTime: 5 * 60 * 1000, // 5 minutes
        retry:2
    })
}