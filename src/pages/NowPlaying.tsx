import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, AlertCircle } from "lucide-react";

const NowPlaying = () => {
  const { data: nowPlayingData, isLoading, error, refetch } = useQuery({
    queryKey: ['now-playing'],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('now-playing');
      
      if (error) {
        // The FunctionsHttpError from Supabase wraps the actual response.
        // The body is in `error.context`. If the function returns a JSON with an "error" key,
        // we use that as the error message.
        if (error.context && error.context.error) {
          throw new Error(error.context.error);
        }
        // Otherwise, we fall back to the generic error message from the client.
        throw new Error(error.message || 'An unknown error occurred');
      }

      // Sometimes the function returns a 200 but with an error in the body.
      if (data && data.error) {
        throw new Error(data.error);
      }
      
      return data;
    },
    refetchInterval: 30000,
    retry: (failureCount, error) => {
      if (error.message.includes('No tokens found')) {
        return false;
      }
      return failureCount < 3;
    },
  });

  const handleLogin = async () => {
    const { data } = await supabase.functions.invoke('get-spotify-auth-url');
    if (data.url) {
      window.location.href = data.url;
    }
  };

  const needsLogin = error && error.message.includes('No tokens found');

  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">What I'm Listening To</h1>
        <p className="text-xl text-muted-foreground">Music that fuels my code and creativity.</p>
      </div>
      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music /> Now Playing on Spotify
            </CardTitle>
            <CardDescription>This updates in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && <NowPlayingSkeleton />}
            {error && !needsLogin && (
              <div className="flex flex-col items-center justify-center text-destructive p-4">
                <AlertCircle className="w-12 h-12 mb-4" />
                <p className="font-semibold">An error occurred</p>
                <p className="text-sm text-center">{error.message}</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-4">Try Again</Button>
              </div>
            )}
            {needsLogin && (
              <div className="text-center p-4">
                <p className="mb-4 text-muted-foreground">
                  Connect your Spotify account to see what's playing.
                </p>
                <Button onClick={handleLogin}>
                  Connect to Spotify
                </Button>
              </div>
            )}
            {nowPlayingData && !isLoading && !error && (
              <>
                {nowPlayingData.isPlaying && nowPlayingData.albumImageUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={nowPlayingData.albumImageUrl}
                      alt={nowPlayingData.album}
                      className="w-24 h-24 rounded-md"
                    />
                    <div className="flex-1">
                      <a href={nowPlayingData.songUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-lg hover:underline">
                        {nowPlayingData.title}
                      </a>
                      <p className="text-muted-foreground">{nowPlayingData.artist}</p>
                      <p className="text-sm text-muted-foreground">{nowPlayingData.album}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground p-4 h-28">
                     <Music className="w-10 h-10 mb-2" />
                    <p className="font-semibold">Not currently playing</p>
                    <p className="text-sm">Check back later!</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

const NowPlayingSkeleton = () => (
  <div className="flex items-center gap-4 h-28">
    <Skeleton className="w-24 h-24 rounded-md" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  </div>
);

export default NowPlaying;
