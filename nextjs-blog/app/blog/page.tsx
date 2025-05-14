"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BlogPage(){
    const router = useRouter();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPost, setSelectedPost] = useState<any >(null);

    useEffect(() => {
        async function load(){
            const { data, error } = await supabase
            .from("posts")
            .select("*")
            .eq("published", true)
            .order("created_at", { ascending: false });

            if (!error) setPosts(data || []);
            setLoading(false);
        }
        load();
    }, []);

    useEffect(() => {
        function handleEscape(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setSelectedPost(null);
            }
        }
    
        document.addEventListener("keydown", handleEscape);
        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    if(loading) return <p className="p-4"> Loading</p>

    return(
        <div className="max-w-2xl mx-auto py-10 px-4 relative ">
                <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-center flex-1">Blog</h1>
                <button
                    onClick={() => router.push("/dashboard")}
                    className="ml-4 bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200 transition"
                >
                    Dashboard
                </button>
                </div>
                <ul className="space-y-4">
            {posts.map(post => (
                <li
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="cursor-pointer border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition p-4"
              >
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">
                  Created: {new Date(post.created_at).toLocaleString()}
                </p>
                <p className="mt-2 text-gray-700 line-clamp-2">{post.content.slice(0, 100)}...</p>
              </li>
            ))}
        </ul>
                {posts.length === 0 && (<p className="mt-4 text-gray-500"> You don't have any posts yet.</p>
        )}
            {
                selectedPost && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-auto">
                            <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
                            onClick={() => setSelectedPost(null)}>
                            x
                            </button>
                            <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                            <p className="text-sm text-gray-500 mb-1">
                                Slug: <span className="text-gray-600">{selectedPost.slug}</span>
                            </p>
                            <p className="text-sm text-gray-400 mb-4">
                                Created: {new Date(selectedPost.created_at).toLocaleString()}
                            </p>
                            <div className="text-gray-800 whitespace-pre-wrap">
                            {selectedPost.content}
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
