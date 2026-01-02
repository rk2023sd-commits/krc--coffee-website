import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, Trash2, ShoppingCart, CheckCircle2, ChevronDown, X, Loader2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Payments = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingCard, setEditingCard] = useState(null); // For handling edits

    const [newCard, setNewCard] = useState({
        cardType: 'Visa',
        cardNumber: '',
        expiry: '',
        cvv: '',
        cardHolder: '',
        isPrimary: false
    });

    const [editForm, setEditForm] = useState({
        expiry: '',
        isPrimary: false
    });

    const fetchPaymentMethods = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/users/payment-methods`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCards(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentMethods();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this card?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/users/payment-methods/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setCards(data.data);
                toast.success('Card removed successfully');
            }
        } catch (error) {
            toast.error('Failed to remove card');
        }
    };

    const handleAddCard = async (e) => {
        e.preventDefault();

        if (newCard.cardNumber.replace(/\s/g, '').length !== 16) {
            toast.error('Please enter a valid 16-digit card number');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const payload = {
                ...newCard,
                last4: newCard.cardNumber.slice(-4) // Extract last 4 for secure storage
            };

            const res = await fetch(`${API_URL}/api/users/payment-methods`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (data.success) {
                setCards(data.data);
                setIsAdding(false);
                setNewCard({ cardType: 'Visa', cardNumber: '', expiry: '', cvv: '', cardHolder: '', isPrimary: false });
                toast.success('Card added successfully');
            } else {
                toast.error(data.message || 'Failed to add card');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const handleEditCard = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/users/payment-methods/${editingCard._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            const data = await res.json();
            if (data.success) {
                setCards(data.data);
                setEditingCard(null);
                toast.success('Card updated successfully');
            } else {
                toast.error(data.message || 'Failed to update card');
            }
        } catch (error) {
            toast.error('Something went wrong');
        }
    };

    const openEditModal = (card) => {
        setEditingCard(card);
        setEditForm({
            expiry: card.expiry,
            isPrimary: card.isPrimary
        });
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#4A2C2A] mb-2">Payment Methods</h1>
                    <p className="text-slate-500 text-sm">Manage your saved cards and payment settings.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="px-6 py-3 bg-[#4A2C2A] text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-[#3d2422] transition-colors"
                >
                    <Plus size={20} /> Add New Card
                </button>
            </div>

            {/* Add Card Modal */}
            {isAdding && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-[#4A2C2A]">Add New Card</h3>
                            <button onClick={() => setIsAdding(false)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAddCard} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Card Holder Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4A2C2A]"
                                    value={newCard.cardHolder}
                                    onChange={(e) => setNewCard({ ...newCard, cardHolder: e.target.value })}
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Card Number</label>
                                <div className="relative">
                                    <CreditCard className="absolute left-4 top-3 text-slate-400" size={20} />
                                    <input
                                        required
                                        type="text"
                                        maxLength={19}
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4A2C2A] font-mono tracking-widest text-[#4A2C2A] font-bold"
                                        value={newCard.cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ')}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                                            setNewCard({ ...newCard, cardNumber: val });
                                        }}
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Card Type</label>
                                    <select
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4A2C2A]"
                                        value={newCard.cardType}
                                        onChange={(e) => setNewCard({ ...newCard, cardType: e.target.value })}
                                    >
                                        <option value="Visa">Visa</option>
                                        <option value="Mastercard">Master</option>
                                        <option value="Amex">Amex</option>
                                    </select>
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Expiry</label>
                                    <input
                                        required
                                        type="text"
                                        maxLength={5}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4A2C2A] text-center"
                                        value={newCard.expiry}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/\D/g, '');
                                            if (val.length >= 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                                            setNewCard({ ...newCard, expiry: val });
                                        }}
                                        placeholder="MM/YY"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">CVV</label>
                                    <input
                                        required
                                        type="password"
                                        maxLength={3}
                                        className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4A2C2A] text-center tracking-widest"
                                        value={newCard.cvv}
                                        onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.replace(/\D/g, '') })}
                                        placeholder="***"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="isPrimary"
                                    checked={newCard.isPrimary}
                                    onChange={(e) => setNewCard({ ...newCard, isPrimary: e.target.checked })}
                                    className="w-4 h-4 accent-[#4A2C2A]"
                                />
                                <label htmlFor="isPrimary" className="text-sm font-bold text-slate-600">Set as Primary Card</label>
                            </div>
                            <button type="submit" className="w-full bg-[#4A2C2A] text-white py-4 rounded-xl font-bold hover:bg-[#3d2422] transition-colors mt-4">
                                Save Card
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Card Modal */}
            {editingCard && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-[#4A2C2A]">Edit Card</h3>
                            <button onClick={() => setEditingCard(null)} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200"><X size={20} /></button>
                        </div>
                        <div className="mb-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <p className="text-xs text-orange-800 font-bold mb-1">Editing Card</p>
                            <p className="text-sm text-[#4A2C2A] font-medium">{editingCard.cardType} ending in {editingCard.last4}</p>
                        </div>
                        <form onSubmit={handleEditCard} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Expiry (MM/YY)</label>
                                <input
                                    required
                                    type="text"
                                    maxLength={5}
                                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#4A2C2A]"
                                    value={editForm.expiry}
                                    onChange={(e) => setEditForm({ ...editForm, expiry: e.target.value })}
                                    placeholder="12/25"
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="editIsPrimary"
                                    checked={editForm.isPrimary}
                                    onChange={(e) => setEditForm({ ...editForm, isPrimary: e.target.checked })}
                                    className="w-4 h-4 accent-[#4A2C2A]"
                                />
                                <label htmlFor="editIsPrimary" className="text-sm font-bold text-slate-600">Set as Primary Card</label>
                            </div>
                            <button type="submit" className="w-full bg-[#4A2C2A] text-white py-4 rounded-xl font-bold hover:bg-[#3d2422] transition-colors mt-4">
                                Update Card
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-[#4A2C2A]" size={40} /></div>
            ) : cards.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-[2rem] border border-dashed border-slate-200 mb-12">
                    <CreditCard size={48} className="mx-auto text-slate-300 mb-4" />
                    <h3 className="text-xl font-bold text-slate-600">No saved cards</h3>
                    <p className="text-slate-400">Add a card to speed up your checkout.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {cards.map((card) => (
                        <div key={card._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 relative group overflow-hidden transition-all hover:shadow-md">
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className={`p-3 rounded-xl ${card.cardType === 'Visa' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
                                    <CreditCard size={24} />
                                </div>
                                {card.isPrimary && (
                                    <span className="text-[10px] font-bold bg-green-50 text-green-600 px-3 py-1 rounded-full uppercase tracking-wider">Primary</span>
                                )}
                            </div>

                            <div className="mb-6 relative z-10">
                                <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest">Card Number</p>
                                <p className="text-xl font-bold text-[#4A2C2A] tracking-[0.2em] font-mono">•••• •••• •••• {card.last4}</p>
                            </div>

                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <p className="text-slate-400 text-xs mb-1 uppercase tracking-widest">Expiry</p>
                                    <p className="font-bold text-[#4A2C2A]">{card.expiry}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(card)}
                                        className="p-2 text-slate-400 hover:text-[#4A2C2A] hover:bg-slate-50 rounded-lg transition-all"
                                        title="Edit Card"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(card._id)}
                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete Card"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Decor */}
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-transform -z-0 opacity-50"></div>
                        </div>
                    ))}
                </div>
            )}

            <div>
                <h2 className="text-xl font-bold text-[#4A2C2A] mb-6">Recent Transactions (Simulation)</h2>
                <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
                    <div className="p-6 border-b border-slate-50 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
                                <ShoppingCart size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-[#4A2C2A]">Order #KRC7821</p>
                                <p className="text-slate-400 text-xs">24 Oct 2023 • Visa •••• 4242</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-slate-800">₹1,240.00</p>
                            <div className="flex items-center gap-1 text-green-500 justify-end">
                                <CheckCircle2 size={12} />
                                <p className="text-[10px] font-bold uppercase tracking-widest">Success</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payments;
