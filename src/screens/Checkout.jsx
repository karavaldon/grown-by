import { TAX_RATE, FARM_CREDIT } from '../data/products';

const PAYMENT_OPTIONS = [
  { id: 'card', label: 'Card', sub: 'Tap or swipe', bg: '#EDE9FC', icon: 'card' },
  { id: 'farmcredit', label: 'Farm Credit', sub: `$${FARM_CREDIT}.00`, subColor: '#6DBE4B', bg: '#D3EBC9', icon: 'gb' },
  { id: 'cash', label: 'Cash', sub: null, bg: '#DEECED', icon: 'cash' },
  { id: 'ebt', label: 'SNAP / EBT', sub: null, bg: '#FDEDE2', icon: 'ebt' },
];

function PaymentIcon({ type, bg }) {
  const icons = {
    card: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#5E44C5" strokeWidth="2"/>
        <path d="M2 10h20" stroke="#5E44C5" strokeWidth="2"/>
      </svg>
    ),
    gb: (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
        <rect x="0" y="0" width="24" height="20" rx="3" fill="#6DBE4B"/>
        <text x="4" y="14" fontSize="9" fontWeight="bold" fill="white" fontFamily="Montserrat,sans-serif">GB</text>
      </svg>
    ),
    cash: (
      <svg width="12" height="20" fill="none" viewBox="0 0 12 20">
        <path d="M6 1v18M2 5h6a2 2 0 010 4H4a2 2 0 000 4h7" stroke="#4BA7BE" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    ebt: (
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
        <rect x="0" y="0" width="16" height="12" rx="2" fill="#E6803D"/>
        <text x="2" y="9" fontSize="6" fontWeight="bold" fill="white" fontFamily="Montserrat,sans-serif">EBT</text>
      </svg>
    ),
  };
  return (
    <div className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
      {icons[type]}
    </div>
  );
}

export default function Checkout({ cart, onSelectPayment, onBack }) {
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  return (
    <div className="relative w-full h-full flex" style={{ background: '#FAFAFA' }}>
      {/* iPad status bar */}
      <div className="absolute top-0 left-0 w-full h-6 bg-[#231F20] flex items-center justify-between px-4" style={{ zIndex: 10 }}>
        <span className="text-white text-[12px]">9:41 AM</span>
        <span className="text-white text-[12px]">● ● ●</span>
        <span className="text-white text-[12px]">100% 🔋</span>
      </div>

      {/* Left panel - order summary */}
      <div className="absolute left-0 top-6 bg-white flex flex-col px-5 py-4 gap-6"
        style={{ width: 500, bottom: 0 }}>

        {/* Back button */}
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-[23px] flex items-center justify-center flex-shrink-0 self-start"
          style={{ background: '#F0F0F0' }}
        >
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" stroke="#231F20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Customer info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#D3EBC9', border: '2px solid #6DBE4B' }}>
              <span className="text-[14px] font-semibold text-[#2D5E3F]" style={{ fontFamily: 'Montserrat, sans-serif' }}>SY</span>
            </div>
            <div>
              <p className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Walk-in</p>
              <p className="text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                <span className="font-bold text-[#6DBE4B]">${FARM_CREDIT}.00 </span>
                <span className="text-[#606060]">Farm Credit</span>
              </p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ background: '#F0F0F0' }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#231F20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#231F20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Line items */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {cart.map(({ product, qty }) => (
            <div key={product.id} className="flex items-center justify-between py-4 border-b border-[#F0F0F0]">
              <div className="flex items-center gap-3">
                <div className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[14px] font-normal text-[#231F20]"
                  style={{ background: '#F0F0F0', fontFamily: 'Montserrat, sans-serif' }}>
                  {qty}
                </div>
                <div>
                  <p className="text-[#231F20] text-[16px] font-bold leading-[16px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>{product.name}</p>
                  <p className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>per {product.unit}</p>
                </div>
              </div>
              <p className="text-[#231F20] text-[16px] font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                ${(product.price * qty).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex-shrink-0">
          <div className="rounded-[12px] p-3 flex flex-col gap-3" style={{ background: '#F8F8F8' }}>
            <div className="flex justify-between">
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Subtotal</span>
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Tax (10%)</span>
              <span className="text-[#231F20] text-[14px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="rounded-[12px] px-3 py-4 flex justify-between mt-0" style={{ background: '#F8F8F8' }}>
            <span className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total</span>
            <span className="text-[#231F20] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Right panel - payment options */}
      <div className="absolute right-0 top-6 bottom-0 flex flex-col items-center justify-center gap-8 px-8"
        style={{ left: 500 }}>

        {/* Total due */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-[#606060] text-[16px] leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total Due</p>
          <p className="text-[#231F20] text-[50px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ${total.toFixed(2)}
          </p>
        </div>

        {/* How to pay */}
        <p className="text-[#231F20] text-[24px] font-semibold text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          How would you like to pay?
        </p>

        {/* Payment grid */}
        <div className="grid grid-cols-2 gap-4">
          {PAYMENT_OPTIONS.map(option => (
            <button
              key={option.id}
              onClick={() => onSelectPayment(option.id)}
              className="flex flex-col items-center gap-3 p-3 rounded-[14px] cursor-pointer active:scale-95 transition-transform"
              style={{
                width: 163,
                height: 136,
                background: 'white',
                border: '3px solid #EAEAEA',
                justifyContent: 'center',
              }}
            >
              <PaymentIcon type={option.icon} bg={option.bg} />
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[#231F20] text-[14px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {option.label}
                </span>
                {option.sub && (
                  <span className="text-[12px] font-bold" style={{ color: option.subColor || '#606060', fontFamily: 'Montserrat, sans-serif' }}>
                    {option.sub}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
