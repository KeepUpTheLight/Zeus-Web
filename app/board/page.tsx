"use client";

import PostCard from "@/components/PostCard";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types/category";
import type { Post } from "@/types/post";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function BoardPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("전체");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch Categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from<"categories", Category>("categories")
        .select("*")
        .order("created_at", { ascending: true });

      if (categoriesError) {
        console.error("Error fetching categories:", categoriesError);
      } else {
        setCategories(categoriesData ?? []);
      }

      // Fetch Posts
      const { data: postsData, error: postsError } = await supabase
        .from<"posts", Post>("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Error fetching posts:", postsError);
      } else {
        setPosts(postsData ?? []);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddCategory = async () => {
    const newCategoryName = window.prompt("추가할 카테고리 이름을 입력하세요:");
    if (!newCategoryName || !newCategoryName.trim()) return;

    // Check for duplicates
    if (categories.some((c) => c.name === newCategoryName.trim())) {
      alert("이미 존재하는 카테고리입니다.");
      return;
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: newCategoryName.trim() }])
      .select();

    if (error) {
      console.error("Error adding category:", error);
      alert("카테고리 추가 실패");
    } else if (data) {
      setCategories([...categories, data[0]]);
    }
  };

  // Extract unique categories from both the 'categories' table and existing posts
  const uniqueTags = Array.from(
    new Set([
      ...categories.map((c) => c.name),
      ...posts.map((p) => p.category).filter(Boolean),
    ])
  ).sort();

  // Filter posts
  const filteredPosts =
    selectedCategory === "전체"
      ? posts
      : posts.filter((post) => post.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl text-slate-400">BOARD</p>
        </div>
        <Link
          href="/posts/create"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-900/20"
        >
          글쓰기
        </Link>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
        {/* 'All' Filter */}
        <button
          onClick={() => setSelectedCategory("전체")}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
            selectedCategory === "전체"
              ? "bg-blue-900/50 text-blue-200 border-blue-800 shadow-sm"
              : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
          }`}
        >
          전체
        </button>

        {uniqueTags.length === 0 && categories.length === 0 ? (
          <span className="text-sm text-slate-500 whitespace-nowrap px-2">
            카테고리가 없습니다.
          </span>
        ) : (
          uniqueTags.map((tagName) => (
            <button
              key={tagName}
              onClick={() => setSelectedCategory(tagName)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                selectedCategory === tagName
                  ? "bg-blue-900/50 text-blue-200 border-blue-800 shadow-sm"
                  : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
              }`}
            >
              {tagName}
            </button>
          ))
        )}

        {/* Add Category Button (Circular) */}
        <button
          onClick={handleAddCategory}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-600 hover:border-blue-500"
          title="카테고리 추가"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Post Grid */}
      <div>
        {filteredPosts.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/50">
            <p className="text-slate-500 mb-2">아직 작성된 글이 없습니다.</p>
            {selectedCategory !== "전체" && (
              <button
                onClick={() => setSelectedCategory("전체")}
                className="text-blue-400 text-sm hover:underline"
              >
                전체 보기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
