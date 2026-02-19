import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADHAN_SOURCES = [
  "https://server8.mp3quran.net/azan/Adhan-Makkah.mp3",
  "https://www.islamicfinder.org/prayer-times/azan/makkah/azan.mp3",
  "https://cdn.salah.com/audio/adhan/adhan_makkah.mp3",
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    let lastError: Error | null = null;

    for (const url of ADHAN_SOURCES) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0",
            "Accept": "audio/*,*/*",
          },
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type") || "audio/mpeg";
          const audioData = await response.arrayBuffer();

          return new Response(audioData, {
            status: 200,
            headers: {
              ...corsHeaders,
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400",
              "Content-Length": audioData.byteLength.toString(),
            },
          });
        }
      } catch (e) {
        lastError = e as Error;
        continue;
      }
    }

    return new Response(
      JSON.stringify({ error: "Failed to fetch adhan audio", details: lastError?.message }),
      {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
