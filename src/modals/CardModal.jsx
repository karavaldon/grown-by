import { useState, useEffect } from 'react';

const VISA_LOGO = 'https://www.figma.com/api/mcp/asset/4a260d68-e698-4f37-a0fc-5f618283075c';
const MC_LOGO = 'https://www.figma.com/api/mcp/asset/0bf3c315-32ba-4971-b9a9-a9823fc28fef';
const AMEX_LOGO = 'https://www.figma.com/api/mcp/asset/bbdd372b-1b06-48b3-bcae-c056e1748e56';
const DISCOVER_LOGO = 'https://www.figma.com/api/mcp/asset/8703535a-2b5d-4eca-ab89-cb3b5b78f713';

export default function CardModal({ total, onClose, onComplete }) {
  const [state, setState] = useState('waiting'); // 'waiting' | 'processing' | 'approved'

  useEffect(() => {
    const t1 = setTimeout(() => setState('processing'), 3000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (state === 'processing') {
      const t2 = setTimeout(() => setState('approved'), 2000);
      return () => clearTimeout(t2);
    }
  }, [state]);

  useEffect(() => {
    if (state === 'approved') {
      const t3 = setTimeout(() => onComplete('card'), 1000);
      return () => clearTimeout(t3);
    }
  }, [state, onComplete]);

  return (
    <div className="absolute inset-0 flex" style={{ zIndex: 50 }}>
      {/* Dimmed right overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal panel (left side) */}
      <div
        className="relative z-10 bg-white flex flex-col items-center justify-between pb-11 pt-7 px-10 rounded-tr-[20px] rounded-br-[20px]"
        style={{ width: 567, height: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full flex-shrink-0">
          <p className="text-[#231F20] text-[20px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Card Reader
          </p>
          <div className="flex items-center gap-6">
            <button className="text-[#6DBE4B] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Split
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: '#F0F0F0' }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="#231F20" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Center content */}
        <div className="flex flex-col items-center gap-6">
          {/* Animated circle icon */}
          <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: '#EDE9FC' }} />
            <div className="absolute rounded-full flex items-center justify-center"
              style={{ width: 75, height: 75, background: '#D4CDF8' }}>
              {state === 'waiting' && (
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" className="-rotate-12">
                  <rect x="2" y="5" width="20" height="14" rx="2" stroke="#5E44C5" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="#5E44C5" strokeWidth="2"/>
                </svg>
              )}
              {state === 'processing' && (
                <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#D4CDF8" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="#5E44C5" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              {state === 'approved' && (
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="#6DBE4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>

          {/* Amount */}
          <p className="text-[#231F20] text-[46px] font-bold text-center w-[300px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ${total.toFixed(2)}
          </p>

          {/* Status text */}
          <div className="text-center w-[300px]">
            {state === 'waiting' && (
              <>
                <p className="text-[#5E44C5] text-[20px] font-bold leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Ready for Tap or Swipe
                </p>
                <p className="text-[#231F20] text-[20px] leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  on your card reader
                </p>
              </>
            )}
            {state === 'processing' && (
              <p className="text-[#5E44C5] text-[20px] font-bold leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Processing...
              </p>
            )}
            {state === 'approved' && (
              <p className="text-[#6DBE4B] text-[20px] font-bold leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Approved!
              </p>
            )}
          </div>
        </div>

        {/* Card logos */}
        <div className="flex gap-4 items-center flex-shrink-0">
          {[VISA_LOGO, MC_LOGO, AMEX_LOGO, DISCOVER_LOGO].map((src, i) => (
            <div key={i} className="rounded-[6px] overflow-hidden border border-white/80"
              style={{ width: 50, height: 32, boxShadow: '0 2px 10px rgba(183,183,183,0.08)' }}>
              <img src={src} alt="" className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
