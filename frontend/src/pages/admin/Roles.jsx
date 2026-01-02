import React, { useState, useEffect } from 'react';
import API_URL from '../../config';
import { Users, Shield, RefreshCw, Search, CheckCircle } from 'lucide-react';

const Roles = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await res.json();
            if (data.success) {
                setUsers(data.data);
            }
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        setUpdatingId(userId);
        try {
            const res = await fetch(`${API_URL}/api/users/${userId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ role: newRole })
            });

            if (res.ok) {
                setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
            } else {
                alert('Failed to update role');
            }
        } catch (err) {
            alert('Connection error');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">Roles & Permissions</h1>
                    <p className="text-[#6D5E57]">Manage user roles and access levels.</p>
                </div>
                <button onClick={fetchUsers} className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <RefreshCw size={20} className="text-slate-600" />
                </button>
            </div>

            <div className="mb-6 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 focus:border-[#C97E45] outline-none transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-10 h-10 border-4 border-[#C97E45] border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-slate-500">Loading users...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FFF8E7] text-[#4A2C2A] font-bold text-sm uppercase tracking-wider">
                                <tr>
                                    <th className="p-6">User</th>
                                    <th className="p-6">Current Role</th>
                                    <th className="p-6">Change Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${user.role === 'admin' ? 'bg-[#C97E45]' : 'bg-slate-400'}`}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#2C1810]">{user.name}</div>
                                                    <div className="text-xs text-slate-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase inline-block ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center space-x-2">
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, 'admin')}
                                                        disabled={updatingId === user._id}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-[#C97E45] hover:text-white text-slate-600 rounded-md text-sm font-medium transition-colors border border-slate-200"
                                                    >
                                                        Make Admin
                                                    </button>
                                                )}
                                                {user.role !== 'customer' && (
                                                    <button
                                                        onClick={() => handleRoleChange(user._id, 'customer')}
                                                        disabled={updatingId === user._id}
                                                        className="px-3 py-1.5 bg-slate-100 hover:bg-green-500 hover:text-white text-slate-600 rounded-md text-sm font-medium transition-colors border border-slate-200"
                                                    >
                                                        Make Customer
                                                    </button>
                                                )}
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

export default Roles;
