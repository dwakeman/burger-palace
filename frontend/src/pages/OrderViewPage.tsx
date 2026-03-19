import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Loading,
  InlineNotification,
  Tag,
} from '@carbon/react';
import { Checkmark, Home } from '@carbon/icons-react';
import { OrderDto, OrderStatus } from '@burger-palace/shared';
import api from '../services/api';
import './OrderViewPage.css';

const OrderViewPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderNumber) {
        setError('No order number provided');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/orders/number/${orderNumber}`);
        setOrder(response.data.data);
      } catch (err: any) {
        console.error('Failed to fetch order:', err);
        setError(
          err.response?.data?.message || 
          'Failed to load order. Please check your order number.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderNumber]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'blue';
      case OrderStatus.PREPARING:
        return 'cyan';
      case OrderStatus.READY:
        return 'green';
      case OrderStatus.COMPLETED:
        return 'gray';
      case OrderStatus.CANCELLED:
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Order Received';
      case OrderStatus.PREPARING:
        return 'Being Prepared';
      case OrderStatus.READY:
        return 'Ready for Pickup';
      case OrderStatus.COMPLETED:
        return 'Completed';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="order-view-loading">
        <Loading description="Loading order details..." withOverlay={false} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-view-page">
        <div className="order-view-container">
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error || 'Order not found'}
            lowContrast
          />
          <div className="order-view-actions">
            <Button onClick={() => navigate('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-view-page">
      <div className="order-view-container">
        {/* Success Header */}
        <div className="order-success-header">
          <div className="success-icon">
            <Checkmark size={48} />
          </div>
          <h1>Order Confirmed!</h1>
          <p className="success-message">
            Thank you for your order. We'll have it ready soon!
          </p>
        </div>

        {/* Order Info Card */}
        <div className="order-info-card">
          <div className="order-header">
            <div>
              <h2>Order #{order.orderNumber}</h2>
              <p className="order-date">
                {new Date(order.createdAt).toLocaleString('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            <Tag type={getStatusColor(order.status as OrderStatus)}>
              {getStatusLabel(order.status as OrderStatus)}
            </Tag>
          </div>

          {/* Customer Info */}
          {order.customer && (
            <div className="customer-info">
              <h3>Customer Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{order.customer.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{order.customer.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{order.customer.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="order-items-section">
            <h3>Order Items</h3>
            <div className="order-items-list">
              {order.items?.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-details">
                    <div className="item-header">
                      <span className="item-name">{item.menuItem?.name}</span>
                      <span className="item-quantity">x{item.quantity}</span>
                    </div>
                    
                    {item.options && item.options.length > 0 && (
                      <div className="item-options">
                        {item.options.map((opt) => (
                          <span key={opt.id} className="option-badge">
                            {opt.burgerOption?.name}
                            {opt.burgerOption?.priceModifier && 
                              Number(opt.burgerOption.priceModifier) > 0 && 
                              ` (+$${Number(opt.burgerOption.priceModifier).toFixed(2)})`
                            }
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {item.specialInstructions && (
                      <p className="item-instructions">
                        Note: {item.specialInstructions}
                      </p>
                    )}
                  </div>
                  <div className="item-price">
                    ${Number(item.subtotal).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${Number(order.subtotal).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>${Number(order.tax).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${Number(order.total).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="order-view-actions">
          <Button
            kind="secondary"
            renderIcon={Home}
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
          <Button onClick={() => navigate('/menu')}>
            Order More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderViewPage;

// Made with Bob
