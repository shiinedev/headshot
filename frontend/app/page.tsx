"use client";

import { useCurrentUser } from "@/lib/hooks";

export default function Page() {

    const {data} = useCurrentUser() 
    console.log(data?.user?.name)

return (
    <div className="flex justify-between items-center p-6">
       <h1>Logo</h1>
         <span>welcome {data?.user?.name}</span>
    </div>
)
}