import { useState, useRef } from "react";
import { Send, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEO } from "@/components/SEO";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent, useAnalytics } from "@/hooks/useAnalytics";

export default function Contact() {
  const { toast } = useToast();
  const { trackFormStart, trackFormSubmit } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedFormStart = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    context: "",
    message: "",
  });

  const handleFormFocus = () => {
    if (!hasTrackedFormStart.current) {
      trackFormStart('contact');
      hasTrackedFormStart.current = true;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;

      trackFormSubmit('contact', true);
      toast({
        title: "Message sent",
        description: "Thank you for reaching out.",
      });
      setFormData({ name: "", email: "", organisation: "", context: "", message: "" });
      hasTrackedFormStart.current = false;
    } catch (error: any) {
      console.error("Error sending message:", error);
      trackFormSubmit('contact', false);
      toast({
        title: "Error sending message",
        description: "Please try again or book a call instead.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO 
        title="Contact - Book a Clarity Call"
        description="Get in touch with Adrian Watkins for executive advisory, fractional leadership, or strategic consultation. Book a 30-minute clarity call to discuss your organisation's challenges."
        canonical="/contact"
        keywords="book executive advisor, fractional leadership consultation, strategic advisory call, executive coaching inquiry, business consultation"
        breadcrumb={[{ name: "Contact", path: "/contact" }]}
      />
      {/* Header */}
      <section className="section-spacing lg:pb-20 border-b border-border/50">
        <div className="container-narrow">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1>Contact</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              I am selective about what I take on. A short first conversation is often the best way to assess fit, scope, and whether I am the right person to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing lg:py-36 bg-[hsl(var(--section-light))] md:bg-transparent">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-20">
            {/* Left Column - Info */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-10 lg:space-y-12">
                {/* Book a call - Primary action */}
                <div className="space-y-4 lg:space-y-5 lg:pb-2">
                  <h2 className="text-2xl lg:text-[1.75rem]">Book a Call</h2>
                  {/* Mobile copy */}
                  <p className="lg:hidden text-muted-foreground">
                    This is a focused conversation to understand the situation you are navigating and determine whether it makes sense to work together.
                  </p>
                  {/* Desktop copy - reframed */}
                  <p className="hidden lg:block text-muted-foreground">
                    This is a short, structured conversation to assess the situation, clarify scope, and determine whether engagement makes sense.
                  </p>
                  <Button 
                    variant="hero" 
                    size="lg" 
                    asChild
                    onClick={() => trackEvent({ eventType: 'cta_click', eventName: 'book_call', eventData: { page: 'contact' } })}
                  >
                    <a 
                      href="https://calendly.com/adrian-watkins1/new-meeting" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Calendar size={16} />
                      Book a 30-minute call
                    </a>
                  </Button>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h3 className="text-xl">Availability</h3>
                  <p className="text-muted-foreground">
                    I take on a limited number of advisory and fractional roles at any one time. This allows me to give each engagement the attention it requires.
                  </p>
                  <p className="text-foreground font-medium">
                    I prioritise engagements where clarity, decision-making, and accountability matter.
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h3 className="text-xl">Permanent Roles</h3>
                  <p className="text-muted-foreground">
                    From time to time, I consider senior leadership roles where the mandate, scope, and expectations are clear. If there is alignment, I am open to a conversation.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Column - Form */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl">Send a Message</h2>
                  {/* Mobile copy */}
                  <p className="lg:hidden text-muted-foreground">
                    Prefer to write? Complete the form below.
                  </p>
                  {/* Desktop copy - adds friction */}
                  <p className="hidden lg:block text-muted-foreground">
                    Prefer to write? Please use the form below for considered enquiries.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={handleFormFocus}
                      required
                      className="bg-card border-border/50 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-card border-border/50 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="organisation">Organisation (optional)</Label>
                    <Input
                      id="organisation"
                      value={formData.organisation}
                      onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                      className="bg-card border-border/50 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="context">What brings you here?</Label>
                    <Input
                      id="context"
                      value={formData.context}
                      onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                      placeholder="e.g. Advisory decision support, Fractional leadership mandate, Board-level discussion"
                      className="bg-card border-border/50 focus:border-accent"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={5}
                      className="bg-card border-border/50 focus:border-accent resize-none"
                      placeholder="Briefly describe the situation you are navigating and the outcome you are seeking."
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="hero" 
                    size="lg" 
                    className="w-full" 
                    disabled={isSubmitting}
                    onClick={() => trackEvent({ eventType: 'cta_click', eventName: 'contact_form_submit' })}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send message
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="py-20 lg:py-28">
        <div className="container-narrow">
          <p className="text-foreground text-center lg:text-left">
            Engagements begin with clarity and intent.
          </p>
        </div>
      </section>
    </Layout>
  );
}
