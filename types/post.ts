export interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string | null; // 단일 이미지
  image_urls?: string[] | null; // 여러 이미지
  created_at: string;
}
