import { Link } from 'react-router-dom';
import {
  Header as CarbonHeader,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
  HeaderGlobalAction,
} from '@carbon/react';
import { ShoppingCart } from '@carbon/icons-react';
import { useCart } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const { getTotalItems } = useCart();
  const cartItemCount = getTotalItems();

  return (
    <CarbonHeader aria-label="Burger Palace">
      <HeaderName element={Link} to="/" prefix="">
        🍔 Burger Palace
      </HeaderName>
      <HeaderNavigation aria-label="Main Navigation">
        <HeaderMenuItem element={Link} to="/menu">
          Menu
        </HeaderMenuItem>
        <HeaderMenuItem element={Link} to="/build">
          Build a Burger
        </HeaderMenuItem>
        <HeaderMenuItem element={Link} to="/orders">
          Track Order
        </HeaderMenuItem>
      </HeaderNavigation>
      <HeaderGlobalBar>
        <HeaderGlobalAction
          aria-label={`Shopping cart with ${cartItemCount} items`}
          tooltipAlignment="end"
          onClick={() => (window.location.href = '/checkout')}
        >
          <ShoppingCart size={20} />
          {cartItemCount > 0 && (
            <span className="cart-badge">{cartItemCount}</span>
          )}
        </HeaderGlobalAction>
      </HeaderGlobalBar>
    </CarbonHeader>
  );
};

export default Header;

// Made with Bob
