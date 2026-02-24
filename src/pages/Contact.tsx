import { useState, useRef } from "react";
import { Send, Calendar, Loader2, FileText, Wrench, Mic, ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { AnimatedSection } from "@/components/AnimatedSection";
import { SEOHead } from "@/components/SEOHead";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function Contact() {
  const { toast } = useToast();
  const { trackFormStart, trackFormSubmit, trackBookingClick, trackWhitepaperDownload } = useAnalytics();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasTrackedFormStart = useRef(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
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
      setFormData({ name: "", email: "", organisation: "", message: "" });
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
      <SEOHead 
        title="Get in Touch: Advisory & Speaking"
        description="Board advisory, executive workshops, and speaking engagements across Asia-Pacific. EDGE Framework diagnostic, fractional leadership, portfolio company support."
        canonical="/contact"
      />
      {/* Header */}
      <section className="section-spacing lg:pb-10 border-b border-border/50">
        <div className="container-narrow">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1>Contact</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              I am selective about what I take on. A short first conversation is often the best way to assess fit, scope, and whether engagement makes sense.
            </p>
            <p className="text-xl text-muted-foreground max-w-2xl">
              I prioritise engagements where clarity, decision-making, and accountability matter. Where structured capability will create measurable advantage, not just activity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* EDGE Framework Resources */}
      <section className="section-spacing lg:py-9 border-b border-border/50">
        <div className="container-narrow">
          <AnimatedSection>
            <div className="space-y-3 mb-8">
              <h2 className="text-2xl lg:text-[1.75rem]">EDGE Framework Resources</h2>
              <p className="text-muted-foreground">
                Tools, frameworks, and thought leadership on applied intelligence governance
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Card 1 - White Paper */}
              <div className="p-6 bg-card border border-border/30 hover:border-accent/50 transition-colors flex flex-col h-full space-y-4">
                <FileText className="text-accent" size={28} />
                <h3 className="text-lg font-semibold">Download White Paper</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  19-page leadership doctrine for structuring intelligence in modern organisations. Includes the complete framework, maturity model, and implementation guide.
                </p>
                <Button variant="minimal" size="sm" asChild className="justify-start p-0" onClick={() => trackWhitepaperDownload('contact_page')}>
                  <a href="/edge-framework-whitepaper.pdf" download>
                    Download PDF →
                  </a>
                </Button>
              </div>

              {/* Card 2 - EDGE Tools */}
              <div className="p-6 bg-card border border-border/30 hover:border-accent/50 transition-colors flex flex-col h-full space-y-4">
                <Wrench className="text-accent" size={28} />
                <h3 className="text-lg font-semibold">Explore EDGE Tools</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  12 simulation rooms and assessment tools that operationalise the framework. Practice governance reviews, navigate ethical dilemmas, and assess maturity.
                </p>
                <Button variant="minimal" size="sm" asChild className="justify-start p-0">
                  <Link to="/tools">Try the tools →</Link>
                </Button>
              </div>

              {/* Card 3 - Advisory & Speaking */}
              <div className="p-6 bg-card border border-border/30 hover:border-accent/50 transition-colors flex flex-col h-full space-y-4">
                <Mic className="text-accent" size={28} />
                <h3 className="text-lg font-semibold">Advisory & Speaking</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                  Available for board advisory, executive workshops, and conference keynotes on AI governance, applied intelligence, and the EDGE Framework.
                </p>
                <Button
                  variant="minimal"
                  size="sm"
                  className="justify-start p-0"
                  onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get in touch <ArrowDown size={14} />
                </Button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center mt-6">
              All EDGE resources are freely available in support of the{" "}
              <a href="https://democratising.ai" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                democratising.ai
              </a>{" "}
              mission
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Main Content */}
      <section id="contact-form" className="section-spacing lg:py-9 bg-[hsl(var(--section-light))] md:bg-transparent">
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
                    onClick={() => trackBookingClick('contact-page')}
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
                      placeholder="Organisation (optional)"
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
                      rows={6}
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
                  <p className="text-xs text-muted-foreground/60 text-center">
                    I typically respond within 2 business days.
                  </p>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Alternative Contact */}
      <section className="py-8 lg:py-10 border-t border-border/50">
        <div className="container-narrow">
          <div className="flex flex-col items-center text-center space-y-5">
            <h3 className="text-lg text-muted-foreground">Prefer a Different Channel?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://www.linkedin.com/in/adrianwatkins/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                Connect on LinkedIn
              </a>
              <a
                href="https://calendly.com/adrian-watkins1/new-meeting"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                onClick={() => trackBookingClick('contact-alt')}
              >
                <Calendar size={16} />
                Book a 30-minute call
              </a>
            </div>
            <p className="text-xs text-muted-foreground/50">
              Response times are the same across all channels
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
