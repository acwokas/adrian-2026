import { useState } from "react";
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

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    context: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Thank you for reaching out. I will respond within a few business days.",
      });
      setFormData({ name: "", email: "", organisation: "", context: "", message: "" });
    } catch (error: any) {
      console.error("Error sending message:", error);
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
        title="Contact"
        description="Get in touch for advisory, fractional leadership, or a first conversation. Book a clarity call or send a message."
        canonical="/contact"
      />
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <h1>Contact</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              I am selective about what I take on, but always happy to have a first conversation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Info */}
            <AnimatedSection delay={0.1}>
              <div className="space-y-10">
                <div className="space-y-4">
                  <h2 className="text-2xl">Book a call</h2>
                  <p className="text-muted-foreground">
                    The best way to start is a 30-minute clarity call. This is an opportunity to understand your context and explore whether there is a useful way I can help.
                  </p>
                  <Button variant="hero" size="lg" asChild>
                    <a href="https://calendly.com" target="_blank" rel="noopener noreferrer">
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
                </div>

                <div className="space-y-4 pt-6 border-t border-border/50">
                  <h3 className="text-xl">Permanent roles</h3>
                  <p className="text-muted-foreground">
                    From time to time, I consider senior leadership roles where the scope and mandate are clear. If you are exploring this, I am happy to have a conversation.
                  </p>
                </div>
              </div>
            </AnimatedSection>

            {/* Right Column - Form */}
            <AnimatedSection delay={0.2}>
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-2xl">Send a message</h2>
                  <p className="text-muted-foreground">
                    Prefer to write? Complete the form below and I will respond within a few business days.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      placeholder="e.g., Advisory, Fractional role, Speaking, Permanent opportunity"
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
                      placeholder="Tell me a bit about your situation and what you are looking for."
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isSubmitting}>
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
    </Layout>
  );
}
