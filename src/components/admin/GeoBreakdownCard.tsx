import { Globe, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface GeoData {
  country: string;
  countryCode: string;
  count: number;
}

interface GeoBreakdownCardProps {
  data: GeoData[];
  onExport: () => void;
}

export function GeoBreakdownCard({ data, onExport }: GeoBreakdownCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Globe size={18} />
          Visitor Locations
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onExport}>
          <Download size={14} />
        </Button>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis dataKey="country" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {data.slice(0, 5).map((geo) => (
                <div key={geo.countryCode} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{geo.countryCode}:</span>
                  <span className="font-medium">{geo.count}</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-12">No location data yet</p>
        )}
      </CardContent>
    </Card>
  );
}
