import { FARM_CREDIT } from '../data/products';

const GB_LOGO_CIRCLE = 'https://www.figma.com/api/mcp/asset/0f59ea27-6545-44d8-abee-518f0a90682f';

export default function FarmCreditModal({ total, onClose, onComplete }) {
  const covers = FARM_CREDIT >= total;

  return (
    <div className="absolute inset-0 flex" style={{ zIndex: 50 }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative z-10 bg-white flex flex-col items-center justify-between pb-11 pt-7 px-10 rounded-tr-[20px] rounded-br-[20px]"
        style={{ width: 567, height: '100%' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between w-full flex-shrink-0">
          <p className="text-[#231F20] text-[20px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>Farm Credit</p>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-[#F0F0F0] hover:bg-[#E0E0E0] transition-colors"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
              <path d="M18 6L6 18M6 6l12 12" stroke="#231F20" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="flex flex-col items-center gap-6 flex-1 justify-center">
          <div className="relative flex items-center justify-center" style={{ width: 140, height: 140 }}>
            <div className="absolute inset-0 rounded-full" style={{ background: '#D3EBC9' }} />
            <img src={GB_LOGO_CIRCLE} alt="GrownBy" className="relative z-10 rounded-full object-cover"
              style={{ width: 75, height: 75 }} />
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-3">
              <p className="text-[#231F20] text-[46px] font-bold text-center w-[300px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                ${total.toFixed(2)}
              </p>
              <p className="text-[#231F20] text-[16px] font-semibold text-center w-[300px] leading-[30px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Farm Credit available
              </p>
            </div>

            {covers ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-[8px]" style={{ background: '#EDF7E8' }}>
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="#2D5E3F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-[#2D5E3F] text-[16px] font-semibold leading-[30px] whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Covers balance due
                </p>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-[8px]" style={{ background: '#FDEDE2' }}>
                <p className="text-[#E6803D] text-[16px] font-semibold leading-[30px] whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  ${(total - FARM_CREDIT).toFixed(2)} remaining after credit
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center w-[300px] flex-shrink-0">
          <button
            onClick={() => onComplete('farmcredit')}
            className="w-full h-[52px] rounded-[10px] text-white text-[16px] font-bold transition-all bg-[#6DBE4B] hover:bg-[#5aaa3d]"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Apply ${Math.min(total, FARM_CREDIT).toFixed(2)} Farm Credit
          </button>
        </div>
      </div>
    </div>
  );
}
