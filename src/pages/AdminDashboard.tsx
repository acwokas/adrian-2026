import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, BarChart3, MousePointerClick, ExternalLink, Eye, Download, Calendar, Users, Clock, TrendingDown, Monitor, Smartphone, Tablet } from "lucide-react";
import { format } from "date-fns";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

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

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
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
      if (start) {
        query = query.gte('created_at', start);
      }
      if (end) {
        query = query.lte('created_at', end);
      }
      
      const { data: events, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      if (!events) {
        setStats(null);
        return;
      }

      // Calculate stats
      const ctaClicks = events.filter(e => e.event_type === 'cta_click').length;
      const externalLinks = events.filter(e => e.event_type === 'external_link').length;
      const pageViews = events.filter(e => e.event_type === 'page_view').length;
      const clicks = events.filter(e => e.event_type === 'click').length;

      // Unique sessions
      const sessionIds = new Set(events.map(e => (e as AnalyticsEvent).session_id).filter(Boolean));
      const uniqueSessions = sessionIds.size;

      // Top events by name
      const eventCounts: Record<string, number> = {};
      events.forEach(e => {
        eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
      });
      const topEvents = Object.entries(eventCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Top pages
      const pageCounts: Record<string, number> = {};
      events.forEach(e => {
        if (e.page_path) {
          pageCounts[e.page_path] = (pageCounts[e.page_path] || 0) + 1;
        }
      });
      const topPages = Object.entries(pageCounts)
        .map(([path, count]) => ({ path, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      // Events over time (grouped by day)
      const eventsByDay: Record<string, { events: number; pageViews: number; clicks: number }> = {};
      events.forEach(e => {
        const day = format(new Date(e.created_at), 'MMM dd');
        if (!eventsByDay[day]) {
          eventsByDay[day] = { events: 0, pageViews: 0, clicks: 0 };
        }
        eventsByDay[day].events++;
        if (e.event_type === 'page_view') eventsByDay[day].pageViews++;
        if (e.event_type === 'click' || e.event_type === 'cta_click') eventsByDay[day].clicks++;
      });
      const eventsOverTime = Object.entries(eventsByDay)
        .map(([date, data]) => ({ date, ...data }))
        .reverse();

      // Event type distribution
      const eventTypeDistribution = [
        { name: 'Page Views', value: pageViews },
        { name: 'CTA Clicks', value: ctaClicks },
        { name: 'External Links', value: externalLinks },
        { name: 'Clicks', value: clicks },
      ].filter(item => item.value > 0);

      // Session journeys (top 5 sessions with most events)
      const sessionMap: Record<string, AnalyticsEvent[]> = {};
      events.forEach(e => {
        const sessionId = (e as AnalyticsEvent).session_id;
        if (sessionId) {
          if (!sessionMap[sessionId]) sessionMap[sessionId] = [];
          sessionMap[sessionId].push(e as AnalyticsEvent);
        }
      });
      const sessionJourneys = Object.entries(sessionMap)
        .map(([sessionId, events]) => ({ sessionId, events: events.reverse() }))
        .sort((a, b) => b.events.length - a.events.length)
        .slice(0, 5);

      // Calculate bounce rate (sessions with only 1 page view)
      let bouncedSessions = 0;
      let totalSessionsWithPageViews = 0;
      Object.values(sessionMap).forEach(sessionEvents => {
        const sessionPageViews = sessionEvents.filter(e => e.event_type === 'page_view').length;
        if (sessionPageViews > 0) {
          totalSessionsWithPageViews++;
          if (sessionPageViews === 1) {
            bouncedSessions++;
          }
        }
      });
      const bounceRate = totalSessionsWithPageViews > 0 
        ? Math.round((bouncedSessions / totalSessionsWithPageViews) * 100) 
        : 0;

      // Calculate average session duration
      let totalDuration = 0;
      let sessionsWithDuration = 0;
      Object.values(sessionMap).forEach(sessionEvents => {
        if (sessionEvents.length > 1) {
          const sortedEvents = [...sessionEvents].sort(
            (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
          const firstEvent = new Date(sortedEvents[0].created_at).getTime();
          const lastEvent = new Date(sortedEvents[sortedEvents.length - 1].created_at).getTime();
          const duration = lastEvent - firstEvent;
          if (duration > 0) {
            totalDuration += duration;
            sessionsWithDuration++;
          }
        }
      });
      const avgSessionDuration = sessionsWithDuration > 0 
        ? Math.round(totalDuration / sessionsWithDuration / 1000) // in seconds
        : 0;

      // Parse device type from user agent
      const parseDevice = (userAgent: string | null): string => {
        if (!userAgent) return 'Unknown';
        const ua = userAgent.toLowerCase();
        if (ua.includes('mobile') || ua.includes('android') && !ua.includes('tablet')) return 'Mobile';
        if (ua.includes('tablet') || ua.includes('ipad')) return 'Tablet';
        return 'Desktop';
      };

      // Parse browser from user agent
      const parseBrowser = (userAgent: string | null): string => {
        if (!userAgent) return 'Unknown';
        const ua = userAgent.toLowerCase();
        if (ua.includes('edg/')) return 'Edge';
        if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
        if (ua.includes('firefox')) return 'Firefox';
        if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
        if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
        return 'Other';
      };

      // Device breakdown
      const deviceCounts: Record<string, number> = {};
      events.forEach(e => {
        const device = parseDevice(e.user_agent);
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
      });
      const deviceBreakdown = Object.entries(deviceCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      // Browser breakdown
      const browserCounts: Record<string, number> = {};
      events.forEach(e => {
        const browser = parseBrowser(e.user_agent);
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });
      const browserBreakdown = Object.entries(browserCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      setStats({
        totalEvents: events.length,
        ctaClicks,
        externalLinks,
        pageViews,
        uniqueSessions,
        bounceRate,
        avgSessionDuration,
        topEvents,
        topPages,
        recentEvents: events.slice(0, 20),
        allEvents: events as AnalyticsEvent[],
        eventsOverTime,
        eventTypeDistribution,
        sessionJourneys,
        deviceBreakdown,
        browserBreakdown,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error loading analytics",
        description: "Could not fetch analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const exportToCSV = () => {
    if (!stats || stats.allEvents.length === 0) {
      toast({
        title: "No data to export",
        description: "There are no events to export for the selected date range.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['Event Name', 'Event Type', 'Page Path', 'Session ID', 'Referrer', 'User Agent', 'Event Data', 'Created At'];
    const rows = stats.allEvents.map(event => [
      event.event_name,
      event.event_type,
      event.page_path || '',
      event.session_id || '',
      event.referrer || '',
      event.user_agent || '',
      JSON.stringify(event.event_data || {}),
      event.created_at,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Export complete",
      description: `Exported ${stats.allEvents.length} events to CSV.`,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <SEO 
        title="Analytics Dashboard" 
        description="Site analytics and event tracking dashboard."
        canonical="/admin"
      />
      <section className="section-spacing">
        <div className="container-wide">
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl">Analytics Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Logged in as {user.email}
                </p>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut size={16} />
                Sign Out
              </Button>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="flex gap-2 flex-wrap">
                {(['today', 'week', 'month', 'custom', 'all'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateRange(range)}
                  >
                    {range === 'today' ? 'Today' : range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : range === 'custom' ? 'Custom' : 'All Time'}
                  </Button>
                ))}
              </div>
              
              {dateRange === 'custom' && (
                <div className="flex gap-3 items-end">
                  <div className="space-y-1">
                    <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-36"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="end-date" className="text-xs">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-36"
                    />
                  </div>
                  <Button size="sm" onClick={fetchStats}>
                    <Calendar size={14} />
                    Apply
                  </Button>
                </div>
              )}
              
              <Button variant="outline" size="sm" onClick={exportToCSV} className="ml-auto">
                <Download size={14} />
                Export CSV
              </Button>
            </div>

            {loadingStats ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : stats ? (
              <>
                {/* Stats Cards - Row 1 */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <BarChart3 size={16} />
                        Total Events
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.totalEvents}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Users size={16} />
                        Sessions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.uniqueSessions}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Eye size={16} />
                        Page Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.pageViews}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <TrendingDown size={16} />
                        Bounce Rate
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.bounceRate}%</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Clock size={16} />
                        Avg. Duration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {stats.avgSessionDuration >= 60 
                          ? `${Math.floor(stats.avgSessionDuration / 60)}m ${stats.avgSessionDuration % 60}s`
                          : `${stats.avgSessionDuration}s`
                        }
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Stats Cards - Row 2 */}
                <div className="grid grid-cols-3 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <MousePointerClick size={16} />
                        CTA Clicks
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.ctaClicks}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <ExternalLink size={16} />
                        External Links
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.externalLinks}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Monitor size={16} />
                        Desktop
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {stats.deviceBreakdown.find(d => d.name === 'Desktop')?.value || 0}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Events Over Time Chart */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Events Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.eventsOverTime.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <AreaChart data={stats.eventsOverTime}>
                            <defs>
                              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="events" 
                              stroke="hsl(var(--primary))" 
                              fillOpacity={1} 
                              fill="url(#colorEvents)" 
                              name="Total Events"
                            />
                            <Area 
                              type="monotone" 
                              dataKey="pageViews" 
                              stroke="hsl(var(--accent))" 
                              fillOpacity={1} 
                              fill="url(#colorPageViews)" 
                              name="Page Views"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-12">No data to display</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Event Type Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Event Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.eventTypeDistribution.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                          <PieChart>
                            <Pie
                              data={stats.eventTypeDistribution}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {stats.eventTypeDistribution.map((_, index) => (
                                <Cell 
                                  key={`cell-${index}`} 
                                  fill={[
                                    'hsl(var(--primary))', 
                                    'hsl(var(--accent))', 
                                    'hsl(var(--secondary))',
                                    'hsl(var(--muted))'
                                  ][index % 4]} 
                                />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'hsl(var(--card))', 
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '8px'
                              }} 
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-12">No data to display</p>
                      )}
                      <div className="flex flex-wrap gap-3 justify-center mt-2">
                        {stats.eventTypeDistribution.map((item, i) => (
                          <div key={item.name} className="flex items-center gap-2 text-xs">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ 
                                backgroundColor: [
                                  'hsl(var(--primary))', 
                                  'hsl(var(--accent))', 
                                  'hsl(var(--secondary))',
                                  'hsl(var(--muted))'
                                ][i % 4] 
                              }} 
                            />
                            <span className="text-muted-foreground">{item.name}: {item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Device and Browser Charts */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Device Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor size={18} />
                        Device Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.deviceBreakdown.length > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.deviceBreakdown} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }} 
                              />
                              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                          <div className="flex justify-center gap-6 mt-4">
                            {stats.deviceBreakdown.map((device) => (
                              <div key={device.name} className="flex items-center gap-2 text-sm">
                                {device.name === 'Desktop' && <Monitor size={16} className="text-muted-foreground" />}
                                {device.name === 'Mobile' && <Smartphone size={16} className="text-muted-foreground" />}
                                {device.name === 'Tablet' && <Tablet size={16} className="text-muted-foreground" />}
                                <span className="text-muted-foreground">{device.name}:</span>
                                <span className="font-medium">{device.value}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-12">No data to display</p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Browser Breakdown */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Browser Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {stats.browserBreakdown.length > 0 ? (
                        <>
                          <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={stats.browserBreakdown} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                              <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'hsl(var(--card))', 
                                  border: '1px solid hsl(var(--border))',
                                  borderRadius: '8px'
                                }} 
                              />
                              <Bar dataKey="value" fill="hsl(var(--accent))" radius={[0, 4, 4, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                          <div className="flex flex-wrap justify-center gap-4 mt-4">
                            {stats.browserBreakdown.slice(0, 5).map((browser) => (
                              <div key={browser.name} className="flex items-center gap-2 text-sm">
                                <span className="text-muted-foreground">{browser.name}:</span>
                                <span className="font-medium">{browser.value}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-muted-foreground text-sm text-center py-12">No data to display</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {stats.sessionJourneys.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent User Journeys</CardTitle>
                    </CardHeader>
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
                                  <span className="px-2 py-1 bg-secondary rounded text-xs">
                                    {event.page_path || event.event_name}
                                  </span>
                                  {i < session.events.length - 1 && (
                                    <span className="text-muted-foreground">→</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Top Events & Pages */}
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Events</CardTitle>
                    </CardHeader>
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
                    <CardHeader>
                      <CardTitle>Top Pages</CardTitle>
                    </CardHeader>
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
                  <CardHeader>
                    <CardTitle>Recent Events</CardTitle>
                  </CardHeader>
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
                                <td className="py-2">
                                  <span className="px-2 py-0.5 bg-secondary rounded text-xs">
                                    {event.event_type}
                                  </span>
                                </td>
                                <td className="py-2 text-muted-foreground">{event.page_path}</td>
                                <td className="py-2 text-muted-foreground">
                                  {new Date(event.created_at).toLocaleString()}
                                </td>
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
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No analytics data available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}