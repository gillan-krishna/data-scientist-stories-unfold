
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')!
const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!
const REDIRECT_URI = `${SUPABASE_URL}/functions/v1/spotify-auth`

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('No code provided', { status: 400, headers: corsHeaders })
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Spotify token exchange error:', errorText)
      throw new Error(`Spotify API error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    const { access_token, refresh_token, expires_in } = data

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const expires_at = new Date(Date.now() + expires_in * 1000).toISOString()

    const { error: dbError } = await supabase.from('spotify_tokens').upsert({
      id: 1,
      access_token,
      refresh_token,
      expires_at,
    })

    if (dbError) {
      console.error('Supabase DB error:', dbError)
      throw dbError
    }

    const siteUrl = new URL(req.headers.get('origin') || SUPABASE_URL)
    const redirectUrl = new URL('/now-playing', siteUrl)
    return Response.redirect(redirectUrl.toString(), 302)
  } catch (error) {
    console.error('Error in spotify-auth function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
