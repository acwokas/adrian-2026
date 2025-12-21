import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get client IP from headers (Supabase edge functions provide this)
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("cf-connecting-ip") || 
                     "unknown";

    console.log("Getting location for IP:", clientIP);

    // Use ip-api.com (free, no API key required, 45 requests per minute limit)
    const response = await fetch(`http://ip-api.com/json/${clientIP}?fields=status,country,countryCode,region,regionName,city,lat,lon`);
    const data = await response.json();

    console.log("Location data:", data);

    if (data.status === "success") {
      return new Response(
        JSON.stringify({
          country: data.country,
          countryCode: data.countryCode,
          region: data.regionName,
          city: data.city,
          lat: data.lat,
          lon: data.lon,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    } else {
      // Return unknown location if lookup fails
      return new Response(
        JSON.stringify({
          country: "Unknown",
          countryCode: "XX",
          region: null,
          city: null,
          lat: null,
          lon: null,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error: any) {
    console.error("Error getting location:", error);
    return new Response(
      JSON.stringify({
        country: "Unknown",
        countryCode: "XX",
        region: null,
        city: null,
        lat: null,
        lon: null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
