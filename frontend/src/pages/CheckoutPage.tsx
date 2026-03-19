import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Form,
  TextInput,
  InlineLoading,
  InlineNotification,
} from '@carbon/react';
import { ShoppingCart, TrashCan } from '@carbon/icons-react';
import { useCart } from '../context/CartContext';
import { CreateOrderDto } from '@burger-palace/shared';
import api from '../services/api';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { items, getTotalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      setError('Please fill in all customer information fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData: CreateOrderDto = {
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
        },
        items: items.map((item) => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
          burgerOptionIds: item.selectedOptions.map((opt) => opt.id),
        })),
      };

      const response = await api.post('/orders', orderData);
      const order = response.data.data; // Backend wraps response in { status, data }

      // Clear cart and navigate to order view
      clearCart();
      navigate(`/order/${order.orderNumber}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to submit order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-cart">
            <ShoppingCart size={64} />
            <h2>Your cart is empty</h2>
            <p>Add some delicious items from our menu!</p>
            <Button onClick={() => navigate('/menu')}>
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>

        <div className="checkout-content">
          {/* Cart Items Section */}
          <div className="cart-section">
            <h2>Your Order</h2>
            <div className="cart-items">
              {items.map((item) => {
                const itemPrice = Number(item.menuItem.basePrice);
                const optionsPrice = item.selectedOptions.reduce(
                  (sum, opt) => sum + Number(opt.priceModifier),
                  0
                );
                const itemTotal = (itemPrice + optionsPrice) * item.quantity;

                return (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-details">
                      <h3>{item.menuItem.name}</h3>
                      {item.selectedOptions.length > 0 && (
                        <div className="cart-item-options">
                          {item.selectedOptions.map((opt) => (
                            <span key={opt.id} className="option-tag">
                              {opt.name}
                              {Number(opt.priceModifier) > 0 && 
                                ` (+$${Number(opt.priceModifier).toFixed(2)})`
                              }
                            </span>
                          ))}
                        </div>
                      )}
                      {item.specialInstructions && (
                        <p className="special-instructions">
                          Note: {item.specialInstructions}
                        </p>
                      )}
                    </div>

                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <Button
                          kind="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="quantity">{item.quantity}</span>
                        <Button
                          kind="ghost"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="cart-item-price">
                        ${itemTotal.toFixed(2)}
                      </div>
                      <Button
                        kind="ghost"
                        size="sm"
                        hasIconOnly
                        iconDescription="Remove item"
                        renderIcon={TrashCan}
                        onClick={() => removeItem(item.id)}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="customer-section">
            <h2>Customer Information</h2>
            <Form onSubmit={handleSubmit}>
              <div className="form-group">
                <TextInput
                  id="customer-name"
                  labelText="Full Name"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <TextInput
                  id="customer-email"
                  labelText="Email"
                  placeholder="your.email@example.com"
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <TextInput
                  id="customer-phone"
                  labelText="Phone Number"
                  placeholder="(555) 123-4567"
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <InlineNotification
                  kind="error"
                  title="Error"
                  subtitle={error}
                  onCloseButtonClick={() => setError(null)}
                  lowContrast
                />
              )}

              <div className="form-actions">
                <Button
                  kind="secondary"
                  onClick={() => navigate('/menu')}
                  disabled={isSubmitting}
                >
                  Back to Menu
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <InlineLoading description="Placing order..." />
                  ) : (
                    `Place Order - $${total.toFixed(2)}`
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

// Made with Bob
