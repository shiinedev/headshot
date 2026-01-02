
import {QueryClient}  from "@tanstack/react-query"

export const makeQueryClient = () =>{
    return new QueryClient({
        defaultOptions:{
            queries:{
                staleTime: 60* 1000, // 1 minute
                gcTime: 5* 60* 1000, // 5 minutes
                retry:1,
                refetchOnWindowFocus: process.env.NODE_ENV === "production" ,

            },
            mutations:{
                retry:0,
            }
        }
    })
}


let browserQueryClient: QueryClient | undefined  = undefined;


export const getQueryClient = () =>{
    if(typeof window === "undefined"){
        // server side
        return makeQueryClient();
    }
    if(!browserQueryClient){
        browserQueryClient = makeQueryClient();
    }
    return browserQueryClient;
}