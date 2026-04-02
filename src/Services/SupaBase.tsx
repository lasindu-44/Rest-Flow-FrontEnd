import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://dsgpwzflominxbcbeluh.supabase.co";
const supabaseKey = "sb_publishable_sAlnMicuKN0n5qmleDanYA_oEjSHtyS";

export const supabase = createClient(supabaseUrl, supabaseKey);