import { Video, Play } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SessionRecording {
  id: string;
  page_path: string;
  session_id: string;
  started_at: string;
  events: any[];
}

interface SessionRecordingsListProps {
  recordings: SessionRecording[];
  onSelectRecording: (recording: SessionRecording) => void;
}

export function SessionRecordingsList({ recordings, onSelectRecording }: SessionRecordingsListProps) {
  if (recordings.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video size={18} />
          Session Recordings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recordings.map((recording) => {
            const events = (recording.events as any[]) || [];
            const duration = events.length > 0 ? events[events.length - 1]?.timestamp || 0 : 0;
            const durationSecs = Math.round(duration / 1000);
            
            return (
              <div
                key={recording.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                onClick={() => onSelectRecording(recording)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{recording.page_path}</span>
                    <span className="text-xs text-muted-foreground">
                      {recording.session_id.slice(0, 8)}...
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{format(new Date(recording.started_at), 'MMM d, HH:mm')}</span>
                    <span>{events.length} events</span>
                    <span>{durationSecs}s duration</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Play size={14} />
                  Replay
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
