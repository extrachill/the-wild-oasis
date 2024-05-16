import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://qfsyltssmmyorxogbxwh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmc3lsdHNzbW15b3J4b2dieHdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk1NzYxMjYsImV4cCI6MjAyNTE1MjEyNn0.hyXDbolaKnzct6_gGZ4k0nXdbGeWDhaEVGZ8NzJOgE4";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
