import React, { useState, useEffect } from 'react';
import { Bell, Trash2, CheckCircle2, ClipboardList, Ticket, User, Info, Loader2, ShoppingBag, AlertCircle } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stats, setStats] = useState({ unread: 0 });

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to see notifications.');
                setLoading(false);
                return;
            }

            const res = await fetch('http://localhost:5000/api/notifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.success) {
                setNotifications(data.data);
                setStats({
                    unread: data.data.filter(n => !n.isRead).length
                });
                setError('');
            } else {
                setError(data.message || 'Failed to fetch notifications');
            }
        } catch (err) {
            console.error("Failed to fetch notifications", err);
            setError('Could not connect to the notification service.');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
                setStats(prev => ({ unread: Math.max(0, prev.unread - 1) }));
                window.dispatchEvent(new Event('notifRefresh'));
            }
        } catch (err) {
            console.error("Error marking read", err);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/notifications/read-all', {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                setStats({ unread: 0 });
                window.dispatchEvent(new Event('notifRefresh'));
            }
        } catch (err) {
            console.error("Error marking all read", err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const wasUnread = notifications.find(n => n._id === id && !n.isRead);
                setNotifications(prev => prev.filter(n => n._id !== id));
                if (wasUnread) {
                    setStats(prev => ({ unread: Math.max(0, prev.unread - 1) }));
                    window.dispatchEvent(new Event('notifRefresh'));
                }
            }
        } catch (err) {
            console.error("Error deleting notification", err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <ShoppingBag className="text-blue-500" size={20} />;
            case 'offer': return <Ticket className="text-orange-500" size={20} />;
            case 'account': return <User className="text-emerald-500" size={20} />;
            default: return <Info className="text-slate-500" size={20} />;
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="animate-spin text-[#C97E45] mb-4" size={48} />
                <p className="text-slate-500 font-medium">Checking for updates...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {/* Header */}
            <div className="flex justify-between items-end bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-50">
                <div>
                    <h1 className="text-3xl font-bold text-[#4A2C2A] font-[Outfit]">Notifications</h1>
                    <p className="text-[#6D5E57]">Stay updated with your orders and exclusive offers.</p>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <div className="bg-orange-50 px-4 py-2 rounded-xl text-sm font-bold text-[#C97E45] border border-orange-100">
                        {stats.unread} Unread
                    </div>
                    {stats.unread > 0 && (
                        <button
                            onClick={markAllRead}
                            className="text-xs font-bold text-[#C97E45] hover:underline flex items-center gap-1"
                        >
                            <CheckCircle2 size={14} /> Mark all as read
                        </button>
                    )}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-3xl flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-2xl">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="font-bold">Oops! Something went wrong</p>
                        <p className="text-sm opacity-80">{error}</p>
                    </div>
                    <button
                        onClick={fetchNotifications}
                        className="ml-auto bg-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* List */}
            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-orange-200">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
                            <Bell size={40} />
                        </div>
                        <h2 className="text-xl font-bold text-[#4A2C2A] font-[Outfit]">All caught up!</h2>
                        <p className="text-slate-400">No new notifications at the moment.</p>
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif._id}
                            onClick={() => !notif.isRead && markAsRead(notif._id)}
                            className={`group bg-white p-6 rounded-3xl shadow-sm border transition-all duration-300 flex gap-6 items-start relative overflow-hidden ${notif.isRead ? 'border-slate-50 opacity-80' : 'border-[#C97E45]/20 shadow-md ring-1 ring-[#C97E45]/5 hover:shadow-lg hover:-translate-y-0.5'}`}
                        >
                            {/* Blue dot for unread */}
                            {!notif.isRead && (
                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#C97E45]"></div>
                            )}

                            <div className={`p-4 rounded-2xl flex-shrink-0 ${notif.isRead ? 'bg-slate-50' : 'bg-orange-50'}`}>
                                {getIcon(notif.type)}
                            </div>

                            <div className="flex-grow space-y-1">
                                <div className="flex justify-between items-start">
                                    <h3 className={`font-bold font-[Outfit] ${notif.isRead ? 'text-[#6D5E57]' : 'text-[#4A2C2A] text-lg'}`}>
                                        {notif.title}
                                    </h3>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">
                                        {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </span>
                                </div>
                                <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-slate-400' : 'text-[#6D5E57]'}`}>
                                    {notif.message}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Notifications;
