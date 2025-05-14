"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignOutButton(){
    const router = useRouter();

    async function signOut(){
        await supabase.auth.signOut();
        router.push("/login");
    }

    return (
        <button onClick={signOut} className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition">
            Sign Out
        </button>
    );
}