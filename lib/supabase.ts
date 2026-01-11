import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://djpduxvqoxtxfoilxhdu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqcGR1eHZxb3h0eGZvaWx4aGR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ0ODM0MjgsImV4cCI6MjA4MDA1OTQyOH0.rxpc9xRvZzaZIItcYBie30-Vl2XclK7HLIeMF7ks3vw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
