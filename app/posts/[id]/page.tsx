"use client";

import { supabase } from "@/lib/supabase";
import { Post } from "@/types/post";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        alert("글을 불러오는데 실패했습니다.");
        router.push("/board");
      } else {
        setPost(data as Post); // 안전하게 타입 단언
      }

      setLoading(false);
    };

    fetchPost();
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20 text-slate-400">
        글을 찾을 수 없습니다.
      </div>
    );
  }

  const date = new Date(post.created_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <article className="mx-auto max-w-3xl pb-20">
      {/* Header / Back Button */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href="/board"
          className="flex items-center text-slate-400 hover:text-black transition-colors"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          목록으로
        </Link>
      </div>

      {/* Post Header */}
      <header className="mb-8 border-b border-gray-200 pb-8">
        <div className="flex items-center gap-3 mb-4">
          {post.category ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
              {post.category}
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
              일반
            </span>
          )}
          <span className="text-gray-500 text-sm">{date}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>
      </header>

      {/* Images */}
      {post.image_urls && post.image_urls.length > 0 && (
        <div className="mb-8 space-y-4">
          {post.image_urls.map((url, idx) => (
            <div
              key={idx}
              className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`첨부 이미지 ${idx + 1}`}
                className="w-full h-auto object-contain max-h-150"
              />
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="prose max-w-none">
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed text-lg">
          {post.content}
        </div>
      </div>
    </article>
  );
}
