import { useState, useCallback } from 'react';
import './index.css';

import Screensaver from './screens/Screensaver';
import Register from './screens/Register';
import Checkout from './screens/Checkout';
import Receipt from './screens/Receipt';

import CardModal from './modals/CardModal';
import CashModal from './modals/CashModal';
import FarmCreditModal from './modals/FarmCreditModal';
import EBTModal from './modals/EBTModal';

function DemoModal({ onClose }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 50 }}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className="relative z-10 bg-white rounded-[20px] flex flex-col items-center gap-5 px-12 py-10"
        style={{ width: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        <p className="text-[40px]">👩‍🌾</p>
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-[#231F20] text-[20px] font-bold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Thanks for trying this out!
          </p>
          <p className="text-[#606060] text-[16px] leading-[26px]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Feel free to keep adding items to your basket.
          </p>
          <p className="text-[#606060] text-[16px] font-semibold" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            🔊 Sound on!
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-2 h-[52px] px-10 rounded-[10px] text-white text-[16px] font-bold bg-[#6DBE4B] hover:bg-[#5aaa3d] transition-colors cursor-pointer"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState('register'); // screensaver | register | checkout | receipt
  const [cart, setCart] = useState([]);
  const [paymentModal, setPaymentModal] = useState(null); // card | cash | farmcredit | ebt | null
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showDemoModal, setShowDemoModal] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const total = subtotal * 1.1;

  function addItem(product) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function removeItem(productId) {
    setCart(prev => {
      const item = prev.find(i => i.product.id === productId);
      if (!item) return prev;
      if (item.qty === 1) return prev.filter(i => i.product.id !== productId);
      return prev.map(i => i.product.id === productId ? { ...i, qty: i.qty - 1 } : i);
    });
  }

  const handlePaymentComplete = useCallback((method) => {
    setPaymentMethod(method);
    setPaymentModal(null);
    setScreen('receipt');
  }, []);

  function resetToScreensaver() {
    setScreen('screensaver');
    setCart([]);
    setPaymentModal(null);
    setPaymentMethod(null);
  }

  return (
    <div style={{ width: 1134, height: 744, position: 'relative', overflow: 'hidden' }}>
      {/* Screens */}
      {screen === 'screensaver' && (
        <Screensaver onCheckout={() => setScreen('register')} />
      )}

      {screen === 'register' && (
        <Register
          cart={cart}
          onAddItem={addItem}
          onRemoveItem={removeItem}
          onCheckout={() => setShowDemoModal(true)}
        />
      )}

      {screen === 'checkout' && (
        <Checkout
          cart={cart}
          onSelectPayment={setPaymentModal}
          onBack={() => setScreen('register')}
        />
      )}

      {screen === 'receipt' && (
        <Receipt
          cart={cart}
          paymentMethod={paymentMethod}
          onDone={resetToScreensaver}
        />
      )}

      {showDemoModal && <DemoModal onClose={() => setShowDemoModal(false)} />}

      {/* Payment modals — rendered on top of checkout */}
      {paymentModal === 'card' && (
        <CardModal
          total={total}
          onClose={() => setPaymentModal(null)}
          onComplete={handlePaymentComplete}
        />
      )}
      {paymentModal === 'cash' && (
        <CashModal
          total={total}
          onClose={() => setPaymentModal(null)}
          onComplete={handlePaymentComplete}
        />
      )}
      {paymentModal === 'farmcredit' && (
        <FarmCreditModal
          total={total}
          onClose={() => setPaymentModal(null)}
          onComplete={handlePaymentComplete}
        />
      )}
      {paymentModal === 'ebt' && (
        <EBTModal
          total={total}
          onClose={() => setPaymentModal(null)}
          onComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
