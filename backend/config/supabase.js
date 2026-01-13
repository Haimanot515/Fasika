const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// We take the URL and KEY exactly as they are named in your .env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_KEY; // This uses your sb_secret... key

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase variables in .env. Check SUPABASE_URL and SUPABASE_KEY.');
}

// Initialize the client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

console.log("✅ Supabase Client initialized using SUPABASE_KEY from .env");

module.exports = supabase;