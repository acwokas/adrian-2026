import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";

export default function PrivacyPolicy() {
  return (
    <Layout>
      <SEO 
        title="Privacy Policy" 
        description="Privacy Policy for Adrian Watkins - Learn how we collect, use, and protect your data."
        canonical="/privacy"
      />
      <section className="section-spacing">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto prose prose-invert">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <p className="text-muted-foreground mb-6">
              Last updated: January 2026
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Introduction</h2>
            <p className="text-muted-foreground mb-4">
              This Privacy Policy explains how Adrian Watkins ("we", "us", or "our") collects, 
              uses, and protects your personal information when you visit our website. We are 
              committed to ensuring your privacy is protected.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                <strong>Analytics Data:</strong> We use analytics tools to understand how visitors 
                interact with our website. This includes page views, click events, session duration, 
                and navigation patterns.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, device type (desktop, mobile, tablet), 
                and viewport dimensions.
              </li>
              <li>
                <strong>Location Data:</strong> We may collect approximate geographic location based 
                on your IP address (country and region level only).
              </li>
              <li>
                <strong>Session Recordings:</strong> We record anonymized user sessions to improve 
                website usability. These recordings capture mouse movements, clicks, and scrolling 
                behavior but do not capture any personal data you enter into forms.
              </li>
              <li>
                <strong>Contact Form Data:</strong> When you submit our contact form, we collect 
                your name, email address, and message content.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
            <p className="text-muted-foreground mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>To improve our website's user experience and functionality</li>
              <li>To understand visitor behavior and preferences</li>
              <li>To respond to your inquiries submitted through our contact form</li>
              <li>To analyze website traffic and usage patterns</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Third-Party Services</h2>
            <p className="text-muted-foreground mb-4">
              We use the following third-party services:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>
                <strong>Google Analytics:</strong> For website analytics and traffic analysis. 
                Google Analytics may collect information about your device and browsing behavior.
              </li>
              <li>
                <strong>Resend:</strong> For sending emails when you submit our contact form.
              </li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Cookies and Tracking</h2>
            <p className="text-muted-foreground mb-4">
              We use cookies and similar tracking technologies to:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Track your session for analytics purposes</li>
              <li>Remember your preferences (such as theme settings)</li>
              <li>Analyze website traffic and performance</li>
            </ul>

            <h2 className="text-xl font-semibold mt-8 mb-4">Data Retention</h2>
            <p className="text-muted-foreground mb-4">
              We retain analytics data for up to 12 months. Contact form submissions are 
              retained as long as necessary to respond to your inquiry.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">
              Under GDPR and CCPA, you have the following rights:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>The right to access your personal data</li>
              <li>The right to rectification of inaccurate data</li>
              <li>The right to erasure ("right to be forgotten")</li>
              <li>The right to restrict processing</li>
              <li>The right to data portability</li>
              <li>The right to object to processing</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              To exercise any of these rights, please contact us using the details below.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Data Security</h2>
            <p className="text-muted-foreground mb-4">
              We implement appropriate technical and organizational measures to protect your 
              personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page with an updated "Last updated" date.
            </p>

            <h2 className="text-xl font-semibold mt-8 mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, 
              please contact us through our <a href="/contact" className="text-primary hover:underline">contact page</a>.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
