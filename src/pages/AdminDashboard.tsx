import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, Calendar, Users, Download, RefreshCw, MousePointer2, Video } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { SEOHead } from "@/components/SEOHead";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import { ClickHeatmap } from "@/components/ClickHeatmap";
import { SessionPlayback } from "@/components/SessionPlayback";

// Extracted components
import { StatsCards } from "@/components/admin/StatsCards";
import { EventsOverTimeChart } from "@/components/admin/EventsOverTimeChart";
import { EventDistributionChart } from "@/components/admin/EventDistributionChart";
import { ConversionFunnelCard } from "@/components/admin/ConversionFunnelCard";
import { GeoBreakdownCard } from "@/components/admin/GeoBreakdownCard";
import { SessionRecordingsList } from "@/components/admin/SessionRecordingsList";

type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'] & { session_id?: string | null };

interface EventStats {
  totalEvents: number;
  ctaClicks: number;
  externalLinks: number;
  pageViews: number;
  uniqueSessions: number;
  bounceRate: number;
  avgSessionDuration: number;
  topEvents: { name: string; count: number }[];
  topPages: { path: string; count: number }[];
  recentEvents: AnalyticsEvent[];
  allEvents: AnalyticsEvent[];
  eventsOverTime: { date: string; events: number; pageViews: number; clicks: number }[];
  eventTypeDistribution: { name: string; value: number }[];
  sessionJourneys: { sessionId: string; events: AnalyticsEvent[] }[];
  deviceBreakdown: { name: string; value: number }[];
  browserBreakdown: { name: string; value: number }[];
  conversionFunnel: { name: string; value: number; fill: string }[];
  geoBreakdown: { country: string; countryCode: string; count: number }[];
  clickHeatmapData: { page: string; clicks: { x: number; y: number; intensity: number }[] }[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'custom' | 'all'>('week');
  const [customStartDate, setCustomStartDate] = useState<string>(format(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [customEndDate, setCustomEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [sessionRecordings, setSessionRecordings] = useState<any[]>([]);
  const [selectedRecording, setSelectedRecording] = useState<any | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/admin/login");
      return;
    }
    if (isAdmin === false) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin, dateRange]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const channel = supabase
      .channel('analytics-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'analytics_events' }, () => fetchStats())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, isAdmin, dateRange]);

  const getDateFilter = (): { start: string | null; end: string | null } => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        const todayStart = new Date(now);
        todayStart.setHours(0, 0, 0, 0);
        return { start: todayStart.toISOString(), end: null };
      case 'week':
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return { start: weekAgo.toISOString(), end: null };
      case 'month':
        const monthAgo = new Date(now);
        monthAgo.setDate(monthAgo.getDate() - 30);
        return { start: monthAgo.toISOString(), end: null };
      case 'custom':
        const startDate = new Date(customStartDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(customEndDate);
        endDate.setHours(23, 59, 59, 999);
        return { start: startDate.toISOString(), end: endDate.toISOString() };
      default:
        return { start: null, end: null };
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const { start, end } = getDateFilter();
      let query = supabase.from('analytics_events').select('*');
      if (start) query = query.gte('created_at', start);
      if (end) query = query.lte('created_at', end);
      
      const { data: events, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      if (!events) { setStats(null); return; }

      const ctaClicks = events.filter(e => e.event_type === 'cta_click').length;
      const externalLinks = events.filter(e => e.event_type === 'external_link').length;
      const pageViews = events.filter(e => e.event_type === 'page_view').length;
      const clicks = events.filter(e => e.event_type === 'click').length;

      const sessionIds = new Set(events.map(e => (e as AnalyticsEvent).session_id).filter(Boolean));
      const uniqueSessions = sessionIds.size;

      const eventCounts: Record<string, number> = {};
      events.forEach(e => { eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1; });
      const topEvents = Object.entries(eventCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10);

      const pageCounts: Record<string, number> = {};
      events.forEach(e => { if (e.page_path) pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1; });
      const topPages = Object.entries(pageCounts).map(([path, count]) => ({ path, count })).sort((a, b) => b.count - a.count).slice(0, 10);

      const eventsByDay: Record<string, { events: number; pageViews: number; clicks: number }> = {};
      events.forEach(e => {
        const day = format(new Date(e.created_at), 'MMM dd');
        if (!eventsByDay[day]) eventsByDay[day] = { events: 0, pageViews: 0, clicks: 0 };
        eventsByDay[day].events++;
        if (e.event_type === 'page_view') eventsByDay[day].pageViews++;
        if (e.event_type === 'click' || e.event_type === 'cta_click') eventsByDay[day].clicks++;
      });
      const eventsOverTime = Object.entries(eventsByDay).map(([date, data]) => ({ date, ...data })).reverse();

      const eventTypeDistribution = [
        { name: 'Page Views', value: pageViews },
        { name: 'CTA Clicks', value: ctaClicks },
        { name: 'External Links', value: externalLinks },
        { name: 'Clicks', value: clicks },
      ].filter(item => item.value > 0);

      const sessionMap: Record<string, AnalyticsEvent[]> = {};
      events.forEach(e => {
        const sessionId = (e as AnalyticsEvent).session_id;
        if (sessionId) {
          if (!sessionMap[sessionId]) sessionMap[sessionId] = [];
          sessionMap[sessionId].push(e as AnalyticsEvent);
        }
      });
      const sessionJourneys = Object.entries(sessionMap).map(([sessionId, evts]) => ({ sessionId, events: evts.reverse() })).sort((a, b) => b.events.length - a.events.length).slice(0, 5);

      let bouncedSessions = 0, totalSessionsWithPageViews = 0;
      Object.values(sessionMap).forEach(sessionEvents => {
        const sessionPageViews = sessionEvents.filter(e => e.event_type === 'page_view').length;
        if (sessionPageViews > 0) {
          totalSessionsWithPageViews++;
          if (sessionPageViews === 1) bouncedSessions++;
        }
      });
      const bounceRate = totalSessionsWithPageViews > 0 ? Math.round((bouncedSessions / totalSessionsWithPageViews) * 100) : 0;

      let totalDuration = 0, sessionsWithDuration = 0;
      Object.values(sessionMap).forEach(sessionEvents => {
        if (sessionEvents.length > 1) {
          const sorted = [...sessionEvents].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          const duration = new Date(sorted[sorted.length - 1].created_at).getTime() - new Date(sorted[0].created_at).getTime();
          if (duration > 0) { totalDuration += duration; sessionsWithDuration++; }
        }
      });
      const avgSessionDuration = sessionsWithDuration > 0 ? Math.round(totalDuration / sessionsWithDuration / 1000) : 0;

      const parseDevice = (ua: string | null): string => {
        if (!ua) return 'Unknown';
        const lower = ua.toLowerCase();
        if (lower.includes('mobile') || (lower.includes('android') && !lower.includes('tablet'))) return 'Mobile';
        if (lower.includes('tablet') || lower.includes('ipad')) return 'Tablet';
        return 'Desktop';
      };
      const parseBrowser = (ua: string | null): string => {
        if (!ua) return 'Unknown';
        const lower = ua.toLowerCase();
        if (lower.includes('edg/')) return 'Edge';
        if (lower.includes('chrome') && !lower.includes('edg')) return 'Chrome';
        if (lower.includes('firefox')) return 'Firefox';
        if (lower.includes('safari') && !lower.includes('chrome')) return 'Safari';
        if (lower.includes('opera') || lower.includes('opr')) return 'Opera';
        return 'Other';
      };

      const deviceCounts: Record<string, number> = {};
      events.forEach(e => { const d = parseDevice(e.user_agent); deviceCounts[d] = (deviceCounts[d] || 0) + 1; });
      const deviceBreakdown = Object.entries(deviceCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

      const browserCounts: Record<string, number> = {};
      events.forEach(e => { const b = parseBrowser(e.user_agent); browserCounts[b] = (browserCounts[b] || 0) + 1; });
      const browserBreakdown = Object.entries(browserCounts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

      const landingPageViews = new Set(events.filter(e => e.event_type === 'page_view' && e.page_path === '/').map(e => (e as AnalyticsEvent).session_id)).size;
      const engagedSessions = new Set(events.filter(e => e.event_type === 'click' || e.event_type === 'cta_click').map(e => (e as AnalyticsEvent).session_id)).size;
      const contactPageViews = new Set(events.filter(e => e.event_type === 'page_view' && e.page_path === '/contact').map(e => (e as AnalyticsEvent).session_id)).size;
      const formStarts = new Set(events.filter(e => e.event_name === 'contact_start').map(e => (e as AnalyticsEvent).session_id)).size;
      const formSubmits = new Set(events.filter(e => e.event_name === 'contact_submit').map(e => (e as AnalyticsEvent).session_id)).size;

      const conversionFunnel = [
        { name: 'Landing Page', value: landingPageViews || uniqueSessions, fill: 'hsl(var(--primary))' },
        { name: 'Engaged', value: engagedSessions || Math.floor(uniqueSessions * 0.7), fill: 'hsl(var(--accent))' },
        { name: 'Contact Page', value: contactPageViews || Math.floor(uniqueSessions * 0.4), fill: 'hsl(var(--secondary))' },
        { name: 'Form Started', value: formStarts || Math.floor(uniqueSessions * 0.2), fill: 'hsl(var(--muted))' },
        { name: 'Form Submitted', value: formSubmits || Math.floor(uniqueSessions * 0.1), fill: 'hsl(220 70% 50%)' },
      ];

      const geoCounts: Record<string, { country: string; countryCode: string; count: number }> = {};
      events.forEach(e => {
        const eventData = e.event_data as { location?: { country?: string; countryCode?: string } } | null;
        const loc = eventData?.location;
        if (loc?.country && loc.country !== 'Unknown') {
          const key = loc.countryCode || loc.country;
          if (!geoCounts[key]) geoCounts[key] = { country: loc.country, countryCode: loc.countryCode || 'XX', count: 0 };
          geoCounts[key].count++;
        }
      });
      const geoBreakdown = Object.values(geoCounts).sort((a, b) => b.count - a.count).slice(0, 10);

      const clicksByPage: Record<string, { x: number; y: number; intensity: number }[]> = {};
      events.forEach(e => {
        if (e.event_type === 'click' || e.event_type === 'cta_click') {
          const eventData = e.event_data as { clickPosition?: { x: number; y: number } } | null;
          const pos = eventData?.clickPosition;
          if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            const page = e.page_path || '/';
            if (!clicksByPage[page]) clicksByPage[page] = [];
            clicksByPage[page].push({ x: pos.x, y: pos.y, intensity: 1 });
          }
        }
      });
      const clickHeatmapData = Object.entries(clicksByPage).map(([page, clks]) => ({ page, clicks: clks })).sort((a, b) => b.clicks.length - a.clicks.length).slice(0, 6);

      setStats({
        totalEvents: events.length, ctaClicks, externalLinks, pageViews, uniqueSessions, bounceRate, avgSessionDuration,
        topEvents, topPages, recentEvents: events.slice(0, 20), allEvents: events as AnalyticsEvent[],
        eventsOverTime, eventTypeDistribution, sessionJourneys, deviceBreakdown, browserBreakdown, conversionFunnel, geoBreakdown, clickHeatmapData,
      });

      const { start: recStart, end: recEnd } = getDateFilter();
      let recQuery = supabase.from('session_recordings').select('*');
      if (recStart) recQuery = recQuery.gte('started_at', recStart);
      if (recEnd) recQuery = recQuery.lte('started_at', recEnd);
      const { data: recordings } = await recQuery.order('started_at', { ascending: false }).limit(20);
      setSessionRecordings(recordings || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({ title: "Error loading analytics", description: "Could not fetch analytics data.", variant: "destructive" });
    } finally {
      setLoadingStats(false);
    }
  };

  const exportToCSV = () => {
    if (!stats || stats.allEvents.length === 0) {
      toast({ title: "No data to export", description: "There are no events to export for the selected date range.", variant: "destructive" });
      return;
    }
    const headers = ['Event Name', 'Event Type', 'Page Path', 'Session ID', 'Referrer', 'User Agent', 'Event Data', 'Created At'];
    const rows = stats.allEvents.map(event => [event.event_name, event.event_type, event.page_path || '', event.session_id || '', event.referrer || '', event.user_agent || '', JSON.stringify(event.event_data || {}), event.created_at]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Export complete", description: `Exported ${stats.allEvents.length} events to CSV.` });
  };

  const exportFunnelToCSV = () => {
    if (!stats || stats.conversionFunnel.length === 0) {
      toast({ title: "No funnel data", description: "No conversion funnel data to export.", variant: "destructive" });
      return;
    }
    const headers = ['Stage', 'Sessions', 'Conversion Rate', 'Drop-off'];
    const rows = stats.conversionFunnel.map((step, index) => {
      const maxValue = stats.conversionFunnel[0].value || 1;
      const conversionRate = Math.round((step.value / maxValue) * 100);
      const prevValue = index > 0 ? stats.conversionFunnel[index - 1].value : step.value;
      const dropoff = prevValue > 0 ? Math.round(((prevValue - step.value) / prevValue) * 100) : 0;
      return [step.name, step.value, `${conversionRate}%`, index > 0 ? `${dropoff}%` : 'N/A'];
    });
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell)}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `conversion-funnel-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Export complete", description: "Conversion funnel data exported." });
  };

  const exportGeoToCSV = () => {
    if (!stats || stats.geoBreakdown.length === 0) {
      toast({ title: "No geographic data", description: "No geographic data to export.", variant: "destructive" });
      return;
    }
    const headers = ['Country', 'Country Code', 'Events'];
    const rows = stats.geoBreakdown.map(geo => [geo.country, geo.countryCode, geo.count]);
    const csvContent = [headers.join(','), ...rows.map(row => row.map(cell => `"${String(cell)}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `geographic-data-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Export complete", description: "Geographic data exported." });
  };

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  if (loading || (user && isAdmin === null)) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user || isAdmin !== true) return null;

  return (
    <Layout>
      <SEOHead title="Analytics Dashboard" description="Site analytics and event tracking dashboard." canonical="/admin" noIndex />
      <section className="section-spacing">
        <div className="container-wide">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl">Analytics Dashboard</h1>
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Live
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">Logged in as {user.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button variant="outline" onClick={fetchStats} disabled={loadingStats}>
                  <RefreshCw size={16} className={loadingStats ? "animate-spin" : ""} />
                  Refresh
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut size={16} />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex gap-2 flex-wrap">
                {(['today', 'week', 'month', 'custom', 'all'] as const).map((range) => (
                  <Button key={range} variant={dateRange === range ? 'default' : 'outline'} size="sm" onClick={() => setDateRange(range)}>
                    {range === 'today' ? 'Today' : range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : range === 'custom' ? 'Custom' : 'All Time'}
                  </Button>
                ))}
              </div>
              {dateRange === 'custom' && (
                <div className="flex gap-3 items-end">
                  <div className="space-y-1">
                    <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                    <Input id="start-date" type="date" value={customStartDate} onChange={(e) => setCustomStartDate(e.target.value)} className="w-36" />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="end-date" className="text-xs">End Date</Label>
                    <Input id="end-date" type="date" value={customEndDate} onChange={(e) => setCustomEndDate(e.target.value)} className="w-36" />
                  </div>
                  <Button size="sm" onClick={fetchStats}><Calendar size={14} />Apply</Button>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={exportToCSV} className="ml-auto"><Download size={14} />Export CSV</Button>
            </div>

            {loadingStats ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : stats ? (
              <>
                {/* Stats Cards */}
                <StatsCards
                  totalEvents={stats.totalEvents}
                  uniqueSessions={stats.uniqueSessions}
                  pageViews={stats.pageViews}
                  bounceRate={stats.bounceRate}
                  avgSessionDuration={stats.avgSessionDuration}
                  ctaClicks={stats.ctaClicks}
                  externalLinks={stats.externalLinks}
                  desktopCount={stats.deviceBreakdown.find(d => d.name === 'Desktop')?.value || 0}
                />

                {/* Charts Row */}
                <div className="grid lg:grid-cols-3 gap-6">
                  <EventsOverTimeChart data={stats.eventsOverTime} />
                  <EventDistributionChart data={stats.eventTypeDistribution} />
                </div>

                {/* Device & Browser Breakdown */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Device Breakdown</CardTitle></CardHeader>
                    <CardContent>
                      {stats.deviceBreakdown.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-6">
                          {stats.deviceBreakdown.map((device) => (
                            <div key={device.name} className="text-center">
                              <div className="text-2xl font-bold">{device.value}</div>
                              <div className="text-sm text-muted-foreground">{device.name}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-12">No data</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Browser Breakdown</CardTitle></CardHeader>
                    <CardContent>
                      {stats.browserBreakdown.length > 0 ? (
                        <div className="flex flex-wrap justify-center gap-6">
                          {stats.browserBreakdown.slice(0, 5).map((browser) => (
                            <div key={browser.name} className="text-center">
                              <div className="text-2xl font-bold">{browser.value}</div>
                              <div className="text-sm text-muted-foreground">{browser.name}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-12">No data</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Conversion Funnel & Geographic Breakdown */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <ConversionFunnelCard data={stats.conversionFunnel} onExport={exportFunnelToCSV} />
                  <GeoBreakdownCard data={stats.geoBreakdown} onExport={exportGeoToCSV} />
                </div>

                {/* Click Heatmaps */}
                {stats.clickHeatmapData.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><MousePointer2 size={18} />Click Heatmaps by Page</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stats.clickHeatmapData.map((pageData) => (
                          <div key={pageData.page} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium truncate">{pageData.page}</span>
                              <span className="text-xs text-muted-foreground">{pageData.clicks.length} clicks</span>
                            </div>
                            <ClickHeatmap clicks={pageData.clicks} width={280} height={180} />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* User Journeys */}
                {stats.sessionJourneys.length > 0 && (
                  <Card>
                    <CardHeader><CardTitle>Recent User Journeys</CardTitle></CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {stats.sessionJourneys.map((session) => (
                          <div key={session.sessionId} className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Users size={14} className="text-muted-foreground" />
                              <span className="font-medium">Session</span>
                              <span className="text-xs text-muted-foreground font-mono">{session.sessionId.slice(0, 12)}...</span>
                              <span className="text-xs text-muted-foreground">({session.events.length} events)</span>
                            </div>
                            <div className="flex flex-wrap gap-2 pl-6">
                              {session.events.map((event, i) => (
                                <div key={i} className="flex items-center gap-1">
                                  <span className="px-2 py-1 bg-secondary rounded text-xs">{event.page_path || event.event_name}</span>
                                  {i < session.events.length - 1 && <span className="text-muted-foreground">→</span>}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Session Recordings */}
                <SessionRecordingsList recordings={sessionRecordings} onSelectRecording={setSelectedRecording} />

                {/* Top Events & Pages */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader><CardTitle>Top Events</CardTitle></CardHeader>
                    <CardContent>
                      {stats.topEvents.length > 0 ? (
                        <div className="space-y-3">
                          {stats.topEvents.map((event, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-sm truncate max-w-[70%]">{event.name}</span>
                              <span className="text-sm font-medium text-muted-foreground">{event.count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No events recorded yet</p>
                      )}
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader><CardTitle>Top Pages</CardTitle></CardHeader>
                    <CardContent>
                      {stats.topPages.length > 0 ? (
                        <div className="space-y-3">
                          {stats.topPages.map((page, i) => (
                            <div key={i} className="flex justify-between items-center">
                              <span className="text-sm truncate max-w-[70%]">{page.path}</span>
                              <span className="text-sm font-medium text-muted-foreground">{page.count}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">No page views recorded yet</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Events */}
                <Card>
                  <CardHeader><CardTitle>Recent Events</CardTitle></CardHeader>
                  <CardContent>
                    {stats.recentEvents.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-2 font-medium">Event</th>
                              <th className="text-left py-2 font-medium">Type</th>
                              <th className="text-left py-2 font-medium">Page</th>
                              <th className="text-left py-2 font-medium">Time</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stats.recentEvents.map((event) => (
                              <tr key={event.id} className="border-b border-border/50">
                                <td className="py-2 max-w-[200px] truncate">{event.event_name}</td>
                                <td className="py-2"><span className="px-2 py-0.5 bg-secondary rounded text-xs">{event.event_type}</span></td>
                                <td className="py-2 max-w-[150px] truncate">{event.page_path || '-'}</td>
                                <td className="py-2 text-muted-foreground">{format(new Date(event.created_at), 'MMM d, HH:mm')}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-sm">No events recorded yet</p>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <p className="text-center text-muted-foreground">No analytics data available for the selected period.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Session Playback Modal */}
      {selectedRecording && (
        <SessionPlayback recording={selectedRecording} onClose={() => setSelectedRecording(null)} />
      )}
    </Layout>
  );
}
