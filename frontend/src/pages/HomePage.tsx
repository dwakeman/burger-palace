import { Link } from 'react-router-dom';
import { Button } from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="hero-title">🍔 Welcome to Burger Palace</h1>
        <p className="hero-subtitle">
          Build your perfect burger with premium 1/4 lb patties, fresh toppings, and delicious sides
        </p>
        <div className="hero-actions">
          <Button
            as={Link}
            to="/menu"
            size="lg"
            renderIcon={ArrowRight}
          >
            Order Now
          </Button>
        </div>
      </div>

      <div className="features-section">
        <div className="feature-card">
          <h3>🥩 Premium Patties</h3>
          <p>Choose from single, double, or triple 1/4 lb patties</p>
        </div>
        <div className="feature-card">
          <h3>🧀 5 Cheese Options</h3>
          <p>American, Cheddar, Swiss, Pepper Jack, or Blue Cheese</p>
        </div>
        <div className="feature-card">
          <h3>🥗 Fresh Toppings</h3>
          <p>Customize with lettuce, tomato, onions, pickles, and more</p>
        </div>
        <div className="feature-card">
          <h3>🍟 Delicious Sides</h3>
          <p>Fries, tots, onion rings, or cheese curds</p>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to order?</h2>
        <p>Create your perfect meal in just a few clicks</p>
        <Button as={Link} to="/menu" kind="secondary" size="lg">
          View Menu
        </Button>
      </div>
    </div>
  );
};

export default HomePage;

// Made with Bob
