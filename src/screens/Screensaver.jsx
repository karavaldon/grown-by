import { FARM_BG, FARM_LOGO, FARM_NAME } from '../data/products';

export default function Screensaver({ onCheckout }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#e7ddc0]">
      {/* Background farm photo */}
      <img
        src={FARM_BG}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ left: '-19%', top: '-12%', width: '145%', height: '125%' }}
      />

      {/* Frosted glass card */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-6 rounded-2xl px-12 py-10"
        style={{
          width: 577,
          height: 415,
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
        }}
      >
        {/* Farm logo */}
        <img
          src={FARM_LOGO}
          alt={FARM_NAME}
          className="rounded-full object-cover"
          style={{ width: 164, height: 164, border: '3px solid #6DBE4B' }}
        />

        {/* Farm name */}
        <p
          className="text-[#231F20] text-[32px] font-bold text-center"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {FARM_NAME}
        </p>

        {/* Checkout button */}
        <button
          onClick={onCheckout}
          className="w-[254px] h-[52px] rounded-[10px] text-white text-[16px] font-bold cursor-pointer active:scale-95 transition-transform"
          style={{ background: '#6DBE4B', fontFamily: 'Montserrat, sans-serif' }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
