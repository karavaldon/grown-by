import { useState, useRef, useEffect } from 'react';
import { PRODUCTS, CATEGORIES, TAX_RATE } from '../data/products';

let _bagCtx = null;
let _bagBuffer = null;

function getBagCtx() {
  if (!_bagCtx || _bagCtx.state === 'closed') {
    _bagCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _bagCtx;
}

async function loadBagBuffer() {
  if (_bagBuffer) return _bagBuffer;
  const ctx = getBagCtx();
  const resp = await fetch('/bagsound.mp3');
  const arrayBuf = await resp.arrayBuffer();
  _bagBuffer = await ctx.decodeAudioData(arrayBuf);
  return _bagBuffer;
}

let _beepBuffer = null;

async function loadBeepBuffer() {
  if (_beepBuffer) return _beepBuffer;
  const ctx = getBagCtx();
  const resp = await fetch('/scanningbeep.mp3');
  const arrayBuf = await resp.arrayBuffer();
  _beepBuffer = await ctx.decodeAudioData(arrayBuf);
  return _beepBuffer;
}

async function playScanBeep() {
  try {
    const ctx = getBagCtx();
    if (ctx.state === 'suspended') await ctx.resume();
    const buffer = await loadBeepBuffer();
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0);
  } catch (_) {}
}

async function playCrumpleSound() {
  try {
    const ctx = getBagCtx();
    if (ctx.state === 'suspended') await ctx.resume();
    const buffer = await loadBagBuffer();
    const sampleDur = 0.5;
    const offsets = [1.0, 1.25, 1.5];
    const offset = offsets[Math.floor(Math.random() * 3)];
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.connect(ctx.destination);
    src.start(0, offset, sampleDur);
  } catch (_) {}
}

const FARMER_PHOTO = '/farmer-photo.jpg';

function ProductNote({ product }) {
  return (
    <>
      <div
        className="absolute left-0 right-0 pointer-events-none"
        style={{
          bottom: 0,
          height: 160,
          background: 'linear-gradient(to bottom, rgba(250,250,250,0) 0%, rgba(250,250,250,1) 60%)',
          zIndex: 19,
        }}
      />
      <div
        className="absolute bg-white rounded-[12px] flex items-center gap-4 px-4 py-3 product-note-appear"
        style={{
          bottom: 30,
          left: 0,
          right: 0,
          margin: '0 auto',
          width: 580,
          border: '3px solid #6DBE4B',
          boxShadow: '0px 4px 11px rgba(111,111,111,0.4)',
          zIndex: 20,
          pointerEvents: 'none',
        }}
      >
        <img src={FARMER_PHOTO} alt="Rachel" className="w-[51px] h-[51px] rounded-full object-cover flex-shrink-0" />
        <div className="flex flex-col gap-1.5">
          <p className="text-[#231F20] text-[14px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            👋 Rachel from Small Yard Farm says:
          </p>
          <p className="text-[#231F20] text-[14px] italic" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            "{product.note}"
          </p>
        </div>
      </div>
    </>
  );
}

