import React, { useState, useEffect } from 'react';
import { Shield, Mail, Phone, Calendar, RefreshCw, Search } from 'lucide-react';
import { format } from 'date-fns';

const Staff = () => {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/users/staff', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setStaff(data.data);
            } else {
                setError(data.message || 'Failed to fetch staff');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const filteredStaff = staff.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Staff Management</h1>
                    <p className="text-[#6D5E57]">View and manage admin and staff members.</p>
                </div>
                <button onClick={fetchStaff} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search staff by name or email..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-[#C97E45] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading staff...</p>
                </div>
            ) : filteredStaff.length === 0 ? (
                <div className="bg-white p-16 rounded-[2rem] text-center border border-dashed border-slate-200">
                    <Shield className="mx-auto text-slate-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-700">No staff members found</h3>
                    <p className="text-slate-500 mt-2">Admin and staff accounts will appear here.</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-6">Staff Member</th>
                                    <th className="p-6">Role</th>
                                    <th className="p-6">Contact Info</th>
                                    <th className="p-6">Joined Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredStaff.map((member) => (
                                    <tr key={member._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-full bg-[#C97E45] flex items-center justify-center text-white font-bold shadow-md">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#2C1810]">{member.name}</div>
                                                    <div className="text-xs text-slate-500">ID: {member._id.slice(-6)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase inline-block">
                                                {member.role}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col space-y-1">
                                                <div className="flex items-center text-sm text-slate-600">
                                                    <Mail size={14} className="mr-2 text-slate-400" />
                                                    {member.email}
                                                </div>
                                                <div className="flex items-center text-sm text-slate-600">
                                                    <Phone size={14} className="mr-2 text-slate-400" />
                                                    {member.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-sm text-slate-600">
                                            <div className="flex items-center">
                                                <Calendar size={14} className="mr-2 text-slate-400" />
                                                {format(new Date(member.createdAt), 'MMM dd, yyyy')}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
