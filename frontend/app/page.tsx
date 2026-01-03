"use client";

import { useGetCurrentUser } from "@/lib/hooks";

export default function Page() {

    const {data:User} = useGetCurrentUser() 

return (
    <div>
       <h1>First page</h1>
         <pre>{JSON.stringify(User, null, 2)}</pre>
    </div>
)
}