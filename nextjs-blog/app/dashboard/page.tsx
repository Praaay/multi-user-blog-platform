"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SignOutButton from "@/components/SignOutButton";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSlug, setEditSlug] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      const { data: posts, error } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setPosts(posts);
      setLoading(false);
    }

    load();
  }, [router]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedPost(null);
        setIsEditing(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="relative max-w-2xl mx-auto py-10 px-4">
      {/* Top-right buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className="bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
          onClick={() => router.push("/blog")}
        >
          View Blog
        </button>
        <SignOutButton />
      </div>

      {/* Top-left: New Post & Heading */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition"
          onClick={() => router.push("/dashboard/new")}
        >
          New Post
        </button>
        <h1 className="text-2xl font-bold text-center flex-1">Your Posts</h1>
        <div className="w-[116px]" /> {/* Spacer to balance the layout */}
      </div>

      {/* Post list */}
      <ul className="space-y-4">
        {posts.map((post) => (
          <li
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="cursor-pointer border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition p-4"
          >
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="text-sm text-gray-500">
              Created: {new Date(post.created_at).toLocaleString()}
            </p>
            <p className="mt-2 text-gray-700 line-clamp-2">
            {post.content.length <= 40 ? post.content : `${post.content.slice(0, 40)}...`}
            </p>
          </li>
        ))}
      </ul>

      {posts.length === 0 && (
        <p className="mt-4 text-gray-500">You don't have any posts yet.</p>
      )}

      {/* Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative max-h-[90vh] overflow-auto">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => {
                setSelectedPost(null);
                setIsEditing(false);
              }}
            >
              ×
            </button>

            {isEditing ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Slug"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full border p-2 rounded mb-4 h-40"
                  placeholder="Content"
                />
                <div className="flex gap-2">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      const { error } = await supabase
                        .from("posts")
                        .update({
                          title: editTitle,
                          slug: editSlug,
                          content: editContent,
                        })
                        .eq("id", selectedPost.id);

                      if (error) {
                        alert("Error updating post: " + error.message);
                      } else {
                        const updated = posts.map(p =>
                          p.id === selectedPost.id
                            ? { ...p, title: editTitle, slug: editSlug, content: editContent }
                            : p
                        );
                        setPosts(updated);
                        setSelectedPost({
                          ...selectedPost,
                          title: editTitle,
                          slug: editSlug,
                          content: editContent
                        });
                        setIsEditing(false);
                      }
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">{selectedPost.title}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  Created: {new Date(selectedPost.created_at).toLocaleString()}
                </p>
                <div className="text-gray-800 whitespace-pre-wrap mb-4">
                  {selectedPost.content}
                </div>

                {user && selectedPost.author_id === user.id && (
                  <div className="flex gap-2">
                    <button
                      className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded hover:bg-yellow-200"
                      onClick={() => {
                        setEditTitle(selectedPost.title);
                        setEditSlug(selectedPost.slug);
                        setEditContent(selectedPost.content);
                        setIsEditing(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        const { error } = await supabase
                          .from("posts")
                          .delete()
                          .eq("id", selectedPost.id);

                        if (error) {
                          alert("Error deleting post: " + error.message);
                        } else {
                          setPosts(posts.filter((p) => p.id !== selectedPost.id));
                          setSelectedPost(null);
                        }
                      }}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
