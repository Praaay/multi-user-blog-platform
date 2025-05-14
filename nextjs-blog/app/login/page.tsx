"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage(){
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin(e : React.FormEvent){
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password});
        if(error){
            alert(error.message);
        }
        else{
            router.push("/dashboard");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-sm border p-6 rounded-md shadow">
                <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                    />
                    <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
                        Log In
                    </button>
                </form>

                <div className="text-sm text-center mt-4">
                    Don’t have an account?{" "}
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => router.push("/signup")}
                    >
                    Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
}
