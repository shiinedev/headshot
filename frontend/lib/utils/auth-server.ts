import { cookies } from "next/headers"
import { User } from "@/lib/types";
import { cache } from "react";


export const getCurrentUser =cache( async () => {

  
    const cookieStore = await cookies();

    const token = cookieStore.get("accessToken")?.value;

    if(!token){
        return null;
    }


    try {
        

        const res = await fetch(`${process.env.API_URL || "http://localhost:8000/api/v1"}/auth/me`, {
            headers:{
               Cookie: `accessToken=${token}`,
            },
            cache:"no-store",
            credentials:"include",
        });

        if(!res.ok){
            return null;
        }
        const {data} = await res.json();

        return data.user as User

    } catch (error) {
        console.log("Error fetching current user:", error);
        throw error;
    }
});