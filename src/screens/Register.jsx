import { useState } from 'react';
import { PRODUCTS, CATEGORIES, TAX_RATE, FARM_CREDIT } from '../data/products';

function ProductTile({ product, qty, onAdd }) {
  return (
    <button
      onClick={onAdd}
      className="bg-white border border-[#D9D9D9] rounded-[14px] p-3 flex flex-col gap-2 cursor-pointer active:scale-95 transition-transform text-left relative"
      style={{ width: 178, height: 170, flexShrink: 0 }}
    >
      {/* Image / Icon area */}
      <div className="w-full rounded-[10px] overflow-hidden flex-shrink-0" style={{ height: 76 }}>
        {product.img ? (
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: product.bg }}>
            {product.emoji && (
              <span style={{ fontSize: 32, color: product.textColor }}>{product.emoji}</span>
            )}
            {product.label && (
              <span className="text-[17px] font-bold text-center whitespace-pre-wrap" style={{ color: product.textColor }}>
                {product.label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Name + price */}
      <div className="flex flex-col gap-1 w-full">
        <p className="text-[#231F20] text-[16px] font-bold leading-[18px] line-clamp-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {product.name}
        </p>
        <p className="text-[#606060] text-[14px] leading-[16px]"
          style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ${product.price % 1 === 0 ? product.price : product.price.toFixed(2)} / {product.unit}
        </p>
      </div>

      {/* Qty badge */}
      {qty > 0 && (
        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
          style={{ background: '#6DBE4B', fontFamily: 'Montserrat, sans-serif' }}>
          {qty}
        </div>
      )}
    </button>
  );
}

function CartPanel({ cart, onRemoveItem, onCheckout }) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="absolute left-0 bottom-0 bg-white flex flex-col items-center justify-between p-3"
      style={{ width: 278, height: 720, top: 24, boxShadow: '4px 0 10px rgba(0,0,0,0.05)' }}>

      {/* Customer header */}
      <div className="flex gap-3 items-center pb-2 rounded-[6px] w-full">
        <div className="relative w-10 h-10 flex-shrink-0">
          <div className="w-full h-full rounded-full flex items-center justify-center"
            style={{ background: '#D3EBC9', border: '2px solid #6DBE4B' }}>
            <span className="text-[14px] font-semibold text-[#2D5E3F]" style={{ fontFamily: 'Montserrat, sans-serif' }}>SY</span>
          </div>
        </div>
        <div>
          <p className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Walk-in</p>
          <p className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Empty state / cart items */}
      {cart.length === 0 ? (
        <p className="text-[#ABABAB] text-[14px] text-center w-[136px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Add an item{'\n'}to open an order
        </p>
      ) : (
        <div className="flex-1 w-full overflow-y-auto py-2 space-y-0">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-center justify-between py-2 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-[13px] font-semibold text-[#231F20]"
                  style={{ background: '#F0F0F0', fontFamily: 'Montserrat, sans-serif' }}>
                  {item.qty}
                </div>
                <div>
                  <p className="text-[#231F20] text-[13px] font-bold leading-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.product.name}</p>
                  <p className="text-[#606060] text-[12px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    ${(item.product.price * item.qty).toFixed(2)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.product.id)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#606060] hover:bg-[#F0F0F0] transition-colors text-[16px]"
              >
                −
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Summary + checkout */}
      <div className="flex flex-col gap-4 items-center w-full pt-2">
        <div className="opacity-100 w-full">
          <div className="rounded-[10px] p-3 flex flex-col gap-3" style={{ background: '#F8F8F8' }}>
            <div className="flex justify-between">
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Subtotal</span>
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Tax (10%)</span>
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="rounded-[10px] px-3 py-4 flex justify-between mt-0" style={{ background: '#F8F8F8' }}>
            <span className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total</span>
            <span className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full h-[52px] rounded-[10px] text-white text-[16px] font-bold transition-opacity"
          style={{
            background: '#6DBE4B',
            fontFamily: 'Montserrat, sans-serif',
            opacity: cart.length === 0 ? 0.5 : 1,
            cursor: cart.length === 0 ? 'default' : 'pointer',
          }}
        >
          Charge ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default function Register({ cart, onAddItem, onRemoveItem, onCheckout }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getQty = (id) => cart.find(i => i.product.id === id)?.qty || 0;

  return (
    <div className="relative w-full h-full" style={{ background: '#FAFAFA' }}>
      {/* iPad status bar */}
      <div className="absolute top-0 left-0 w-full h-6 bg-[#231F20] flex items-center justify-between px-4" style={{ zIndex: 10 }}>
        <span className="text-white text-[12px]" style={{ fontFamily: 'SF Pro Text, sans-serif' }}>9:41 AM</span>
        <span className="text-white text-[12px]">● ● ●</span>
        <span className="text-white text-[12px]">100% 🔋</span>
      </div>

      {/* Cart panel */}
      <CartPanel
        cart={cart}
        onRemoveItem={onRemoveItem}
        onCheckout={onCheckout}
      />

      {/* Main content area */}
      <div className="absolute left-[278px] right-0 top-6 bottom-0 flex flex-col px-5 overflow-hidden">
        {/* Header */}
        <div className="flex flex-col gap-4 pt-3 pb-2 flex-shrink-0">
          {/* Register bar */}
          <div className="flex items-center gap-6">
            <h1 className="text-[#231F20] text-[20px] font-bold whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Register
            </h1>
            <div className="flex-1 bg-white border border-[#D9D9D9] rounded-[10px] h-[52px] flex items-center gap-3 px-4"
              style={{ boxShadow: '0 6px 6px rgba(35,31,32,0.05)' }}>
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2-4.35-4.35" stroke="#606060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search for an item..."
                className="flex-1 outline-none text-[16px] text-[#231F20] bg-transparent"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              />
            </div>
          </div>

          {/* Category nav */}
          <div className="flex gap-3 items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-2 rounded-[12px] text-[16px] font-bold transition-colors"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  background: activeCategory === cat ? '#D3EBC9' : 'transparent',
                  border: activeCategory === cat ? '2px solid #6DBE4B' : '1px solid #D9D9D9',
                  color: '#231F20',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        <div className="flex flex-wrap gap-8 overflow-y-auto pb-4 content-start"
          style={{ gap: 20, paddingBottom: 16 }}>
          {filtered.map(product => (
            <ProductTile
              key={product.id}
              product={product}
              qty={getQty(product.id)}
              onAdd={() => onAddItem(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
