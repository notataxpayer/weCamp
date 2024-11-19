import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://llornbrdkahkybuyftfq.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
module.exports = supabase;