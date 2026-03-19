import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  TextInput,
  Button,
  InlineNotification,
  Loading,
  Tile,
} from '@carbon/react';
import { Search, ShoppingCart } from '@carbon/icons-react';
import '../styles/CustomerLookupPage.css';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

const CustomerLookupPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<CustomerData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setCustomer(null);

      const response = await fetch(
        `http://localhost:3001/api/customers/search?email=${encodeURIComponent(email)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          setError('No customer found with that email address');
        } else {
          setError('Failed to search for customer');
        }
        return;
      }

      const data = await response.json();
      setCustomer(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrders = () => {
    if (customer) {
      navigate(`/orders?customerId=${customer.id}`);
    }
  };

  return (
    <div className="customer-lookup-page">
      <div className="customer-lookup-header">
        <h1>Find Your Account</h1>
        <p>Look up your customer information and order history by email address</p>
      </div>

      <div className="customer-lookup-content">
        <Tile className="lookup-form-tile">
          <h2>Search by Email</h2>
          <Form onSubmit={handleSubmit}>
            <div className="form-group">
              <TextInput
                id="email"
                labelText="Email Address"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                type="email"
                required
              />
            </div>

            {error && (
              <InlineNotification
                kind="error"
                title="Error"
                subtitle={error}
                onClose={() => setError(null)}
                className="lookup-notification"
              />
            )}

            <Button
              type="submit"
              renderIcon={Search}
              disabled={loading}
              className="search-button"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Form>

          {loading && (
            <div className="loading-container">
              <Loading description="Searching for customer..." withOverlay={false} />
            </div>
          )}
        </Tile>

        {customer && (
          <Tile className="customer-info-tile">
            <h2>Customer Information</h2>
            
            <div className="customer-details">
              <div className="detail-row">
                <span className="detail-label">Customer ID:</span>
                <span className="detail-value">{customer.id}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Name:</span>
                <span className="detail-value">{customer.name}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{customer.email}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{customer.phone}</span>
              </div>
              
              <div className="detail-row">
                <span className="detail-label">Member Since:</span>
                <span className="detail-value">
                  {new Date(customer.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>

            <div className="customer-actions">
              <Button
                kind="primary"
                renderIcon={ShoppingCart}
                onClick={handleViewOrders}
              >
                View Order History
              </Button>
              
              <Button
                kind="secondary"
                onClick={() => {
                  setCustomer(null);
                  setEmail('');
                }}
              >
                Search Again
              </Button>
            </div>
          </Tile>
        )}
      </div>

      <div className="lookup-help">
        <Tile className="help-tile">
          <h3>Need Help?</h3>
          <p>
            If you can't find your account, make sure you're using the same email address 
            you used when placing your order. If you're still having trouble, please contact 
            our support team.
          </p>
        </Tile>
      </div>
    </div>
  );
};

export default CustomerLookupPage;

// Made with Bob
