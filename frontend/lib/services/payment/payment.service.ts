import { api } from "@/lib/api";
import { ProcessPaymentResponse,ProcessPaymentParams, CreditPackage, Order } from "@/lib/types";


export const paymentService = {

    getPackages: async ():Promise<CreditPackage[]> =>{
        return  await api.get<CreditPackage[]>("/payment/packages");
    },
    processPayment: async(data:ProcessPaymentParams ):Promise<ProcessPaymentResponse>=>{
        return await api.post<ProcessPaymentResponse>("/payment/process-payment",data);
    },
    getPaymentHistory: async(limit?:number):Promise<Order[]>=>{
        return await api.get<Order[]>(`/payment/history?limit=${limit || 10}` );
    }
}