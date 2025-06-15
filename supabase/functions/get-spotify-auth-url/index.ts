
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/spotify-auth`
const SCOPE = 'user-read-currently-playing'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authUrl = new URL('https://accounts.spotify.com/authorize')
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('client_id', SPOTIFY_CLIENT_ID)
  authUrl.searchParams.append('scope', SCOPE)
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI)

  return new Response(JSON.stringify({ url: authUrl.toString() }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
})
