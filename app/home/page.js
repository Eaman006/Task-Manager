"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { PlusCircle, ListTodo, AlertTriangle, CheckCircle2, BarChart, Clock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../firebase/config';
import { collection, onSnapshot, orderBy, query, doc, updateDoc, addDoc } from 'firebase/firestore';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

// Helper to get priority colors
const getPriorityPill = (priority) => {
    switch (priority) {
        case 'High':
            return <span className="text-xs font-medium text-red-800 bg-red-100 px-2 py-1 rounded-full">{priority}</span>;
        case 'Medium':
            return <span className="text-xs font-medium text-yellow-800 bg-yellow-100 px-2 py-1 rounded-full">{priority}</span>;
        case 'Low':
            return <span className="text-xs font-medium text-green-800 bg-green-100 px-2 py-1 rounded-full">{priority}</span>;
        default:
            return <span className="text-xs font-medium text-slate-800 bg-slate-100 px-2 py-1 rounded-full">{priority}</span>;
    }
};


export default function Page() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formPriority, setFormPriority] = useState("Medium");
  const [formDueDate, setFormDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!user) return;
    const tasksCol = collection(db, 'users', user.uid, 'tasks');
    const q = query(tasksCol, orderBy('dueDate', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const next = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setTasks(next);
    });
    return () => unsubscribe();
  }, [user]);

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    if (!user || !taskId) return;
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      const nextStatus = currentStatus === 'Done' ? 'Pending' : 'Done';
      await updateDoc(taskRef, { status: nextStatus, updatedAt: new Date().toISOString() });
    } catch (err) {
      console.error('Failed to toggle task status', err);
    }
  };

  const handleCreateTask = async (e) => {
    e?.preventDefault?.();
    if (!user) return;
    try {
      setSubmitting(true);
      setSubmitError("");
      const tasksCol = collection(db, 'users', user.uid, 'tasks');
      const trimmedName = formName.trim();
      if (!trimmedName) {
        throw new Error('Task name is required');
      }
      if (!formDueDate) {
        throw new Error('Due date is required');
      }
      const withTimeout = (promise, ms = 15000) =>
        Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms))
        ]);
      await withTimeout(addDoc(tasksCol, {
        name: trimmedName,
        status: 'Pending',
        priority: formPriority,
        dueDate: formDueDate,
        createdAt: new Date().toISOString()
      }));
      setFormName("");
      setFormPriority("Medium");
      setFormDueDate("");
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to create task', err);
      setSubmitError(err?.message || 'Failed to save task');
    } finally {
      setSubmitting(false);
    }
  };

  const getRelativeTime = (iso) => {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    if (isNaN(then)) return '';
    const now = Date.now();
    const diff = Math.max(0, Math.floor((now - then) / 1000));
    if (diff < 60) return `${diff}s ago`;
    const m = Math.floor(diff / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const recentActivities = (() => {
    const events = [];
    for (const t of tasks) {
      if (t.createdAt) {
        events.push({
          id: `${t.id}-created`,
          type: 'created',
          title: t.name,
          at: t.createdAt,
          by: 'You'
        });
      }
      if (t.status === 'Done' && t.updatedAt) {
        events.push({
          id: `${t.id}-completed`,
          type: 'completed',
          title: t.name,
          at: t.updatedAt,
          by: 'You'
        });
      }
    }
    return events.sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6);
  })();

  const today = new Date();
  const isSameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  const parseDate = (value) => {
    // value expected as YYYY-MM-DD; fallback to Date parsing
    if (!value) return null;
    const dt = new Date(value);
    return isNaN(dt.getTime()) ? null : dt;
  };

  const formatDateLong = (date) => {
    if (!date) return '-';
    try {
      return new Intl.DateTimeFormat('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date);
    } catch {
      return date.toLocaleDateString();
    }
  };

  const tasksDueToday = tasks.filter(t => {
    const d = parseDate(t.dueDate);
    return d && isSameDay(d, today);
  }).length;

  const overdueTasks = tasks.filter(t => {
    const d = parseDate(t.dueDate);
    return d && d < new Date(today.getFullYear(), today.getMonth(), today.getDate()) && t.status !== 'Done';
  }).length;

  const completedTasks = tasks.filter(t => t.status === 'Done').length;

  const dueTasksCount = tasks.filter(t => {
    const d = parseDate(t.dueDate);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d && d >= startOfToday && t.status !== 'Done';
  }).length;

  const totalTasks = tasks.length;

  const upcomingTasks = tasks
    .map(t => ({ ...t, _due: parseDate(t.dueDate) }))
    .filter(t => t._due)
    .sort((a, b) => a._due - b._due)
    .slice(0, 5);

  const last7DaysChart = useMemo(() => {
    const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(startOfDay(d));
    }
    const labels = days.map(d => d.toLocaleDateString(undefined, { weekday: 'short' }));
    const createdCounts = new Array(7).fill(0);
    const completedCounts = new Array(7).fill(0);

    const toDayIndex = (iso) => {
      if (!iso) return -1;
      const when = startOfDay(new Date(iso));
      if (isNaN(when.getTime())) return -1;
      for (let i = 0; i < days.length; i++) {
        if (when.getTime() === days[i].getTime()) return i;
      }
      return -1;
    };

    for (const t of tasks) {
      const ci = toDayIndex(t.createdAt);
      if (ci !== -1) createdCounts[ci] += 1;
      if (t.status === 'Done') {
        const di = toDayIndex(t.updatedAt);
        if (di !== -1) completedCounts[di] += 1;
      }
    }

    return {
      labels,
      datasets: [
        {
          label: 'Created',
          data: createdCounts,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          fill: true,
          tension: 0.35,
          pointRadius: 3
        },
        {
          label: 'Completed',
          data: completedCounts,
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: true,
          tension: 0.35,
          pointRadius: 3
        }
      ]
    };
  }, [tasks]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: true, position: 'top' },
      tooltip: { enabled: true }
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  }), []);

  if (loading || !user) return null;

  return (
    <div>
      <div className="min-h-screen w-full bg-slate-100">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area */}
                    <main className="flex-1 space-y-8">
                        {/* Header */}
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                                <p className="text-slate-500 mt-1">Welcome back, here&apos;s a snapshot of your work.</p>
                            </div>
                            <button onClick={() => setIsModalOpen(true)} className="hidden lg:flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                                <PlusCircle className="w-5 h-5" />
                                <span>New Task</span>
                            </button>
                        </div>

                        {/* Mobile Floating Action Button */}
                        <button
                          type="button"
                          aria-label="Create new task"
                          onClick={() => setIsModalOpen(true)}
                          className="sm:hidden fixed bottom-6 right-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <PlusCircle className="w-6 h-6" />
                        </button>

                        {isModalOpen && (
                          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-slate-800">Create Task</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-slate-700 cursor-pointer">✕</button>
                              </div>
                              <form onSubmit={handleCreateTask} className="space-y-4">
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Task Name</label>
                                  <input value={formName} onChange={(e) => setFormName(e.target.value)} required type="text" placeholder="Enter task name" className="w-full border text-black border-slate-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                                  <select value={formPriority} onChange={(e) => setFormPriority(e.target.value)} className="w-full border text-black border-slate-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500">
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                                  <input value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} required type="date" className="w-full border text-black border-slate-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500" />
                                </div>
                                {submitError && (
                                  <p className="text-sm text-red-600">{submitError}</p>
                                )}
                                <div className="flex justify-end gap-2 pt-2">
                                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer">Cancel</button>
                                  <button disabled={submitting} type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 cursor-pointer">{submitting ? 'Saving...' : 'Save Task'}</button>
                                </div>
                              </form>
                            </div>
                          </div>
                        )}

                        {/* Stat Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <ListTodo className="w-8 h-8 text-blue-500" />
                                <p className="text-3xl font-bold mt-4 text-blue-500">{tasksDueToday}</p>
                                <p className="text-slate-500">Tasks Due Today</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                                <p className="text-3xl font-bold mt-4 text-yellow-300">{overdueTasks}</p>
                                <p className="text-slate-500">Overdue Tasks</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                                <p className="text-3xl font-bold mt-4 text-red-500">{dueTasksCount}</p>
                                <p className="text-slate-500">Due Task</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <ListTodo className="w-8 h-8 text-blue-500" />
                                <p className="text-3xl font-bold mt-4 text-blue-500">{totalTasks}</p>
                                <p className="text-slate-500">Total Task</p>
                            </div>
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                                <p className="text-3xl font-bold mt-4 text-green-500">{completedTasks}</p>
                                <p className="text-slate-500">Tasks Completed</p>
                            </div>
                            
                        </div>

                        {/* Upcoming Tasks List */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-bold text-slate-800 mb-4">Upcoming Tasks</h2>
                            <div className="space-y-4">
                                {upcomingTasks.map((task) => {
                                    const isDone = task.status === 'Done';
                                    return (
                                      <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors">
                                          <div className="flex items-center gap-4">
                                              <button
                                                type="button"
                                                role="switch"
                                                aria-checked={isDone}
                                                onClick={() => handleToggleTaskStatus(task.id, task.status)}
                                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDone ? 'bg-green-500 focus:ring-green-500' : 'bg-slate-300 focus:ring-blue-500'}`}
                                              >
                                                <span
                                                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${isDone ? 'translate-x-5' : 'translate-x-1'}`}
                                                />
                                              </button>
                                              <div>
                                                  <p className={`font-semibold ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{task.name}</p>
                                                  <p className="text-sm text-slate-500">Due: {task._due ? formatDateLong(task._due) : '-'}</p>
                                              </div>
                                          </div>
                                          {getPriorityPill(task.priority)}
                                      </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Weekly Activity Chart */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                           <h2 className="text-xl font-bold text-slate-800 mb-4">Weekly Activity</h2>
                           <div className="aspect-video">
                             <Line data={last7DaysChart} options={chartOptions} />
                           </div>
                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-8">
                        
                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                           <h2 className="text-xl font-bold text-slate-800 mb-4">Recent Activity</h2>
                           <ul className="space-y-4">
                             {recentActivities.length === 0 && (
                               <li className="text-sm text-slate-500">No recent activity yet.</li>
                             )}
                             {recentActivities.map((ev) => (
                               <li key={ev.id} className="flex items-start gap-3">
                                 <Clock className="w-5 h-5 text-slate-400 mt-1 flex-shrink-0" />
                                 <p className="text-sm text-slate-600">
                                   <span className="font-semibold">{ev.by}</span>{' '}
                                   {ev.type === 'completed' ? 'completed the task' : 'added the task'}{' '}
                                   <span className="font-medium">&ldquo;{ev.title}&rdquo;</span>.
                                   <span className="block text-slate-400">{getRelativeTime(ev.at)}</span>
                                 </p>
                               </li>
                             ))}
                           </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
            
    </div>
  )
}

 