function ProductTile({ product, badge, onAdd }) {
  return (
    <button
      onClick={onAdd}
      className="bg-white border border-[#D9D9D9] rounded-[14px] p-3 flex flex-col gap-2 cursor-pointer active:scale-95 transition-all text-left relative hover:-translate-y-1 hover:shadow-[0_0_0_3px_#A8DC88,_0_8px_20px_rgba(109,190,75,0.25)]"
      style={{ width: 178, height: 170, flexShrink: 0 }}
    >
      <div className="w-full rounded-[10px] overflow-hidden flex-shrink-0" style={{ height: 76 }}>
        {product.img ? (
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" style={product.imgPosition ? { objectPosition: product.imgPosition } : undefined} />
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

      <div className="flex flex-col gap-1 w-full">
        <p className="text-[#231F20] text-[16px] font-bold leading-[18px] line-clamp-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          {product.name}
        </p>
        <p className="text-[#606060] text-[14px] leading-[16px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          ${product.price % 1 === 0 ? product.price : product.price.toFixed(2)} / {product.unit}
        </p>
      </div>

      {badge != null && (
        <div
          key={badge}
          className="product-badge absolute top-2 right-2 px-2 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold bg-[#6DBE4B] whitespace-nowrap pointer-events-none"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {badge} added
        </div>
      )}
    </button>
  );
}

function CartThumbnail({ product, size = 'sm' }) {
  const cls = size === 'lg'
    ? 'w-16 h-16 rounded-[14px] overflow-hidden flex-shrink-0'
    : 'w-10 h-10 rounded-[10px] overflow-hidden flex-shrink-0';
  const emojiSize = size === 'lg' ? 30 : 20;
  const textCls = size === 'lg' ? 'text-[13px]' : 'text-[11px]';

  if (product.img) {
    return (
      <div className={cls}>
        <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className={`${cls} flex items-center justify-center`}
      style={{ background: product.bg || '#F0F0F0' }}>
      {product.emoji ? (
        <span style={{ fontSize: emojiSize }}>{product.emoji}</span>
      ) : (
        <span className={`${textCls} font-bold text-center leading-tight px-0.5`}
          style={{ color: product.textColor || '#231F20', fontFamily: 'Montserrat, sans-serif' }}>
          {product.name.slice(0, 2)}
        </span>
      )}
    </div>
  );
}

const FLY_DURATION = 750;

function FlyingThumbnail({ fly }) {
  const [phase, setPhase] = useState('idle');

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setPhase('fly'))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const dx = fly.endX - fly.startX;
  const dy = fly.endY - fly.startY;
  const dur = `${FLY_DURATION}ms`;

  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: fly.startX - 32, top: fly.startY - 32, zIndex: 100 }}
    >
      {/* X carrier */}
      <div style={{
        transform: phase === 'fly' ? `translateX(${dx}px)` : 'translateX(0px)',
        transition: phase === 'fly' ? `transform ${dur} cubic-bezier(0.6, 0, 0.8, 0.6)` : 'none',
      }}>
        {/* Y carrier + scale + fade — different easing creates arc */}
        <div style={{
          transform: phase === 'fly' ? `translateY(${dy}px) scale(0.45)` : 'translateY(0px) scale(1)',
          opacity: phase === 'fly' ? 0 : 1,
          transition: phase === 'fly'
            ? `transform ${dur} cubic-bezier(0.15, 0.85, 0.3, 1), opacity 300ms ease 450ms`
            : 'none',
        }}>
          <CartThumbnail product={fly.product} size="lg" />
        </div>
      </div>
    </div>
  );
}

