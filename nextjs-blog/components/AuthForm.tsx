"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase";
import { useRouter } from "next/navigation";


export default function AuthForm({ type } : { type: "signUp" | "signIn"}){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        const fn = type === "signUp" ? supabase.auth.signUp : supabase.auth.signInWithPassword;
        
        const { error } = await fn({email, password});
        if (error) alert(error.message);
        else router.push("/dashboard");
    }
    return(
        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10">
            <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e=> setEmail(e.target.value)}
            className="border p-2 w-full"
            />
            <input 
            type="password"
            placeholder="Password"
            value={password}
            onChange = {e=> setPassword(e.target.value)}
            className = "border p-2 w-full"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
                {type === "signUp"? "Sign Up" : "Log In"}
            </button>
        </form>
    );
}