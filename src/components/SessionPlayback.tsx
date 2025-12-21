import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { format } from "date-fns";

interface RecordedEvent {
  type: 'mouse' | 'click' | 'scroll' | 'navigation';
  timestamp: number;
  x?: number;
  y?: number;
  scrollX?: number;
  scrollY?: number;
  path?: string;
  target?: string;
}

interface SessionRecording {
  id: string;
  session_id: string;
  page_path: string;
  events: RecordedEvent[];
  started_at: string;
  ended_at: string | null;
  viewport_width: number | null;
  viewport_height: number | null;
}

interface SessionPlaybackProps {
  recording: SessionRecording;
  onClose: () => void;
}

export function SessionPlayback({ recording, onClose }: SessionPlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>([]);
  const [currentPath, setCurrentPath] = useState(recording.page_path);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  const clickIdRef = useRef(0);

  const events = recording.events || [];
  const duration = events.length > 0 ? events[events.length - 1].timestamp : 0;

  const processEventsUpTo = useCallback((time: number) => {
    const relevantEvents = events.filter(e => e.timestamp <= time);
    
    // Process most recent mouse position
    const mouseEvents = relevantEvents.filter(e => e.type === 'mouse' || e.type === 'click');
    if (mouseEvents.length > 0) {
      const lastMouse = mouseEvents[mouseEvents.length - 1];
      if (lastMouse.x !== undefined && lastMouse.y !== undefined) {
        setCursorPosition({ x: lastMouse.x, y: lastMouse.y });
      }
    }

    // Process navigation
    const navEvents = relevantEvents.filter(e => e.type === 'navigation');
    if (navEvents.length > 0) {
      setCurrentPath(navEvents[navEvents.length - 1].path || recording.page_path);
    }
  }, [events, recording.page_path]);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    setCurrentTime(prev => {
      const newTime = prev + delta;
      if (newTime >= duration) {
        setIsPlaying(false);
        return duration;
      }
      
      // Check for clicks at this time
      const clickEvents = events.filter(
        e => e.type === 'click' && e.timestamp > prev && e.timestamp <= newTime
      );
      
      clickEvents.forEach(click => {
        if (click.x !== undefined && click.y !== undefined) {
          const id = ++clickIdRef.current;
          setClicks(prev => [...prev, { x: click.x!, y: click.y!, id }]);
          setTimeout(() => {
            setClicks(prev => prev.filter(c => c.id !== id));
          }, 500);
        }
      });
      
      processEventsUpTo(newTime);
      return newTime;
    });
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(animate);
    }
  }, [duration, events, isPlaying, processEventsUpTo]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = 0;
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, animate]);

  const handlePlayPause = () => {
    if (currentTime >= duration) {
      setCurrentTime(0);
      lastTimeRef.current = 0;
    }
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    lastTimeRef.current = 0;
    setCursorPosition({ x: 50, y: 50 });
    setClicks([]);
    setCurrentPath(recording.page_path);
  };

  const handleSeek = (value: number[]) => {
    const time = value[0];
    setCurrentTime(time);
    processEventsUpTo(time);
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">Session Replay</h2>
          <p className="text-sm text-muted-foreground">
            {recording.session_id.slice(0, 12)}... • Started {format(new Date(recording.started_at), 'MMM d, HH:mm')}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X size={20} />
        </Button>
      </div>

      {/* Playback area */}
      <div className="flex-1 relative overflow-hidden bg-muted/30">
        {/* Page mockup */}
        <div className="absolute inset-4 bg-card rounded-lg border border-border shadow-lg overflow-hidden">
          {/* Browser chrome */}
          <div className="h-10 bg-muted/50 border-b border-border flex items-center px-3 gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="flex-1 mx-4 h-6 bg-background rounded flex items-center px-3">
              <span className="text-xs text-muted-foreground truncate">{currentPath}</span>
            </div>
          </div>

          {/* Content area with cursor */}
          <div className="relative h-[calc(100%-2.5rem)] bg-background">
            {/* Simulated page layout */}
            <div className="p-6 space-y-4">
              <div className="h-8 w-48 bg-muted rounded" />
              <div className="h-4 w-full bg-muted/50 rounded" />
              <div className="h-4 w-3/4 bg-muted/50 rounded" />
              <div className="h-4 w-5/6 bg-muted/50 rounded" />
              <div className="h-32 w-full bg-muted/30 rounded mt-8" />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="h-24 bg-muted/30 rounded" />
                <div className="h-24 bg-muted/30 rounded" />
                <div className="h-24 bg-muted/30 rounded" />
              </div>
            </div>

            {/* Cursor */}
            <div
              className="absolute w-4 h-4 pointer-events-none transition-all duration-75 ease-out"
              style={{
                left: `${cursorPosition.x}%`,
                top: `${cursorPosition.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <svg viewBox="0 0 24 24" className="w-full h-full fill-primary drop-shadow-lg">
                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.87a.5.5 0 0 0 .35-.85L6.35 2.86a.5.5 0 0 0-.85.35z" />
              </svg>
            </div>

            {/* Click ripples */}
            {clicks.map(click => (
              <div
                key={click.id}
                className="absolute w-8 h-8 pointer-events-none"
                style={{
                  left: `${click.x}%`,
                  top: `${click.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <div className="w-full h-full rounded-full bg-primary/30 animate-ping" />
                <div className="absolute inset-0 w-full h-full rounded-full bg-primary/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Event count indicator */}
        <div className="absolute bottom-8 right-8 bg-card border border-border rounded-lg px-3 py-2 text-sm">
          <span className="text-muted-foreground">Events: </span>
          <span className="font-medium">{events.length}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="border-t border-border p-4 space-y-3">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handlePlayPause}>
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </Button>
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw size={18} />
          </Button>
          <span className="text-sm font-mono text-muted-foreground w-24">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration}
            step={100}
            onValueChange={handleSeek}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}
