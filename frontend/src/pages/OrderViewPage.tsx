import { useParams } from 'react-router-dom';

const OrderViewPage = () => {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  return (
    <div className="order-view-page">
      <h1>Order Details</h1>
      <p>Order Number: {orderNumber}</p>
      <p>Order view functionality coming soon...</p>
    </div>
  );
};

export default OrderViewPage;

// Made with Bob
