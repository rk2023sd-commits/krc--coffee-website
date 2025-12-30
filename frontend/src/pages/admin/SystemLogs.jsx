import React, { useState, useEffect } from 'react';
import { RefreshCw, FileText, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

const SystemLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/settings/logs/system', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setLogs(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch system logs');
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'error': return <AlertCircle className="text-red-500" size={20} />;
            case 'warning': return <AlertTriangle className="text-yellow-500" size={20} />;
            default: return <Info className="text-blue-500" size={20} />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">System Logs</h1>
                    <p className="text-[#6D5E57]">View system events and errors.</p>
                </div>
                <button onClick={fetchLogs} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-20">Loading...</div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-6">Type</th>
                                    <th className="p-6">Message</th>
                                    <th className="p-6">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center space-x-2 uppercase text-xs font-bold">
                                                {getIcon(log.type)}
                                                <span className={`${log.type === 'error' ? 'text-red-500' : log.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`}>
                                                    {log.type}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-slate-700 font-mono text-sm">{log.message}</td>
                                        <td className="p-6 text-slate-500 text-sm">
                                            {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm:ss')}
                                        </td>
                                    </tr>
                                ))}
                                {logs.length === 0 && (
                                    <tr><td colSpan="3" className="p-8 text-center text-slate-500">No logs found</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemLogs;
