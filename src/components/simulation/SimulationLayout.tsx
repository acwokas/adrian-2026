import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useSimulation } from "./SimulationProvider";
import { PrivacyNotice } from "./PrivacyNotice";

interface SimulationLayoutProps {
  pillar: string;
  pillarPath: string;
  roomTitle: string;
  roomDescription: string;
  howItWorks: string[];
  children: ReactNode;
}

export function SimulationLayout({
  pillar,
  pillarPath,
  roomTitle,
  roomDescription,
  howItWorks,
  children,
}: SimulationLayoutProps) {
  const { phase, currentStep, totalSteps } = useSimulation();

  const progressPercent = phase === "setup"
    ? 0
    : phase === "reflection"
      ? 100
      : Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <Layout>
      <section className="section-spacing">
        <div className="container-wide max-w-[900px] mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to="/tools">Tools</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={pillarPath}>{pillar}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{roomTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </nav>

          {/* Header */}
          <motion.div
            className="space-y-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          >
            <span className="text-xs uppercase tracking-widest text-accent font-medium">
              {pillar}
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15]">
              {roomTitle}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-[720px]">
              {roomDescription}
            </p>
          </motion.div>

          {/* How it works */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Collapsible>
              <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group">
                <span>How it works</span>
                <ChevronDown className="h-3.5 w-3.5 transition-transform group-data-[state=open]:rotate-180" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <ol className="mt-4 space-y-2 text-sm text-muted-foreground list-none">
                  {howItWorks.map((step, i) => (
                    <li key={i} className="flex gap-3 before:hidden pl-0">
                      <span className="text-accent font-medium shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </CollapsibleContent>
            </Collapsible>
          </motion.div>

          {/* Privacy notice */}
          <PrivacyNotice className="mb-8" />

          {/* Progress bar during active/reflection phase */}
          {phase !== "setup" && (
            <div className="mb-8 space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{phase === "reflection" ? "Complete" : `Step ${currentStep + 1} of ${totalSteps}`}</span>
                <span>{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-1" />
            </div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {children}
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
