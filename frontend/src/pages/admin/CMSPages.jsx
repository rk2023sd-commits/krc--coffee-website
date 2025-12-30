import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, LayoutTemplate, HelpCircle, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';

const CMSPages = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [loading, setLoading] = useState(true);

    // General Settings State
    const [settings, setSettings] = useState({
        aboutUs: '',
        contactEmail: '',
        contactPhone: '',
        contactAddress: '',
        terms: ''
    });
    const [saving, setSaving] = useState(false);

    // FAQs State
    const [faqs, setFaqs] = useState([]);
    const [loadingFaqs, setLoadingFaqs] = useState(false);
    const [editingFaq, setEditingFaq] = useState(null);
    const [isAddingFaq, setIsAddingFaq] = useState(false);
    const [faqForm, setFaqForm] = useState({ question: '', answer: '', category: 'General', order: 0 });

    useEffect(() => {
        if (activeTab === 'general') fetchSettings();
        if (activeTab === 'faqs') fetchFaqs();
    }, [activeTab]);

    // --- General Settings Functions ---
    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/settings/cms', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success && data.data) {
                setSettings({ ...settings, ...data.data });
            }
        } catch (err) {
            toast.error('Failed to fetch CMS settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const res = await fetch('http://localhost:5000/api/settings/cms', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success('CMS Settings Saved');
            }
        } catch (err) {
            toast.error('Failed to save');
        } finally {
            setSaving(false);
        }
    };

    // --- FAQ Functions ---
    const fetchFaqs = async () => {
        setLoadingFaqs(true);
        try {
            const res = await fetch('http://localhost:5000/api/cms/admin/faqs', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            const data = await res.json();
            if (data.success) {
                setFaqs(data.data);
            }
        } catch (err) {
            toast.error('Failed to fetch FAQs');
        } finally {
            setLoadingFaqs(false);
        }
    };

    const handleSaveFaq = async (e) => {
        e.preventDefault();
        try {
            const url = editingFaq
                ? `http://localhost:5000/api/cms/admin/faqs/${editingFaq._id}`
                : 'http://localhost:5000/api/cms/admin/faqs';

            const method = editingFaq ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(faqForm)
            });
            const data = await res.json();
            if (data.success) {
                toast.success(editingFaq ? 'FAQ Updated' : 'FAQ Created');
                fetchFaqs();
                closeFaqForm();
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error('Failed to save FAQ');
        }
    };

    const handleDeleteFaq = async (id) => {
        if (!confirm('Delete this FAQ?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/cms/admin/faqs/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (res.ok) {
                toast.success('FAQ Deleted');
                setFaqs(faqs.filter(f => f._id !== id));
            }
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const openFaqForm = (faq = null) => {
        if (faq) {
            setEditingFaq(faq);
            setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category, order: faq.order });
        } else {
            setEditingFaq(null);
            setFaqForm({ question: '', answer: '', category: 'General', order: 0 });
        }
        setIsAddingFaq(true);
    };

    const closeFaqForm = () => {
        setIsAddingFaq(false);
        setEditingFaq(null);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C1810] font-[Outfit]">CMS Management</h1>
                    <p className="text-[#6D5E57]">Manage website content and FAQs.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 border-b border-slate-200">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'general' ? 'text-[#C97E45]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    General Content
                    {activeTab === 'general' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C97E45] rounded-t-full"></div>}
                </button>
                <button
                    onClick={() => setActiveTab('faqs')}
                    className={`pb-4 px-2 font-bold transition-colors relative ${activeTab === 'faqs' ? 'text-[#C97E45]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                    FAQs
                    {activeTab === 'faqs' && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#C97E45] rounded-t-full"></div>}
                </button>
            </div>

            {/* General Tab Content */}
            {activeTab === 'general' && (
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
                    {loading ? <div className="text-center py-10">Loading...</div> : (
                        <>
                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-2">About Us Content (HTML supported)</label>
                                <textarea
                                    rows={8}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none font-mono text-sm"
                                    value={settings.aboutUs || ''}
                                    onChange={(e) => setSettings({ ...settings, aboutUs: e.target.value })}
                                    placeholder="<p>Enter the story of KRC Coffee...</p>"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Contact Email</label>
                                    <input
                                        type="email"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                        value={settings.contactEmail || ''}
                                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                                        placeholder="support@krccoffee.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Contact Phone</label>
                                    <input
                                        type="text"
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                        value={settings.contactPhone || ''}
                                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Contact Address</label>
                                    <textarea
                                        rows={3}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                        value={settings.contactAddress || ''}
                                        onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                                        placeholder="123 Coffee Estate Road..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Terms & Conditions</label>
                                <textarea
                                    rows={4}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                    value={settings.terms || ''}
                                    onChange={(e) => setSettings({ ...settings, terms: e.target.value })}
                                    placeholder="Usage terms..."
                                />
                            </div>

                            <div className="pt-4 border-t border-slate-100 flex justify-end">
                                <button
                                    onClick={handleSaveSettings}
                                    disabled={saving}
                                    className="px-8 py-3 bg-[#4A2C2A] text-white rounded-xl font-bold flex items-center space-x-2 hover:bg-[#2C1810] transition-colors shadow-lg shadow-[#4A2C2A]/20"
                                >
                                    <Save size={20} />
                                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* FAQs Tab Content */}
            {activeTab === 'faqs' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100">
                        <h3 className="font-bold text-lg text-[#2C1810]">All FAQs ({faqs.length})</h3>
                        <button
                            onClick={() => openFaqForm()}
                            className="px-6 py-3 bg-[#C97E45] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#b06a36] transition-colors"
                        >
                            <Plus size={20} /> Add New FAQ
                        </button>
                    </div>

                    {isAddingFaq && (
                        <div className="bg-white p-8 rounded-[2rem] shadow-lg border border-orange-100 animate-in fade-in slide-in-from-top-4">
                            <h3 className="font-bold text-lg text-[#2C1810] mb-6">{editingFaq ? 'Edit FAQ' : 'Create New FAQ'}</h3>
                            <form onSubmit={handleSaveFaq} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Question</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                        value={faqForm.question}
                                        onChange={e => setFaqForm({ ...faqForm, question: e.target.value })}
                                        placeholder="How do I track my order?"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-[#4A2C2A] mb-2">Answer</label>
                                    <textarea
                                        required
                                        rows={4}
                                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C97E45]/20 outline-none"
                                        value={faqForm.answer}
                                        onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })}
                                        placeholder="You can track your order by..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeFaqForm}
                                        className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-8 py-3 bg-[#4A2C2A] text-white rounded-xl font-bold hover:bg-[#2C1810]"
                                    >
                                        Save FAQ
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {loadingFaqs ? <div className="text-center py-10">Loading FAQs...</div> : (
                        <div className="grid gap-4">
                            {faqs.map(faq => (
                                <div key={faq._id} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 flex justify-between items-start hover:shadow-md transition-shadow">
                                    <div className="flex gap-4">
                                        <div className="mt-1 w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-[#C97E45] font-bold shrink-0">?</div>
                                        <div>
                                            <h4 className="font-bold text-[#2C1810] mb-1">{faq.question}</h4>
                                            <p className="text-sm text-slate-500 line-clamp-2">{faq.answer}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openFaqForm(faq)}
                                            className="p-2 text-slate-400 hover:text-[#C97E45] hover:bg-orange-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteFaq(faq._id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {faqs.length === 0 && !isAddingFaq && (
                                <div className="text-center py-12 text-slate-400">No FAQs found. Add one to get started.</div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CMSPages;
