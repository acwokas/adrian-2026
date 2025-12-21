import { useMemo } from "react";

interface ClickPoint {
  x: number;
  y: number;
  intensity: number;
}

interface ClickHeatmapProps {
  clicks: ClickPoint[];
  width?: number;
  height?: number;
}

export function ClickHeatmap({ clicks, width = 400, height = 250 }: ClickHeatmapProps) {
  const heatmapData = useMemo(() => {
    // Create a grid for the heatmap
    const gridSize = 10; // 10x10 grid cells
    const grid: number[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
    
    // Aggregate clicks into grid cells
    clicks.forEach(click => {
      const gridX = Math.min(Math.floor((click.x / 100) * gridSize), gridSize - 1);
      const gridY = Math.min(Math.floor((click.y / 100) * gridSize), gridSize - 1);
      if (gridX >= 0 && gridY >= 0) {
        grid[gridY][gridX] += click.intensity;
      }
    });
    
    // Find max value for normalization
    const maxValue = Math.max(...grid.flat(), 1);
    
    return { grid, maxValue };
  }, [clicks]);

  const getColor = (value: number, maxValue: number): string => {
    const intensity = value / maxValue;
    if (intensity === 0) return 'hsl(var(--muted) / 0.3)';
    if (intensity < 0.2) return 'hsl(200 80% 60% / 0.4)';
    if (intensity < 0.4) return 'hsl(160 80% 50% / 0.5)';
    if (intensity < 0.6) return 'hsl(60 90% 50% / 0.6)';
    if (intensity < 0.8) return 'hsl(30 90% 50% / 0.7)';
    return 'hsl(0 90% 50% / 0.8)';
  };

  const cellWidth = width / 10;
  const cellHeight = height / 10;

  return (
    <div className="relative">
      {/* Page mockup background */}
      <div 
        className="rounded-lg border border-border bg-card overflow-hidden"
        style={{ width, height }}
      >
        {/* Header mockup */}
        <div className="h-8 bg-muted/50 border-b border-border flex items-center px-3 gap-2">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
          <div className="flex-1 mx-8 h-3 bg-muted-foreground/10 rounded" />
        </div>
        
        {/* Heatmap overlay */}
        <svg 
          width={width} 
          height={height - 32} 
          className="absolute top-8 left-0"
          style={{ mixBlendMode: 'multiply' }}
        >
          {heatmapData.grid.map((row, y) =>
            row.map((value, x) => (
              <rect
                key={`${x}-${y}`}
                x={x * cellWidth}
                y={y * ((height - 32) / 10)}
                width={cellWidth}
                height={(height - 32) / 10}
                fill={getColor(value, heatmapData.maxValue)}
                className="transition-all duration-300"
              />
            ))
          )}
        </svg>

        {/* Click dots overlay */}
        <svg 
          width={width} 
          height={height - 32} 
          className="absolute top-8 left-0 pointer-events-none"
        >
          {clicks.slice(0, 50).map((click, i) => (
            <circle
              key={i}
              cx={(click.x / 100) * width}
              cy={(click.y / 100) * (height - 32)}
              r={3 + click.intensity}
              fill="hsl(var(--primary) / 0.6)"
              stroke="hsl(var(--primary))"
              strokeWidth={1}
            />
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(200 80% 60% / 0.4)' }} />
          <span>Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(60 90% 50% / 0.6)' }} />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded" style={{ backgroundColor: 'hsl(0 90% 50% / 0.8)' }} />
          <span>High</span>
        </div>
      </div>
    </div>
  );
}
