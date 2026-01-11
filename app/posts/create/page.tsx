"use client";

import { supabase } from "@/lib/supabase";
import { Category } from "@/types/category";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreatePost() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      // 1. Fetch from 'categories' table
      const { data: dbCategories, error: dbError } = await supabase
        .from<"categories", Category>("categories")
        .select("name")
        .order("name", { ascending: true });

      if (dbError) {
        console.error("Error fetching categories table:", dbError);
      }

      // 2. Fetch distinct categories from 'posts' table (fallback)
      const { data: postsData, error: postsError } = await supabase
        .from<"posts", { category: string }>("posts")
        .select("category");

      if (postsError) {
        console.error("Error fetching posts categories:", postsError);
      }

      // 3. Merge and Deduplicate
      const dbNames = dbCategories?.map((c) => c.name) || [];
      const postNames = postsData?.map((p) => p.category).filter(Boolean) || [];

      const uniqueNames = Array.from(
        new Set([...dbNames, ...postNames])
      ).sort();

      // Convert to Category objects for the generic state
      const mergedCategories = uniqueNames.map((name, index) => ({
        id: `merged-${index}`,
        name,
        created_at: "", // dummy
      }));

      setCategories(mergedCategories);
    };

    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const files = Array.from(e.target.files);
    const newUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post_images")
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from("post_images")
          .getPublicUrl(filePath);

        if (data) {
          newUrls.push(data.publicUrl);
        }
      }
      setImageUrls((prev) => [...prev, ...newUrls]);
    } catch (error: unknown) {
      console.error("Image upload failed:", error);

      if (error instanceof Error) {
        alert(
          "이미지 업로드에 실패했습니다: " +
            error.message +
            " (Bucket 설정 확인 필요)"
        );
      } else {
        alert("이미지 업로드에 실패했습니다. (Bucket 설정 확인 필요)");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!category) {
      alert("카테고리를 선택해주세요.");
      return;
    }
    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    const { error } = await supabase
      .from("posts")
      .insert([{ title, content, category, image_urls: imageUrls }]);

    if (error) {
      alert("글 작성 오류: " + error.message);
    } else {
      router.push("/board");
    }
  };

  return (
    <main className="mx-auto max-w-2xl pb-20 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 mb-6">글 작성</h1>

        {/* 1. Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            카테고리
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            제목
          </label>
          <input
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* 3. Content */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            내용
          </label>
          <textarea
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-3 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder-slate-500 min-h-75"
            placeholder="공부한 내용을 자유롭게 작성하세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* 4. Image Upload */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-slate-400 mb-2">
            이미지 첨부
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 border border-slate-700 transition-colors">
              <span>{uploading ? "업로드 중..." : "이미지 선택"}</span>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
            </label>
            <span className="text-xs text-slate-500">
              {imageUrls.length}개의 이미지가 업로드됨
            </span>
          </div>

          {/* Image Previews */}
          {imageUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-video overflow-hidden rounded-lg border border-slate-800 bg-slate-900"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Preview ${idx}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() =>
                      setImageUrls(imageUrls.filter((_, i) => i !== idx))
                    }
                    className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white hover:bg-red-500 transition-colors"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full rounded-md bg-blue-600 py-4 text-base font-bold text-white shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSubmit}
          disabled={uploading}
        >
          {uploading ? "이미지 업로드 중..." : "저장하기"}
        </button>
      </div>
    </main>
  );
}
