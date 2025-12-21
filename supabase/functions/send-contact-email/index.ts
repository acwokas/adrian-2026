import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormRequest {
  name: string;
  email: string;
  organisation?: string;
  context?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, organisation, context, message }: ContactFormRequest = await req.json();

    console.log("Received contact form submission from:", email);

    // Send notification email to Adrian
    const notificationResponse = await resend.emails.send({
      from: "Contact Form <onboarding@resend.dev>",
      to: ["adrian@adrianwatkins.com"], // Update this to your actual email
      subject: `New contact from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${organisation ? `<p><strong>Organisation:</strong> ${organisation}</p>` : ""}
        ${context ? `<p><strong>Context:</strong> ${context}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    console.log("Notification email sent:", notificationResponse);

    // Send confirmation email to the sender
    const confirmationResponse = await resend.emails.send({
      from: "Adrian Watkins <onboarding@resend.dev>",
      to: [email],
      subject: "Thank you for reaching out",
      html: `
        <h2>Thank you for your message, ${name}</h2>
        <p>I have received your enquiry and will respond within a few business days.</p>
        <p>Best regards,<br>Adrian Watkins</p>
      `,
    });

    console.log("Confirmation email sent:", confirmationResponse);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
