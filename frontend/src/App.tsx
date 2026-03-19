import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Theme } from '@carbon/react';
import { CartProvider } from './context/CartContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import BurgerBuilderPage from './pages/BurgerBuilderPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderViewPage from './pages/OrderViewPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import CustomerLookupPage from './pages/CustomerLookupPage';
import './App.css';

function App() {
  return (
    <Theme theme="white">
      <CartProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/build" element={<BurgerBuilderPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:orderNumber" element={<OrderViewPage />} />
                <Route path="/orders" element={<OrderHistoryPage />} />
                <Route path="/account" element={<CustomerLookupPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </Theme>
  );
}

export default App;

// Made with Bob
