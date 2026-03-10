import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://hdlzvtkpoavwnassdmfx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkbHp2dGtwb2F2d25hc3NkbWZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMTY0NDgsImV4cCI6MjA4ODY5MjQ0OH0.nMfpNQ2kYisWx9fYa9bzCHndAwqUBkjn73HhM_RttTg'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
