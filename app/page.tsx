"use client";

import StudyCalendar from "@/components/StudyCalendar";
import { supabase } from "@/lib/supabase";
import type { Post } from "@/types/post";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const examDate = new Date("2026-03-01");
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from<"posts", Post>("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data ?? []);
      }

      setLoading(false);
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">공부 기록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-100">...</h1>
      </header>

      <section className="mb-8">
        <StudyCalendar posts={posts} />
      </section>

      <section className="bg-slate-900 rounded-xl border border-slate-800 p-8 text-center mb-8">
        <h2 className="text-lg font-medium text-slate-400 mb-2">시험까지</h2>
        <div className="text-6xl font-black text-blue-500 tracking-tight my-4 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          D-{diffDays}
        </div>
        <p className="text-slate-500 text-sm">
          {examDate.toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          시험 날
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <Link
          href="/board"
          className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition"
        >
          <span className="text-2xl mb-2">📖</span>
          <span className="text-slate-200 font-medium">기록 보러 가기</span>
        </Link>
        <button className="flex flex-col items-center justify-center p-6 bg-blue-900/20 rounded-xl border border-blue-800 hover:bg-blue-900/40 transition">
          <span className="text-2xl mb-2">⚡</span>
          <span className="text-blue-400 font-medium">오늘 공부 시작</span>
        </button>
      </div>
    </div>
  );
}
