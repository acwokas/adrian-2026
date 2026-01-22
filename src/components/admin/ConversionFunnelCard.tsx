import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelStep {
  name: string;
  value: number;
  fill: string;
}

interface ConversionFunnelCardProps {
  data: FunnelStep[];
  onExport: () => void;
}

export function ConversionFunnelCard({ data, onExport }: ConversionFunnelCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ArrowRight size={18} />
          Conversion Funnel
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onExport}>
          <Download size={14} />
        </Button>
      </CardHeader>
      <CardContent>
        {data.some(f => f.value > 0) ? (
          <div className="space-y-4">
            {data.map((step, index) => {
              const maxValue = data[0].value || 1;
              const percentage = Math.round((step.value / maxValue) * 100);
              const prevValue = index > 0 ? data[index - 1].value : step.value;
              const dropoff = prevValue > 0 ? Math.round(((prevValue - step.value) / prevValue) * 100) : 0;
              
              return (
                <div key={step.name} className="space-y-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">{step.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">{step.value}</span>
                      {index > 0 && dropoff > 0 && (
                        <span className="text-xs text-destructive">-{dropoff}%</span>
                      )}
                    </div>
                  </div>
                  <div className="h-6 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`, 
                        backgroundColor: step.fill 
                      }}
                    />
                  </div>
                </div>
              );
            })}
            <div className="pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Conversion Rate</span>
                <span className="font-medium">
                  {data[0].value > 0 
                    ? Math.round((data[4]?.value || 0) / data[0].value * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-12">No conversion data yet</p>
        )}
      </CardContent>
    </Card>
  );
}
