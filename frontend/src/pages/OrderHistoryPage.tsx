import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  TextInput,
  Loading,
  InlineNotification,
  Tag,
} from '@carbon/react';
import { View, Search } from '@carbon/icons-react';
import { OrderSummaryDto, OrderStatus } from '@burger-palace/shared';
import api from '../services/api';
import './OrderHistoryPage.css';

const OrderHistoryPage = () => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState('');
  const [orders, setOrders] = useState<OrderSummaryDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSearched(false);

    if (!customerId.trim()) {
      setError('Please enter a customer ID');
      return;
    }

    setLoading(true);

    try {
      const response = await api.get(`/orders/customer/${customerId.trim()}`);
      setOrders(response.data.data);
      setSearched(true);
    } catch (err: any) {
      console.error('Failed to fetch orders:', err);
      setError(
        err.response?.data?.message || 
        'Failed to load order history. Please check your customer ID.'
      );
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

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
        return 'Pending';
      case OrderStatus.PREPARING:
        return 'Preparing';
      case OrderStatus.READY:
        return 'Ready';
      case OrderStatus.COMPLETED:
        return 'Completed';
      case OrderStatus.CANCELLED:
        return 'Cancelled';
      default:
        return status;
    }
  };

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <h1>Order History</h1>
        <p className="page-subtitle">
          Enter your customer ID to view your past orders
        </p>

        {/* Search Form */}
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <TextInput
              id="customer-id"
              labelText="Customer ID"
              placeholder="Enter your customer ID (e.g., from your order confirmation email)"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              renderIcon={Search}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Orders'}
            </Button>
          </form>

          <div className="help-text">
            <p>
              💡 <strong>Tip:</strong> Your customer ID can be found in your order confirmation email.
              It's the unique identifier associated with your account.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onCloseButtonClick={() => setError(null)}
            lowContrast
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <Loading description="Loading your orders..." withOverlay={false} />
          </div>
        )}

        {/* Orders List */}
        {!loading && searched && orders.length === 0 && (
          <div className="no-orders">
            <h2>No Orders Found</h2>
            <p>You haven't placed any orders yet, or the customer ID is incorrect.</p>
            <Button onClick={() => navigate('/menu')}>
              Browse Menu
            </Button>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="orders-section">
            <h2>Your Orders ({orders.length})</h2>
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div className="order-info">
                      <h3>Order #{order.orderNumber}</h3>
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

                  <div className="order-card-body">
                    <div className="order-total">
                      <span className="total-label">Total:</span>
                      <span className="total-amount">
                        ${Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="order-card-footer">
                    <Button
                      kind="tertiary"
                      size="sm"
                      renderIcon={View}
                      onClick={() => navigate(`/order/${order.orderNumber}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;

// Made with Bob