function CartPanel({ cart, onAddItem, onRemoveItem, onCheckout, recentlyAddedId, recentlyAddedRotation }) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const [editingId, setEditingId] = useState(null);
  const timerRef = useRef(null);

  function openEdit(id) {
    clearTimeout(timerRef.current);
    setEditingId(id);
    timerRef.current = setTimeout(() => setEditingId(null), 2000);
  }

  function resetEditTimer(id) {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setEditingId(null), 2000);
  }

  function handleAdd(product) {
    onAddItem(product);
    resetEditTimer(product.id);
  }

  function handleRemove(id) {
    onRemoveItem(id);
    resetEditTimer(id);
  }

  return (
    <div className="absolute right-0 bottom-0 bg-white flex flex-col px-4 py-3"
      style={{ width: 290, height: 744, top: 0, boxShadow: '-4px 0 10px rgba(0,0,0,0.05)' }}>

      <div className="flex gap-3 items-center pb-2 rounded-[6px] w-full flex-shrink-0">
        <div className="relative w-10 h-10 flex-shrink-0">
          <img src="/bagimage.jpg" alt="Your bag" className="w-full h-full object-contain" />
        </div>
        <div>
          <p className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your bag</p>
          <p className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="flex-shrink-0" style={{ height: 4, background: '#F7F7F7', marginLeft: -16, marginRight: -16, width: 'calc(100% + 32px)' }} />

      {cart.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[#ABABAB] text-[14px] text-center w-[180px] leading-[22px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            👆 Tap an item to add it to your bag
          </p>
        </div>
      ) : (
        <div className="flex-1 w-full overflow-y-auto space-y-0">
          {cart.map((item) => {
            const isLanding = recentlyAddedId === item.product.id;
            return (
                <div key={item.product.id} className="relative flex items-center justify-between py-3 border-b border-[#F0F0F0]">
                  <div className="flex items-start gap-2 flex-1 min-w-0 mr-2">
                    <div
                      className={isLanding ? 'thumbnail-landing' : undefined}
                      style={isLanding ? { '--land-rotation': recentlyAddedRotation } : undefined}
                    >
                      <CartThumbnail product={item.product} />
                    </div>
                    <div className={`min-w-0 ${isLanding ? 'row-content-landing' : ''}`}>
                      <p className="text-[#231F20] text-[13px] font-bold leading-tight truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        {item.product.name}
                      </p>
                      <p className="text-[#606060] text-[12px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        ${(item.product.price * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className={isLanding ? 'row-content-landing' : undefined}>
                    {editingId === item.product.id ? (
                      <div className="border border-[#6DBE4B] rounded-[9px] flex items-center gap-[8px] p-1 flex-shrink-0">
                        <button
                          onClick={() => handleRemove(item.product.id)}
                          className="w-8 h-8 rounded-[6px] flex items-center justify-center transition-opacity hover:opacity-80 cursor-pointer"
                          style={{ background: item.qty === 1 ? '#E8324B' : '#F0F0F0' }}
                        >
                          {item.qty === 1 ? (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                              <path d="M5 12h14" stroke="#231F20" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                          )}
                        </button>
                        <span className="w-5 text-center text-[14px] font-semibold text-[#231F20]"
                          style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => handleAdd(item.product)}
                          className="w-8 h-8 rounded-[6px] bg-[#F0F0F0] flex items-center justify-center transition-colors hover:bg-[#E0E0E0] cursor-pointer"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <path d="M12 5v14M5 12h14" stroke="#231F20" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => openEdit(item.product.id)}
                        className="border border-[#D9D9D9] rounded-[9px] w-10 h-10 flex items-center justify-center flex-shrink-0 hover:border-[#6DBE4B] transition-colors cursor-pointer"
                      >
                        <span className="text-[#231F20] text-[16px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                          {item.qty}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-4 items-center w-full pt-2 flex-shrink-0">
        <div className="w-full rounded-[10px] overflow-hidden" style={{ background: '#F8F8F8' }}>
          <div className="p-3 flex flex-col gap-3">
            <div className="flex justify-between">
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Subtotal</span>
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Tax (10%)</span>
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div style={{ height: 1, marginLeft: 12, marginRight: 12, backgroundImage: 'repeating-linear-gradient(to right, #D3D3D3 0, #D3D3D3 10px, transparent 10px, transparent 16px)' }} />
          <div className="px-3 py-4 flex justify-between">
            <span className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total</span>
            <span className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>${total.toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          disabled={cart.length === 0}
          className="w-full h-[52px] rounded-[10px] text-white text-[16px] font-bold transition-all bg-[#6DBE4B] hover:bg-[#5aaa3d]"
          style={{
            fontFamily: 'Montserrat, sans-serif',
            opacity: cart.length === 0 ? 0.5 : 1,
            cursor: cart.length === 0 ? 'default' : 'pointer',
          }}
        >
          Checkout for ${total.toFixed(2)}
        </button>
      </div>
    </div>
  );
}

export default function Register({ cart, onAddItem, onRemoveItem, onCheckout }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [flyItems, setFlyItems] = useState([]);
  const [recentlyAddedId, setRecentlyAddedId] = useState(null);
  const [recentlyAddedRotation, setRecentlyAddedRotation] = useState('2deg');
  const [badges, setBadges] = useState({});
  const [activeNote, setActiveNote] = useState(null);
  const containerRef = useRef(null);
  const badgeTimers = useRef({});
  const noteTimer = useRef(null);

  const filtered = PRODUCTS.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getQty = (id) => cart.find(i => i.product.id === id)?.qty || 0;

  function handleProductClick(product, e) {
    playScanBeep();
    if (product.note) {
      clearTimeout(noteTimer.current);
      setActiveNote(product);
      noteTimer.current = setTimeout(() => setActiveNote(null), 4000);
    }
    const currentQty = getQty(product.id);
    const containerRect = containerRef.current.getBoundingClientRect();
    const tileRect = e.currentTarget.getBoundingClientRect();
    const startX = tileRect.left - containerRect.left + tileRect.width / 2;
    const startY = tileRect.top - containerRect.top + tileRect.height / 2;
    // Target: center of the basket panel (right side: 1134 - 278/2, 720px tall starting at y=24)
    const endX = 989;
    const endY = 400;
    const id = Date.now() + Math.random();
    setFlyItems(prev => [...prev, { id, product, startX, startY, endX, endY }]);
    setTimeout(() => {
      setFlyItems(prev => prev.filter(f => f.id !== id));
      onAddItem(product);
      playCrumpleSound();
      const rotation = Math.random() < 0.5 ? '2deg' : '-2deg';
      setRecentlyAddedRotation(rotation);
      setRecentlyAddedId(product.id);
      setTimeout(() => setRecentlyAddedId(null), 700);

      // Show "# added" badge on the tile
      const newQty = currentQty + 1;
      clearTimeout(badgeTimers.current[product.id]);
      setBadges(prev => ({ ...prev, [product.id]: newQty }));
      badgeTimers.current[product.id] = setTimeout(() => {
        setBadges(prev => { const n = { ...prev }; delete n[product.id]; return n; });
      }, 2000);
    }, FLY_DURATION + 50);
  }

  return (
    <div ref={containerRef} className="relative w-full h-full" style={{ background: '#FAFAFA' }}>
      <CartPanel cart={cart} onAddItem={onAddItem} onRemoveItem={onRemoveItem} onCheckout={onCheckout} recentlyAddedId={recentlyAddedId} recentlyAddedRotation={recentlyAddedRotation} />

      <div className="absolute left-0 right-[290px] top-0 bottom-0 flex flex-col pl-[30px] pr-5">
        <div className="flex flex-col gap-4 pt-[24px] pb-2 flex-shrink-0 pl-[6px]">
          <div className="flex items-center gap-6">
            {/* Outer ring — only present while focused */}
            <div className={`w-[772px] rounded-[10px] transition-all ${searchFocused ? 'border-4 border-[#D3EBC9]' : ''}`}>
              <div
                className={`bg-white rounded-[10px] h-[52px] flex items-center justify-between pl-4 pr-2 py-2 transition-all border ${
                  searchFocused
                    ? 'border-[#6DBE4B]'
                    : 'border-[#D9D9D9] hover:border-[#AAAAAA]'
                }`}
                style={{ boxShadow: 'none' }}
              >
                <div className="flex gap-3 items-center flex-1 min-w-0">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24" className="flex-shrink-0">
                    <path d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2-4.35-4.35" stroke="#606060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Search for an item..."
                    className="flex-1 outline-none text-[16px] text-[#231F20] bg-transparent cursor-text min-w-0"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  />
                </div>
                {(searchFocused || search) && (
                  <button
                    onMouseDown={e => e.preventDefault()}
                    onClick={() => setSearch('')}
                    className="w-10 h-10 rounded-full bg-[#F0F0F0] flex items-center justify-center flex-shrink-0 hover:bg-[#E0E0E0] transition-colors cursor-pointer ml-2"
                  >
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="#231F20" strokeWidth="2.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          {!searchFocused && <div className="flex gap-3 items-center">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-2 rounded-[12px] text-[16px] font-bold transition-all cursor-pointer hover:bg-[#EDF7E8] hover:border-[#A8DC88] text-[#231F20] ${
                  activeCategory === cat
                    ? 'bg-[#D3EBC9] border-2 border-[#6DBE4B]'
                    : 'bg-transparent border border-[#D9D9D9]'
                }`}
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {cat}
              </button>
            ))}
          </div>}
        </div>

        {searchFocused && !search ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-[#ABABAB] text-[22px] font-semibold text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              What're you looking for?
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap overflow-y-auto content-start" style={{ gap: 20, padding: '10px 6px 16px 6px' }}>
            {filtered.map(product => (
              <ProductTile
                key={product.id}
                product={product}
                badge={badges[product.id] ?? null}
                onAdd={(e) => handleProductClick(product, e)}
              />
            ))}
          </div>
        )}

        {activeNote && <ProductNote key={activeNote.id} product={activeNote} />}
      </div>

      {flyItems.map(fly => (
        <FlyingThumbnail key={fly.id} fly={fly} />
      ))}
    </div>
  );
}
