import { useState, useEffect } from 'react';
import { Loading } from '@carbon/react';
import { menuService } from '../services/menuService';
import { MenuDto } from '@burger-palace/shared';
import './MenuPage.css';

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      
      {menu && (
        <div className="menu-content">
          <section className="menu-section">
            <h2>🍔 Burgers</h2>
            <div className="menu-grid">
              {menu.items
                .filter(item => item.categoryId === menu.categories.find(c => c.name === 'Burgers')?.id)
                .map(item => (
                  <div key={item.id} className="menu-item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">${Number(item.basePrice).toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </section>

          <section className="menu-section">
            <h2>🍟 Sides</h2>
            <div className="menu-grid">
              {menu.items
                .filter(item => item.categoryId === menu.categories.find(c => c.name === 'Sides')?.id)
                .map(item => (
                  <div key={item.id} className="menu-item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">${Number(item.basePrice).toFixed(2)}</p>
                  </div>
                ))}
            </div>
          </section>

          <section className="menu-section">
            <h2>🥤 Drinks</h2>
            <div className="menu-grid">
              {menu.items
                .filter(item => item.categoryId === menu.categories.find(c => c.name === 'Drinks')?.id)
                .map(item => (
                  <div key={item.id} className="menu-item-card">
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    <p className="price">${Number(item.basePrice).toFixed(2)}</p>
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
