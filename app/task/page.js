"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../hooks/useAuth';
import { PlusCircle, Search, FilePenLine, Trash2 } from 'lucide-react';
import { db } from '../firebase/config';
import { collection, addDoc, onSnapshot, query, orderBy, doc, deleteDoc } from 'firebase/firestore';

// Firestore-backed tasks will be loaded per-user; no local mock.

// Helper to get styled pills for Priority
const getPriorityPill = (priority) => {
    switch (priority) {
        case 'High': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">{priority}</span>;
        case 'Medium': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded-full">{priority}</span>;
        case 'Low': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">{priority}</span>;
    }
};

// Helper to get styled pills for the new Statuses
const getStatusPill = (status) => {
    switch (status) {
        case 'Done': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">{status}</span>;
        case 'Pending': return <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">{status}</span>;
    }
};
const page = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [formName, setFormName] = useState("");
  const [formPriority, setFormPriority] = useState("Medium");
  const [formDueDate, setFormDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSubmitting(true);
      setSubmitError("");
      const tasksCol = collection(db, 'users', user.uid, 'tasks');
      // Guard minimal validation
      const trimmedName = formName.trim();
      if (!trimmedName) {
        throw new Error('Task name is required');
      }
      if (!formDueDate) {
        throw new Error('Due date is required');
      }

      // Timeout safeguard so UI doesn't get stuck forever
      const withTimeout = (promise, ms = 15000) =>
        Promise.race([
          promise,
          new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms))
        ]);

      await withTimeout(addDoc(tasksCol, {
        name: formName.trim(),
        status: 'Pending',
        priority: formPriority,
        dueDate: formDueDate, // stored as YYYY-MM-DD
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

  const handleDeleteTask = async (taskId) => {
    if (!user || !taskId) return;
    try {
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskId);
      await deleteDoc(taskRef);
    } catch (err) {
      console.error('Failed to delete task', err);
    }
  };

  if (loading || !user) return null;

  const normalized = (v = "") => String(v).toLowerCase();
  const q = normalized(searchTerm);
  const filteredTasks = q
    ? tasks.filter((t) => {
        const name = normalized(t.name);
        const status = normalized(t.status);
        const priority = normalized(t.priority);
        return name.includes(q) || status.includes(q) || priority.includes(q);
      })
    : tasks;

  return (
    <div>
      <div className="min-h-screen w-full bg-slate-50">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">
                {/* Page Header */}
                <header className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">My Tasks</h1>
                        <p className="text-slate-500 mt-1">View, manage, and track all of your tasks.</p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-auto">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                           <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder="Search tasks..." className="pl-10 pr-4 py-2 w-full sm:w-64 border text-black border-slate-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                        <button onClick={() => setIsModalOpen(true)} className="flex-shrink-0 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors cursor-pointer">
                           <PlusCircle className="w-5 h-5" />
                           <span>New Task</span>
                        </button>
                    </div>
                </header>

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
                          <input value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} required type="date" className="w-full border border-slate-300 rounded-lg px-3 text-black py-2 focus:ring-blue-500 focus:border-blue-500" />
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

                {/* --- Desktop Table View (hidden on mobile) --- */}
                <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Task Name</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Priority</th>
                                    <th scope="col" className="px-6 py-3">Due Date</th>
                                    <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTasks.map((task) => (
                                    <tr key={task.id} className="bg-white border-b hover:bg-slate-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{task.name}</th>
                                        <td className="px-6 py-4">{getStatusPill(task.status)}</td>
                                        <td className="px-6 py-4">{getPriorityPill(task.priority)}</td>
                                        <td className="px-6 py-4">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-4">
                                                <button className="font-medium text-blue-600 hover:text-blue-800"><FilePenLine className="w-5 h-5" /></button>
                                                <button onClick={() => handleDeleteTask(task.id)} className="font-medium text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* --- Mobile Card View (hidden on desktop) --- */}
                <div className="block md:hidden space-y-4">
                    {filteredTasks.map((task) => (
                        <div key={task.id} className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-start">
                                <span className="font-medium text-slate-900">{task.name}</span>
                                {getPriorityPill(task.priority)}
                            </div>
                            <div className="mt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Status</span>
                                    {getStatusPill(task.status)}
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Due Date</span>
                                    <span className="font-medium text-slate-800">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}</span>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-end gap-4">
                                <button className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1.5">
                                    <FilePenLine className="w-5 h-5" /> Edit
                                </button>
                                <button onClick={() => handleDeleteTask(task.id)} className="font-medium text-red-600 hover:text-red-800 flex items-center gap-1.5">
                                    <Trash2 className="w-5 h-5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  )
}

export default page
