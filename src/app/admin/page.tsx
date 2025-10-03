'use client';

import { useState, useEffect } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/ui/admin-sidebar';
import { motion } from 'framer-motion';
import { Users, Activity, DollarSign, Eye, BarChart3, FileText, Settings, ArrowRight, RefreshCw, Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Mail, Phone } from 'lucide-react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cols } from '@/lib/firebase-collections';
import type { RequestDoc, ContactSubmission, Project, Invoice } from '@/lib/types';
import Link from 'next/link';

export default function AdminDashboard() {
  const { role, loading } = useUserRole();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [stats, setStats] = useState({
    totalRequests: 0,
    totalContacts: 0,
    totalProjects: 0,
    totalRevenue: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [requestItems, setRequestItems] = useState<any[]>([]);
  const filteredProjects = (projects || []).filter((p: any) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.name || p.title || '')?.toLowerCase()?.includes(q) ||
      (p.client || p.contact?.name || '')?.toLowerCase()?.includes(q) ||
      (p.status || p.state || '')?.toLowerCase()?.includes(q)
    );
  });

  // Fetch real data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true);
        
        // Fetch requests
        const requestsSnapshot = await getDocs(cols.requests());
        const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch contact submissions
        const contactsSnapshot = await getDocs(cols.contactSubmissions());
        const contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch projects
        const projectsSnapshot = await getDocs(cols.projects());
        const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Fetch invoices
        const invoicesSnapshot = await getDocs(cols.invoices());
        const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Calculate stats
        const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
        
        setStats({
          totalRequests: requests.length,
          totalContacts: contacts.length,
          totalProjects: projects.length,
          totalRevenue: totalRevenue,
        });

        setProjects(projects);
        setRequestItems(requests);

        // Create recent activity from all data
        const allActivity = [
          ...requests.slice(0, 3).map(req => ({
            id: req.id,
            action: 'New request received',
            user: req.contact?.name || 'Unknown',
            time: 'Recently',
            type: 'request',
            data: req
          })),
          ...contacts.slice(0, 2).map(contact => ({
            id: contact.id,
            action: 'Contact form submitted',
            user: contact.name || 'Unknown',
            time: 'Recently',
            type: 'contact',
            data: contact
          }))
        ].sort((a, b) => {
          const dateA = a.data.createdAt ? new Date(a.data.createdAt as any).getTime() : 0;
          const dateB = b.data.createdAt ? new Date(b.data.createdAt as any).getTime() : 0;
          return dateB - dateA;
        });
        
        setRecentActivity(allActivity.slice(0, 5));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoadingData(false);
      }
    };

    if (role === 'admin') {
      fetchData();
    }
  }, [role]);

  if (loading) return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        <p className="mt-2 text-muted-foreground">Loading...</p>
      </div>
    </main>
  );
  
  if (role !== 'admin') return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground">Admins only.</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">Return to Home</Link>
      </div>
    </main>
  );

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Re-fetch data
    const fetchData = async () => {
      try {
        const requestsSnapshot = await getDocs(cols.requests());
        const requests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const contactsSnapshot = await getDocs(cols.contactSubmissions());
        const contacts = contactsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const projectsSnapshot = await getDocs(cols.projects());
        const projects = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const invoicesSnapshot = await getDocs(cols.invoices());
        const invoices = invoicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        const totalRevenue = invoices.reduce((sum, invoice) => sum + (invoice.amount || 0), 0);
        
        setStats({
          totalRequests: requests.length,
          totalContacts: contacts.length,
          totalProjects: projects.length,
          totalRevenue: totalRevenue,
        });
        setProjects(projects);
        setRequestItems(requests);
      } catch (error) {
        console.error('Error refreshing data:', error);
      }
    };
    
    await fetchData();
    setIsRefreshing(false);
  };

  // Removed export action per request

  const handleAddUser = () => {
    console.log('Adding new user...');
  };

  // Quick actions for ARPK admin
  const quickActions = [
    {
      title: 'View Requests',
      description: 'Manage incoming project requests',
      icon: FileText,
      href: '/admin/requests',
      color: 'from-primary to-primary/80'
    },
    {
      title: 'Contact Submissions',
      description: 'View contact form submissions',
      icon: Mail,
      href: '/admin/contacts',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Client Dashboard',
      description: 'Access client features',
      icon: BarChart3,
      href: '/dashboard',
      color: 'from-green-500 to-green-600'
    }
  ];

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <AdminSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="flex-1 space-y-4 p-6 pt-6 md:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h2>
                <p className="text-muted-foreground">Live view of requests, contacts, projects, and revenue.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="lg:hidden">
                  <SidebarTrigger />
                </span>
                <button
                  onClick={handleRefresh}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm hover:shadow-sm"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total Requests</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{loadingData ? '...' : stats.totalRequests}</p>
                    <p className="text-xs text-muted-foreground mt-1">Open: {loadingData ? '...' : requestItems.filter((r:any)=> String(r.status||'new').toLowerCase() !== 'accepted').length}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-500">Live Data</span>
                      <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-primary/10 shadow-inner">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Contact Submissions</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{loadingData ? '...' : stats.totalContacts}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-500">Live Data</span>
                      <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-500/10 shadow-inner">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-500/10 blur-2xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Active Projects</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{loadingData ? '...' : stats.totalProjects}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-500">Live Data</span>
                      <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-purple-500/10 shadow-inner">
                    <BarChart3 className="h-6 w-6 text-purple-500" />
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-purple-500/10 blur-2xl" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative overflow-hidden rounded-xl border border-border bg-card p-6 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm font-medium">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground mt-1">{loadingData ? '...' : `£${stats.totalRevenue.toLocaleString()}`}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm font-medium text-green-500">Live Data</span>
                      <TrendingUp className="h-3 w-3 ml-1 text-green-500" />
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-green-500/10 shadow-inner">
                    <DollarSign className="h-6 w-6 text-green-500" />
                  </div>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-green-500/10 blur-2xl" />
              </motion.div>
            </div>

            {/* Main grid - shadcn dashboard-01 style */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Left column (Overview/Projects) */}
              <div className="col-span-4 space-y-8">
                {/* Requests */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg text-foreground">Requests</h3>
                    <Link href="/admin/requests" className="text-sm text-primary hover:underline">View all</Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requestItems.slice(0, 6).map((r: any) => (
                      <motion.div
                        key={r.id}
                        whileHover={{ y: -2 }}
                        className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-foreground line-clamp-2">{r.projectType || 'Request'}</p>
                            <p className="text-sm text-muted-foreground mt-1">{r.contact?.name || 'Client'}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                              {r.status || 'new'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">Submitted {r.createdAt ? '' : ''}</div>
                          <Link href={`/admin/requests`} className="text-sm text-primary hover:underline">Open</Link>
                        </div>
                      </motion.div>
                    ))}
                    {requestItems.length === 0 && (
                      <div className="col-span-full text-sm text-muted-foreground">No requests yet.</div>
                    )}
                  </div>
                </div>

                {/* Projects */}
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-foreground">Projects</h3>
                  <Link href="/admin/requests" className="text-sm text-primary hover:underline">Manage Requests</Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProjects.slice(0, 6).map((project: any) => (
                    <motion.div
                      key={project.id}
                      whileHover={{ y: -2 }}
                      className="rounded-xl border border-border bg-card p-5 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-foreground line-clamp-2">{project.name || project.title || 'Untitled Project'}</p>
                          <p className="text-sm text-muted-foreground mt-1">{project.client || project.contact?.name || 'Client'}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                            {project.status || project.state || 'new'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Progress</span>
                          <span className="font-medium text-foreground">{typeof project.progress === 'number' ? `${project.progress}%` : '—'}</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-muted">
                          <div className="h-2 rounded-full bg-primary" style={{ width: `${typeof project.progress === 'number' ? project.progress : 0}%` }} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">Due {project.dueDate || '—'}</div>
                        <Link href={`/admin/projects/${project.id}`} className="text-sm text-primary hover:underline">Open</Link>
                      </div>
                    </motion.div>
                  ))}
                  {filteredProjects.length === 0 && (
                    <div className="col-span-full text-sm text-muted-foreground">No projects yet.</div>
                  )}
                </div>
              </div>

              {/* Right column (Recent / Quick) */}
              <div className="col-span-3 space-y-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link href={action.href} className="group block">
                          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
                            <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} text-white`}>
                              <action.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                                {action.title}
                              </p>
                              <p className="text-sm text-muted-foreground">{action.description}</p>
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Link
                      href="/admin/projects"
                      className="inline-flex w-full items-center justify-center rounded-lg border border-border px-3 py-2 text-sm hover:bg-accent"
                    >Create Project</Link>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {recentActivity
                      .filter(a => {
                        const q = searchQuery.toLowerCase().trim();
                        if (!q) return true;
                        return (
                          a.action?.toLowerCase()?.includes(q) ||
                          a.user?.toLowerCase()?.includes(q) ||
                          a.type?.toLowerCase()?.includes(q)
                        );
                      })
                      .map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                      >
                        <div className={`p-2 rounded-full ${
                          activity.type === 'request' ? 'bg-blue-500/10 text-blue-500' :
                          activity.type === 'contact' ? 'bg-green-500/10 text-green-500' :
                          activity.type === 'payment' ? 'bg-purple-500/10 text-purple-500' :
                          'bg-orange-500/10 text-orange-500'
                        }`}>
                          {activity.type === 'request' && <FileText className="h-4 w-4" />}
                          {activity.type === 'contact' && <Mail className="h-4 w-4" />}
                          {activity.type === 'payment' && <DollarSign className="h-4 w-4" />}
                          {activity.type === 'update' && <Settings className="h-4 w-4" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.user}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {activity.time}
                        </div>
                      </motion.div>
                    ))}
                    {recentActivity.length === 0 && (
                      <div className="text-sm text-muted-foreground">No recent activity.</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* End of content */}
          </div>
          
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
