
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const SPOTIFY_CLIENT_ID = Deno.env.get('SPOTIFY_CLIENT_ID')!
const SPOTIFY_CLIENT_SECRET = Deno.env.get('SPOTIFY_CLIENT_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const getAccessToken = async (supabase) => {
  let { data: tokenData, error: tokenError } = await supabase
    .from('spotify_tokens')
    .select('*')
    .eq('id', 1)
    .maybeSingle()

  if (tokenError || !tokenData) {
    console.error('Token fetch error:', tokenError);
    throw new Error('No tokens found. Please authenticate with Spotify.')
  }

  if (new Date(tokenData.expires_at) < new Date()) {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: tokenData.refresh_token,
      }),
    })

    if (!response.ok) {
        const errorText = await response.text()
        console.error('Spotify token refresh error:', errorText)
        throw new Error(`Failed to refresh Spotify token: ${errorText}`)
    }

    const newTokens = await response.json()
    const expires_at = new Date(Date.now() + newTokens.expires_in * 1000).toISOString()

    const { error: updateError } = await supabase.from('spotify_tokens').update({
      access_token: newTokens.access_token,
      expires_at,
      ...(newTokens.refresh_token && { refresh_token: newTokens.refresh_token }),
    }).eq('id', 1)

    if (updateError) {
      console.error('Failed to update tokens in Supabase:', updateError)
      throw updateError
    }
    
    return newTokens.access_token
  }

  return tokenData.access_token
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    const accessToken = await getAccessToken(supabase)

    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.status === 204) {
      return new Response(JSON.stringify({ isPlaying: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Spotify API error:', errorText)
      throw new Error(`Spotify API error: ${response.status} ${errorText}`)
    }

    const song = await response.json()

    if (!song || !song.item) {
       return new Response(JSON.stringify({ isPlaying: false }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
    
    const songData = {
      isPlaying: song.is_playing,
      title: song.item.name,
      artist: song.item.artists.map((_artist) => _artist.name).join(', '),
      album: song.item.album.name,
      albumImageUrl: song.item.album.images[0]?.url,
      songUrl: song.item.external_urls.spotify,
    }

    return new Response(JSON.stringify(songData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
