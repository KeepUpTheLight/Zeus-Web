"use client";

/* eslint-disable @next/next/no-img-element */
import { Post } from "@/types/post";

interface PostCardProps {
    post: Post;
}

import Link from "next/link";

export default function PostCard({ post }: PostCardProps) {
    // Format date
    const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Link href={`/posts/${post.id}`} className="block">
            <div className="group relative bg-slate-900 rounded-xl shadow-sm border border-slate-800 overflow-hidden hover:shadow-md hover:border-slate-700 transition-all h-full">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        {post.category ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-200 border border-blue-800">
                                {post.category}
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                                일반
                            </span>
                        )}
                        <span className="text-xs text-slate-500">{date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors">
                        {post.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                        {post.content}
                    </p>

                    {post.image_urls && post.image_urls.length > 0 && (
                        <div className="flex gap-2 overflow-hidden h-20 rounded-lg">
                            {post.image_urls.slice(0, 3).map((url, idx) => (
                                <img
                                    key={idx}
                                    src={url}
                                    alt=""
                                    className="w-full h-full object-cover flex-1 min-w-0"
                                />
                            ))}
                            {post.image_urls.length > 3 && (
                                <div className="flex-1 bg-slate-800 flex items-center justify-center text-xs text-slate-400 font-medium border border-slate-700">
                                    +{post.image_urls.length - 3}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
