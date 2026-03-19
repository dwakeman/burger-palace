import { useState, useEffect } from 'react';
import { Loading, Button, InlineNotification } from '@carbon/react';
import { ShoppingCart } from '@carbon/icons-react';
import { menuService } from '../services/menuService';
import { MenuDto, MenuItemDto } from '@burger-palace/shared';
import { useCart } from '../context/CartContext';
import './MenuPage.css';

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addedItemId, setAddedItemId] = useState<string | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await menuService.getFullMenu();
        setMenu(data);
      } catch (err) {
        setError('Failed to load menu. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleAddToCart = (item: MenuItemDto) => {
    const cartItem = {
      id: `${item.id}-${Date.now()}`, // Unique ID for cart item
      menuItem: item,
      quantity: 1,
      selectedOptions: [], // No options selected for simple add
      specialInstructions: undefined,
    };
    
    addItem(cartItem);
    setAddedItemId(item.id);
    
    // Clear notification after 2 seconds
    setTimeout(() => {
      setAddedItemId(null);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="menu-page-loading">
        <Loading description="Loading menu..." withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="menu-page-error">
        <h2>Oops!</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="menu-page">
      <h1>Our Menu</h1>
      <p className="menu-subtitle">Build your perfect burger and choose your sides</p>
      
      {addedItemId && (
        <InlineNotification
          kind="success"
          title="Added to cart!"
          subtitle="Item has been added to your cart"
          lowContrast
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}
      
      {menu && (
        <div className="menu-content">
          <section className="menu-section">
            <h2>🍔 Burgers</h2>
            <div className="menu-grid">
              {menu.items
                .filter((item: MenuItemDto) => item.categoryId === menu.categories.find((c: any) => c.name === 'Burgers')?.id)
                .map((item: MenuItemDto) => (
                  <div key={item.id} className="menu-item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="card-footer">
                      <p className="price">${Number(item.basePrice).toFixed(2)}</p>
                      <Button
                        size="sm"
                        renderIcon={ShoppingCart}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="menu-section">
            <h2>🍟 Sides</h2>
            <div className="menu-grid">
              {menu.items
                .filter((item: MenuItemDto) => item.categoryId === menu.categories.find((c: any) => c.name === 'Sides')?.id)
                .map((item: MenuItemDto) => (
                  <div key={item.id} className="menu-item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="card-footer">
                      <p className="price">${Number(item.basePrice).toFixed(2)}</p>
                      <Button
                        size="sm"
                        renderIcon={ShoppingCart}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          <section className="menu-section">
            <h2>🥤 Drinks</h2>
            <div className="menu-grid">
              {menu.items
                .filter((item: MenuItemDto) => item.categoryId === menu.categories.find((c: any) => c.name === 'Drinks')?.id)
                .map((item: MenuItemDto) => (
                  <div key={item.id} className="menu-item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <div className="card-footer">
                      <p className="price">${Number(item.basePrice).toFixed(2)}</p>
                      <Button
                        size="sm"
                        renderIcon={ShoppingCart}
                        onClick={() => handleAddToCart(item)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default MenuPage;

// Made with Bob
