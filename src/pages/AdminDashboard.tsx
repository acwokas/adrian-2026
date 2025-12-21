import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader2, BarChart3, MousePointerClick, ExternalLink, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type AnalyticsEvent = Database['public']['Tables']['analytics_events']['Row'];

interface EventStats {
  totalEvents: number;
  ctaClicks: number;
  externalLinks: number;
  pageViews: number;
  topEvents: { name: string; count: number }[];
  topPages: { path: string; count: number }[];
  recentEvents: AnalyticsEvent[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [stats, setStats] = useState<EventStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

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

  const getDateFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0)).toISOString();
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case 'month':
        return new Date(now.setDate(now.getDate() - 30)).toISOString();
      default:
        return null;
    }
  };

  const fetchStats = async () => {
    setLoadingStats(true);
    try {
      const dateFilter = getDateFilter();
      
      let query = supabase.from('analytics_events').select('*');
      if (dateFilter) {
        query = query.gte('created_at', dateFilter);
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

      setStats({
        totalEvents: events.length,
        ctaClicks,
        externalLinks,
        pageViews,
        topEvents,
        topPages,
        recentEvents: events.slice(0, 20),
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
            <div className="flex gap-2 flex-wrap">
              {(['today', 'week', 'month', 'all'] as const).map((range) => (
                <Button
                  key={range}
                  variant={dateRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setDateRange(range)}
                >
                  {range === 'today' ? 'Today' : range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : 'All Time'}
                </Button>
              ))}
            </div>

            {loadingStats ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : stats ? (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <Eye size={16} />
                        Page Views
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{stats.pageViews}</p>
                    </CardContent>
                  </Card>
                </div>

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