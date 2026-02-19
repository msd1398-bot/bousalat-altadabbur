import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADHAN_SOURCES = [
  "https://archive.org/download/adhans_sunnah/adhan_makkah.mp3",
  "https://ia800905.us.archive.org/1/items/adhans_sunnah/adhan_makkah.mp3",
  "https://ia601407.us.archive.org/1/items/adhaan_202010/adhaan.mp3",
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    for (const url of ADHAN_SOURCES) {
      try {
        const response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; IslamicApp/1.0)",
            "Accept": "audio/mpeg, audio/*, */*",
          },
          redirect: "follow",
        });

        if (response.ok) {
          const contentType = response.headers.get("content-type") || "audio/mpeg";
          const audioData = await response.arrayBuffer();

          if (audioData.byteLength > 1000) {
            return new Response(audioData, {
              status: 200,
              headers: {
                ...corsHeaders,
                "Content-Type": contentType,
                "Cache-Control": "public, max-age=604800",
                "Content-Length": audioData.byteLength.toString(),
              },
            });
          }
        }
      } catch (_e) {
        continue;
      }
    }

    return new Response(
      JSON.stringify({ error: "Could not fetch adhan audio from any source" }),
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
