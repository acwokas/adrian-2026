import { useState } from "react";
import { Send, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organisation: "",
    context: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to a backend
    toast({
      title: "Message received",
      description: "Thank you for reaching out. I will respond within a few business days.",
    });
    setFormData({ name: "", email: "", organisation: "", context: "", message: "" });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="section-spacing border-b border-border/50">
        <div className="container-narrow">
          <div className="space-y-6 animate-fade-in-up">
            <h1>Contact</h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              I am selective about what I take on, but always happy to have a first conversation.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-spacing">
        <div className="container-narrow">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - Info */}
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

            {/* Right Column - Form */}
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
                    className="bg-card border-border/50"
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
                    className="bg-card border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organisation">Organisation (optional)</Label>
                  <Input
                    id="organisation"
                    value={formData.organisation}
                    onChange={(e) => setFormData({ ...formData, organisation: e.target.value })}
                    className="bg-card border-border/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="context">What brings you here?</Label>
                  <Input
                    id="context"
                    value={formData.context}
                    onChange={(e) => setFormData({ ...formData, context: e.target.value })}
                    placeholder="e.g., Advisory, Fractional role, Speaking, Permanent opportunity"
                    className="bg-card border-border/50"
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
                    className="bg-card border-border/50 resize-none"
                    placeholder="Tell me a bit about your situation and what you are looking for."
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full">
                  <Send size={16} />
                  Send message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
