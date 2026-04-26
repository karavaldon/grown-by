import { useState } from 'react';

export default function CashModal({ total, onClose, onComplete }) {
  const [tender, setTender] = useState(total.toFixed(2));

  const tenderNum = parseFloat(tender) || 0;
  const change = Math.max(0, tenderNum - total);
  const canCollect = tenderNum >= total;

  const quickAmounts = [
    total.toFixed(2),
    Math.ceil(total).toString(),
    '60',
    '100',
  ].filter((v, i, a) => a.indexOf(v) === i);

  function handleKey(k) {
    if (k === 'del') {
      setTender(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else if (k === '.') {
      if (!tender.includes('.')) setTender(prev => prev + '.');
    } else {
      setTender(prev => {
        if (prev === '0') return k;
        const parts = prev.split('.');
        if (parts.length > 1 && parts[1].length >= 2) return prev;
        return prev + k;
      });
    }
  }

  return (
    <div className="absolute inset-0 flex" style={{ zIndex: 50 }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative z-10 bg-white flex flex-col justify-between pb-11 pt-7 px-10 rounded-tr-[20px] rounded-br-[20px]"
        style={{ width: 567, height: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top section */}
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <p className="text-[#231F20] text-[20px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Cash</p>
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

          {/* Tender field */}
          <div className="flex flex-col gap-2">
            <p className="text-black text-[16px] font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Tender</p>
            <div className="border-4 border-[#D3EBC9] rounded-[10px]">
              <div className="bg-white border border-[#6DBE4B] rounded-[10px] h-[52px] flex items-center px-4 gap-3">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <rect x="2" y="6" width="20" height="12" rx="2" stroke="#231F20" strokeWidth="2"/>
                  <path d="M2 10h20" stroke="#231F20" strokeWidth="2"/>
                </svg>
                <span className="text-[#231F20] text-[16px] flex-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {tender}
                </span>
                <span className="w-0.5 h-6 bg-[#231F20] animate-pulse" />
              </div>
            </div>
          </div>

          {/* Quick amounts */}
          <div className="grid grid-cols-4 gap-4">
            {quickAmounts.map(amt => (
              <button
                key={amt}
                onClick={() => setTender(parseFloat(amt).toFixed(2))}
                className="h-[56px] rounded-[12px] flex items-center justify-center text-[#231F20] text-[16px] transition-colors"
                style={{
                  background: tender === parseFloat(amt).toFixed(2) ? '#EDF7E8' : '#F8F8F8',
                  border: '1px solid #E9E9E9',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                ${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Numpad */}
        <div className="flex flex-col gap-4">
          {[['1','2','3'],['4','5','6'],['7','8','9'],['.','0','del']].map((row, ri) => (
            <div key={ri} className="grid grid-cols-3 gap-4">
              {row.map(k => (
                <button
                  key={k}
                  onClick={() => handleKey(k)}
                  className="h-[56px] rounded-[12px] flex items-center justify-center transition-colors"
                  style={{
                    border: '1px solid #E9E9E9',
                    background: k === '0' ? '#EDF7E8' : k === 'del' ? '#F8F8F8' : 'transparent',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {k === 'del' ? (
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z" stroke="#231F20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="18" y1="9" x2="12" y2="15" stroke="#231F20" strokeWidth="2" strokeLinecap="round"/>
                      <line x1="12" y1="9" x2="18" y2="15" stroke="#231F20" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <span className="text-[#231F20] text-[24px]">{k}</span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom: collect + change */}
        <div className="flex flex-col items-center gap-6">
          <button
            onClick={() => canCollect && onComplete('cash')}
            disabled={!canCollect}
            className="w-[300px] h-[52px] rounded-[10px] text-white text-[16px] font-bold transition-opacity"
            style={{
              background: '#6DBE4B',
              opacity: canCollect ? 1 : 0.5,
              fontFamily: 'Montserrat, sans-serif',
              cursor: canCollect ? 'pointer' : 'default',
            }}
          >
            Collect ${tenderNum.toFixed(2)}
          </button>
          {canCollect && change > 0 && (
            <p className="text-[#606060] text-[16px] font-bold text-center" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              ${change.toFixed(2)} change
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
