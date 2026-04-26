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

export default function App() {
  const [screen, setScreen] = useState('screensaver'); // screensaver | register | checkout | receipt
  const [cart, setCart] = useState([]);
  const [paymentModal, setPaymentModal] = useState(null); // card | cash | farmcredit | ebt | null
  const [paymentMethod, setPaymentMethod] = useState(null);

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
          onCheckout={() => setScreen('checkout')}
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
