import { api } from "@/lib/api";
import { GetCreditPackagesResponse, ProcessPaymentResponse,ProcessPaymentParams, CreditPackage } from "@/lib/types";


export const paymentService = {

    getPackages: async ():Promise<CreditPackage[]> =>{
        return  await api.get<CreditPackage[]>("/payment/packages");
    },
    processPayment: async(data:ProcessPaymentParams ):Promise<ProcessPaymentResponse>=>{
        return await api.post<ProcessPaymentResponse>("/payment/process-payment",data);
    }
}