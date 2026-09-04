import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseServer: SupabaseClient | null = null;

export function getSupabaseServer() {
  if (supabaseServer) {
    return supabaseServer;
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey =
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL belum diset");
  }

  if (!supabaseSecretKey) {
    throw new Error(
      "SUPABASE_SECRET_KEY belum diset"
    );
  }

  supabaseServer = createClient(
    supabaseUrl,
    supabaseSecretKey
  );

  return supabaseServer;
}