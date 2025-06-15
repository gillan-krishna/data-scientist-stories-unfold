
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const SPOTIFY_USER_TOKEN = 'BQA_MHfHeIBQwjzb961-hyLYZf-de7-JB1_bfJkOa4hWmrolCFx--pWz_6xAD8T_VFi4_fPaQeAMjWPPSjBa_3-sGs1qeU1zcxcI09YuA56x-stK6_m785cH3OIQ1PU-YQSN3wh0oL7AfC_gRcn-z38N8xk9SMZz1o2Evdsc7rebS7mojFNjLm3PzSHbFBjhtrqm9glbjbp5golJFwZjaQR9HPKYUP6HW4DH5j9xSrP1J6oI7kebwlX_nhcmb5ZXpupcFOqeQnrsN--DAIhk-hR0rrt3GRkpeWQGciiNAgQO7zmnm3pB9Q-H6jWwza6sDJHv';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
      headers: {
        Authorization: `Bearer ${SPOTIFY_USER_TOKEN}`,
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
      device: song.device ? {
        name: song.device.name,
        type: song.device.type,
      } : null,
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
