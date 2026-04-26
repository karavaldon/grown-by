import { useState, useEffect } from 'react';

const SNAP_LOGO = 'https://www.figma.com/api/mcp/asset/1958ca47-930d-4efb-ba18-7487f6791d34';

export default function EBTModal({ total, onClose, onComplete }) {
  const [state, setState] = useState('waiting');

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
      const t3 = setTimeout(() => onComplete('ebt'), 1000);
      return () => clearTimeout(t3);
    }
  }, [state, onComplete]);

  return (
    <div className="absolute inset-0 flex" style={{ zIndex: 50 }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative z-10 bg-white flex flex-col items-center justify-between pb-11 pt-7 px-10 rounded-tr-[20px] rounded-br-[20px]"
        style={{ width: 567, height: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between w-full flex-shrink-0">
          <p className="text-[#231F20] text-[20px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>EBT</p>
          <div className="flex items-center gap-6">
            <button className="text-[#6DBE4B] text-[16px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              Check Balance
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

        {/* Center */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: '#FDEDE2' }} />
            <div className="absolute rounded-full flex items-center justify-center"
              style={{ width: 75, height: 75, background: '#FBDBC5' }}>
              {state === 'waiting' && (
                <svg width="28" height="18" viewBox="0 0 28 18" fill="none" className="-rotate-12">
                  <rect x="0" y="0" width="28" height="18" rx="3" fill="#E6803D"/>
                  <text x="4" y="12" fontSize="8" fontWeight="bold" fill="white" fontFamily="Montserrat,sans-serif">EBT</text>
                </svg>
              )}
              {state === 'processing' && (
                <svg className="animate-spin" width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#FBDBC5" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0110 10" stroke="#E6803D" strokeWidth="3" strokeLinecap="round"/>
                </svg>
              )}
              {state === 'approved' && (
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="#6DBE4B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>

          <p className="text-[#231F20] text-[46px] font-bold text-center w-[300px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            ${total.toFixed(2)}
          </p>

          <div className="text-center w-[300px]">
            {state === 'waiting' && (
              <>
                <p className="text-[#E6803D] text-[20px] font-bold leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Ready for Tap or Swipe
                </p>
                <p className="text-[#231F20] text-[20px] leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  on your card reader
                </p>
              </>
            )}
            {state === 'processing' && (
              <p className="text-[#E6803D] text-[20px] font-bold leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
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

        {/* SNAP logo */}
        <div className="rounded-[6px] overflow-hidden border border-white/80 flex-shrink-0"
          style={{ width: 50, height: 32, boxShadow: '0 2px 20px rgba(183,183,183,0.08)' }}>
          <img src={SNAP_LOGO} alt="SNAP" className="w-full h-full object-contain" />
        </div>
      </div>
    </div>
  );
}
