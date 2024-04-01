import { createClient } from "@supabase/supabase-js";

const useSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_API_KEY
)

export default useSupabase