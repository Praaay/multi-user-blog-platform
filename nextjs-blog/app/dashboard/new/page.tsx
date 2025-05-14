"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function NewPostPage(){
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        supabase.auth.getUser().then(({ data : { user }}) => {
            if(!user){
                router.push("/login");
            }
            else{
                setUser(user);
            }
        })
    }, [router])

    async function handleSubmit(e : React.FormEvent ){
        e.preventDefault();

        const { error } = await supabase
        .from("posts")
        .insert({
            title,
            slug,
            content,
            author_id: user.id,
        });

        if(error){
            alert(error.message);
        }
        else{
            router.push("/dashboard");
        }
    }

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full border p-2 rounded"
                required
                />
                <input
                type="text"
                placeholder="Slug (e.g. my-first-post)"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full border p-2 rounded"
                required
                />
                <textarea
                    placeholder="Write your post content here..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    className="w-full border p-2 rounded h-40 resize-y"
                    required
                    />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Publish
                </button>
                </form>
        </div>
    );
}