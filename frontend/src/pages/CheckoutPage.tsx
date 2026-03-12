import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { items, getTotalPrice } = useCart();

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <p>Cart has {items.length} items</p>
      <p>Total: ${getTotalPrice().toFixed(2)}</p>
      <p>Checkout functionality coming soon...</p>
    </div>
  );
};

export default CheckoutPage;

// Made with Bob
