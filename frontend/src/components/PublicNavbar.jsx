import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Search, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PublicNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { cartCount } = useCart();

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#e5e7eb]">
      <div className="container mx-auto px-20">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold font-[Outfit] text-[#4A2C2A]">
            KRC! <span className="text-[#C97E45]">Coffee</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-[#2C1810] hover:text-[#C97E45] font-medium transition-colors">Home</Link>

            {/* Shop Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-[#2C1810] hover:text-[#C97E45] font-medium transition-colors"
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                Shop <ChevronDown size={16} className="ml-1" />
              </button>

              <div
                className={`absolute top-full left-0 w-48 bg-white shadow-xl rounded-2xl py-2 border border-slate-100 transition-all duration-200 ${shopOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
                onMouseEnter={() => setShopOpen(true)}
                onMouseLeave={() => setShopOpen(false)}
              >
                <Link to="/shop/coffee" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">Coffee</Link>
                <Link to="/shop/cold-coffee" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">Cold Coffee</Link>
                <Link to="/shop/snacks" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">Snacks</Link>
                <Link to="/shop/combos" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">Combos</Link>
                <Link to="/brew-your-own" className="block px-4 py-2 hover:bg-orange-50 text-[#C97E45] font-bold transition-colors">✨ Brew Your Own</Link>
                <Link to="/shop/gift-packs" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">Gift Packs</Link>
                <Link to="/shop/all" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] font-semibold border-t mt-1 pt-2 transition-colors">All Products</Link>
              </div>
            </div>

            <Link to="/blog" className="text-[#2C1810] hover:text-[#C97E45] font-medium transition-colors">Blog</Link>
            <Link to="/offers" className="text-[#2C1810] hover:text-[#C97E45] font-medium transition-colors">Offers</Link>

            {/* Help Dropdown */}
            <div className="relative group">
              <button
                className="flex items-center text-[#2C1810] hover:text-[#C97E45] font-medium transition-colors"
                onMouseEnter={() => setHelpOpen(true)}
                onMouseLeave={() => setHelpOpen(false)}
              >
                Help <ChevronDown size={16} className="ml-1" />
              </button>
              <div
                className={`absolute top-full left-0 w-48 bg-white shadow-xl rounded-2xl py-2 border border-slate-100 transition-all duration-200 ${helpOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}
                onMouseEnter={() => setHelpOpen(true)}
                onMouseLeave={() => setHelpOpen(false)}
              >
                <Link to="/about" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">About Us</Link>
                <Link to="/contact" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">Contact Us</Link>
                <Link to="/faqs" className="block px-4 py-2 hover:bg-orange-50 text-[#2C1810] transition-colors">FAQs</Link>
              </div>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-2 md:space-x-5">
            <button className="p-2 text-[#2C1810] hover:text-[#C97E45] hover:bg-slate-50 rounded-full transition-all">
              <Search size={22} />
            </button>

            <Link to="/cart" className="relative p-2 text-[#2C1810] hover:text-[#C97E45] hover:bg-slate-50 rounded-full transition-all">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C97E45] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in slide-in-from-top-1">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="hidden lg:flex items-center space-x-3 border-l pl-5">
              <Link to="/login" className="text-sm font-bold text-[#4A2C2A] hover:text-[#C97E45] transition-colors">Login</Link>
              <Link to="/register" className="bg-[#4A2C2A] text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-orange-900/10 hover:bg-[#2C1810] transition-all hover:translate-y-[-1px]">
                Register
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2 text-[#2C1810]" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-2xl animate-in slide-in-from-top-5 duration-300">
          <div className="px-4 py-6 space-y-4">
            <Link to="/" className="block text-lg font-bold text-[#2C1810]" onClick={() => setIsOpen(false)}>Home</Link>

            <div className="space-y-2">
              <p className="font-bold text-[#C97E45] text-xs uppercase tracking-widest">Shop Categories</p>
              <div className="grid grid-cols-2 gap-2">
                <Link to="/shop/coffee" className="p-3 bg-slate-50 rounded-xl text-[#2C1810] text-sm font-medium" onClick={() => setIsOpen(false)}>Coffee</Link>
                <Link to="/shop/cold-coffee" className="p-3 bg-slate-50 rounded-xl text-[#2C1810] text-sm font-medium" onClick={() => setIsOpen(false)}>Cold Coffee</Link>
                <Link to="/shop/snacks" className="p-3 bg-slate-50 rounded-xl text-[#2C1810] text-sm font-medium" onClick={() => setIsOpen(false)}>Snacks</Link>
                <Link to="/shop/all" className="p-3 bg-orange-50 rounded-xl text-[#C97E45] text-sm font-bold" onClick={() => setIsOpen(false)}>All Products</Link>
              </div>
            </div>

            <div className="pt-4 border-t flex flex-col space-y-3">
              <Link to="/login" className="w-full py-3 text-center font-bold text-[#4A2C2A] border-2 border-[#4A2C2A] rounded-xl" onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/register" className="w-full py-3 text-center font-bold text-white bg-[#4A2C2A] rounded-xl" onClick={() => setIsOpen(false)}>Register</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default PublicNavbar;
