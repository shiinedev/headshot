"use client";
import { useUser } from "@/lib/context/user-context"


const UserPage = () => {

    const {user} = useUser();
  return (
    <div>
      User Page
      <h1>welcome {user?.name}</h1>
    </div>
  )
}

export default UserPage
