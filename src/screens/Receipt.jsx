import { useState, useEffect } from 'react';
import { FARM_NAME, FARM_LOGO, TAX_RATE } from '../data/products';

const PAYMENT_LABELS = {
  card: 'Visa *2345',
  cash: 'Cash',
  farmcredit: 'Farm Credit',
  ebt: 'EBT',
};

export default function Receipt({ cart, paymentMethod, onDone }) {
  const [phone, setPhone] = useState('');
  const [countdown, setCountdown] = useState(5);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // Auto-return to screensaver after 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          onDone();
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ background: '#FAFAFA' }}>
      {/* iPad status bar */}
      <div className="absolute top-0 left-0 w-full h-6 bg-[#231F20] flex items-center justify-between px-4" style={{ zIndex: 10 }}>
        <span className="text-white text-[12px]">9:41 AM</span>
        <span className="text-white text-[12px]">● ● ●</span>
        <span className="text-white text-[12px]">100% 🔋</span>
      </div>

      {/* Countdown + close */}
      <button
        onClick={onDone}
        className="absolute right-10 flex items-center gap-2 text-[#606060] text-[14px]"
        style={{ top: 50, fontFamily: 'Montserrat, sans-serif' }}
      >
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#F0F0F0' }}>
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" stroke="#231F20" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </button>

      {/* Countdown pill */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[#606060] text-[13px]"
        style={{ background: '#F0F0F0', fontFamily: 'Montserrat, sans-serif' }}>
        Returning to start in {countdown}s
      </div>

      {/* Receipt card */}
      <div className="bg-white border border-[#D3EBC9] rounded-[20px] overflow-hidden flex flex-col"
        style={{ width: 500, boxShadow: '0 4px 12px rgba(35,31,32,0.1)', marginTop: 40 }}>

        {/* Green header */}
        <div className="flex flex-col items-center gap-4 px-4 py-8" style={{ background: '#EDF7E8' }}>
          <img
            src={FARM_LOGO}
            alt={FARM_NAME}
            className="rounded-full object-cover"
            style={{ width: 90, height: 90, border: '3px solid #6DBE4B' }}
          />
          <div className="flex flex-col gap-2 items-center">
            <p className="text-[#231F20] text-[20px] font-bold text-center w-[300px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Thank you!
            </p>
            <p className="text-[#231F20] text-[14px] text-center w-[300px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {FARM_NAME}
            </p>
          </div>
        </div>

        {/* Payment details */}
        <div className="flex flex-col items-center gap-8 px-10 pb-10 pt-4">
          {/* Paid badge + amount */}
          <div className="flex flex-col items-center gap-3">
            <div className="px-3 py-0.5 rounded-[8px]" style={{ background: '#EDF7E8' }}>
              <p className="text-[#2D5E3F] text-[14px] font-semibold leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Paid
              </p>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-[#231F20] text-[21px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>$</span>
              <span className="text-[#231F20] text-[38px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {total.toFixed(2).replace(/^\$/, '')}
              </span>
            </div>
            <p className="text-[#231F20] text-[14px] text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {PAYMENT_LABELS[paymentMethod] || 'Payment received'}
            </p>
          </div>

          {/* Divider */}
          <div className="w-full border-t border-dashed border-[#D9D9D9]" />

          {/* Receipt options */}
          <div className="flex flex-col gap-6 w-full">
            <p className="text-[#231F20] text-[18px] font-bold text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Would you like a receipt?
            </p>

            <div className="flex flex-col gap-8">
              {/* Print */}
              <button
                onClick={onDone}
                className="w-full h-[52px] rounded-[10px] text-white text-[16px] font-bold"
                style={{ background: '#6DBE4B', fontFamily: 'Montserrat, sans-serif' }}
              >
                Print my receipt
              </button>

              {/* Text divider */}
              <div className="flex items-center gap-4">
                <p className="text-[#231F20] text-[16px] font-semibold whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Or, send via text:
                </p>
                <div className="flex-1 border-t border-[#D9D9D9]" />
              </div>

              {/* Phone input + send */}
              <div className="flex flex-col gap-4">
                <div className="bg-white border border-[#D9D9D9] rounded-[10px] h-[52px] flex items-center gap-3 px-4">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.68A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#606060" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Phone number"
                    className="flex-1 outline-none text-[16px] bg-transparent"
                    style={{ fontFamily: 'Montserrat, sans-serif', color: phone ? '#231F20' : '#606060' }}
                  />
                </div>

                <button
                  disabled={!phone}
                  onClick={onDone}
                  className="w-full h-[52px] rounded-[10px] text-white text-[16px] font-bold transition-opacity"
                  style={{
                    background: '#6DBE4B',
                    opacity: phone ? 1 : 0.5,
                    cursor: phone ? 'pointer' : 'default',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  Send via text
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
