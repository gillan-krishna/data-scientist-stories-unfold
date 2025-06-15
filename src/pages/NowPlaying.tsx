
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const NowPlaying = () => {
  return (
    <Layout>
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">What I'm Listening To</h1>
        <p className="text-xl text-muted-foreground">Music that fuels my code and creativity.</p>
      </div>
      <div className="flex justify-center">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <CardTitle>Spotify Integration</CardTitle>
            <CardDescription>Let's get this page working!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              This page will show what I'm currently listening to on Spotify.
              To make this work, we need to connect to the Spotify API.
            </p>
            <p className="mb-4 text-muted-foreground">
              Handling API keys securely is very important. The best way to do this is with the Supabase integration to store your Spotify API credentials. Please click the green Supabase button in the top right of the editor to get started.
            </p>
            <p className="mb-6 text-muted-foreground">
              Once you've connected Supabase, let me know, and I can help you write an edge function to securely fetch your currently playing song from Spotify!
            </p>
            <div className="bg-secondary p-4 rounded-lg text-center">
              <p className="font-semibold text-secondary-foreground">Lofi Beats to Code To</p>
              <p className="text-sm text-muted-foreground">Chillhop Music</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NowPlaying;
