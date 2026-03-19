import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Checkbox,
  RadioButton,
  RadioButtonGroup,
  Loading,
  InlineNotification,
  Tile,
} from '@carbon/react';
import { ShoppingCart, Add } from '@carbon/icons-react';
import { useCart, CartItem } from '../context/CartContext';
import { MenuItemDto, BurgerOptionDto } from '@burger-palace/shared';
import '../styles/BurgerBuilderPage.css';

interface BurgerOption {
  id: string;
  optionType: 'CHEESE' | 'TOPPING' | 'CONDIMENT';
  name: string;
  priceModifier: number;
}

interface MenuItemWithCategory extends MenuItemDto {
  category: {
    name: string;
  };
}

interface BurgerBuilderState {
  baseItem: MenuItemWithCategory | null;
  selectedCheese: string | null;
  selectedToppings: string[];
  selectedCondiments: string[];
}

const BurgerBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [burgerItems, setBurgerItems] = useState<MenuItemWithCategory[]>([]);
  const [cheeseOptions, setCheeseOptions] = useState<BurgerOption[]>([]);
  const [toppingOptions, setToppingOptions] = useState<BurgerOption[]>([]);
  const [condimentOptions, setCondimentOptions] = useState<BurgerOption[]>([]);
  
  const [builder, setBuilder] = useState<BurgerBuilderState>({
    baseItem: null,
    selectedCheese: null,
    selectedToppings: [],
    selectedCondiments: [],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch menu items (burgers)
      const menuResponse = await fetch('http://localhost:3001/api/menu');
      if (!menuResponse.ok) throw new Error('Failed to fetch menu');
      const menuData = await menuResponse.json();
      
      const burgers = menuData.data.filter(
        (item: MenuItemWithCategory) => item.category.name === 'Burgers'
      );
      setBurgerItems(burgers);
      
      // Set default burger if available
      if (burgers.length > 0 && !builder.baseItem) {
        setBuilder(prev => ({ ...prev, baseItem: burgers[0] }));
      }

      // Fetch burger options
      const optionsResponse = await fetch('http://localhost:3001/api/menu/burger-options');
      if (!optionsResponse.ok) throw new Error('Failed to fetch options');
      const optionsData = await optionsResponse.json();

      const cheese = optionsData.data.filter((opt: BurgerOption) => opt.optionType === 'CHEESE');
      const toppings = optionsData.data.filter((opt: BurgerOption) => opt.optionType === 'TOPPING');
      const condiments = optionsData.data.filter((opt: BurgerOption) => opt.optionType === 'CONDIMENT');

      setCheeseOptions(cheese);
      setToppingOptions(toppings);
      setCondimentOptions(condiments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = (): number => {
    if (!builder.baseItem) return 0;

    let total = builder.baseItem.basePrice;

    // Add cheese price
    if (builder.selectedCheese) {
      const cheese = cheeseOptions.find(opt => opt.id === builder.selectedCheese);
      if (cheese) total += cheese.priceModifier;
    }

    // Add topping prices
    builder.selectedToppings.forEach(toppingId => {
      const topping = toppingOptions.find(opt => opt.id === toppingId);
      if (topping) total += topping.priceModifier;
    });

    // Add condiment prices (all free, but included for completeness)
    builder.selectedCondiments.forEach(condimentId => {
      const condiment = condimentOptions.find(opt => opt.id === condimentId);
      if (condiment) total += condiment.priceModifier;
    });

    return total;
  };

  const handleBaseItemChange = (selection: string | number | undefined) => {
    if (typeof selection !== 'string') return;
    const itemId = selection;
    const item = burgerItems.find(b => b.id === itemId);
    if (item) {
      setBuilder(prev => ({ ...prev, baseItem: item }));
    }
  };

  const handleCheeseChange = (selection: string | number | undefined) => {
    if (typeof selection !== 'string') return;
    const cheeseId = selection;
    setBuilder(prev => ({ ...prev, selectedCheese: cheeseId }));
  };

  const handleToppingToggle = (toppingId: string) => {
    setBuilder(prev => ({
      ...prev,
      selectedToppings: prev.selectedToppings.includes(toppingId)
        ? prev.selectedToppings.filter(id => id !== toppingId)
        : [...prev.selectedToppings, toppingId],
    }));
  };

  const handleCondimentToggle = (condimentId: string) => {
    setBuilder(prev => ({
      ...prev,
      selectedCondiments: prev.selectedCondiments.includes(condimentId)
        ? prev.selectedCondiments.filter(id => id !== condimentId)
        : [...prev.selectedCondiments, condimentId],
    }));
  };

  const handleAddToCart = () => {
    if (!builder.baseItem) return;

    const selectedOptionObjects: BurgerOptionDto[] = [];
    
    if (builder.selectedCheese) {
      const cheese = cheeseOptions.find(opt => opt.id === builder.selectedCheese);
      if (cheese) selectedOptionObjects.push(cheese as BurgerOptionDto);
    }
    
    builder.selectedToppings.forEach(toppingId => {
      const topping = toppingOptions.find(opt => opt.id === toppingId);
      if (topping) selectedOptionObjects.push(topping as BurgerOptionDto);
    });
    
    builder.selectedCondiments.forEach(condimentId => {
      const condiment = condimentOptions.find(opt => opt.id === condimentId);
      if (condiment) selectedOptionObjects.push(condiment as BurgerOptionDto);
    });

    // Convert MenuItemWithCategory to MenuItemDto for cart
    const { category, ...menuItemDto } = builder.baseItem;
    
    const cartItem: CartItem = {
      id: `${builder.baseItem.id}-${Date.now()}`,
      menuItem: menuItemDto as MenuItemDto,
      quantity: 1,
      selectedOptions: selectedOptionObjects,
    };

    addItem(cartItem);

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const getOptionName = (optionId: string): string => {
    const allOptions = [...cheeseOptions, ...toppingOptions, ...condimentOptions];
    const option = allOptions.find(opt => opt.id === optionId);
    return option ? option.name : '';
  };

  if (loading) {
    return (
      <div className="burger-builder-loading">
        <Loading description="Loading burger builder..." withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="burger-builder-error">
        <InlineNotification
          kind="error"
          title="Error"
          subtitle={error}
          onClose={() => setError(null)}
        />
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="burger-builder-page">
      <div className="burger-builder-header">
        <h1>Build Your Burger</h1>
        <p>Customize your perfect burger with our fresh ingredients</p>
      </div>

      {success && (
        <InlineNotification
          kind="success"
          title="Success"
          subtitle="Burger added to cart!"
          onClose={() => setSuccess(false)}
          className="burger-builder-notification"
        />
      )}

      <div className="burger-builder-content">
        <div className="burger-builder-options">
          {/* Base Burger Selection */}
          <Tile className="builder-section">
            <h2>1. Choose Your Base</h2>
            <RadioButtonGroup
              name="base-burger"
              valueSelected={builder.baseItem?.id || ''}
              onChange={handleBaseItemChange}
            >
              {burgerItems.map(item => (
                <RadioButton
                  key={item.id}
                  id={item.id}
                  labelText={`${item.name} - $${item.basePrice.toFixed(2)}`}
                  value={item.id}
                />
              ))}
            </RadioButtonGroup>
            {builder.baseItem && (
              <p className="item-description">{builder.baseItem.description}</p>
            )}
          </Tile>

          {/* Cheese Selection */}
          <Tile className="builder-section">
            <h2>2. Add Cheese (+$1.00)</h2>
            <RadioButtonGroup
              name="cheese"
              valueSelected={builder.selectedCheese || ''}
              onChange={handleCheeseChange}
            >
              <RadioButton
                id="no-cheese"
                labelText="No Cheese"
                value=""
              />
              {cheeseOptions.map(cheese => (
                <RadioButton
                  key={cheese.id}
                  id={cheese.id}
                  labelText={cheese.name}
                  value={cheese.id}
                />
              ))}
            </RadioButtonGroup>
          </Tile>

          {/* Toppings Selection */}
          <Tile className="builder-section">
            <h2>3. Select Toppings</h2>
            <p className="section-note">Free toppings and premium options available</p>
            <div className="checkbox-group">
              {toppingOptions.map(topping => (
                <Checkbox
                  key={topping.id}
                  id={topping.id}
                  labelText={
                    topping.priceModifier > 0
                      ? `${topping.name} (+$${topping.priceModifier.toFixed(2)})`
                      : topping.name
                  }
                  checked={builder.selectedToppings.includes(topping.id)}
                  onChange={() => handleToppingToggle(topping.id)}
                />
              ))}
            </div>
          </Tile>

          {/* Condiments Selection */}
          <Tile className="builder-section">
            <h2>4. Choose Condiments</h2>
            <p className="section-note">All condiments are free</p>
            <div className="checkbox-group">
              {condimentOptions.map(condiment => (
                <Checkbox
                  key={condiment.id}
                  id={condiment.id}
                  labelText={condiment.name}
                  checked={builder.selectedCondiments.includes(condiment.id)}
                  onChange={() => handleCondimentToggle(condiment.id)}
                />
              ))}
            </div>
          </Tile>
        </div>

        {/* Order Summary */}
        <div className="burger-builder-summary">
          <Tile className="summary-tile">
            <h2>Your Burger</h2>
            
            {builder.baseItem && (
              <div className="summary-content">
                <div className="summary-item">
                  <span className="summary-label">Base:</span>
                  <span className="summary-value">
                    {builder.baseItem.name}
                    <span className="summary-price">${builder.baseItem.basePrice.toFixed(2)}</span>
                  </span>
                </div>

                {builder.selectedCheese && (
                  <div className="summary-item">
                    <span className="summary-label">Cheese:</span>
                    <span className="summary-value">
                      {getOptionName(builder.selectedCheese)}
                      <span className="summary-price">
                        +${cheeseOptions.find(c => c.id === builder.selectedCheese)?.priceModifier.toFixed(2)}
                      </span>
                    </span>
                  </div>
                )}

                {builder.selectedToppings.length > 0 && (
                  <div className="summary-item">
                    <span className="summary-label">Toppings:</span>
                    <div className="summary-list">
                      {builder.selectedToppings.map(toppingId => {
                        const topping = toppingOptions.find(t => t.id === toppingId);
                        return (
                          <div key={toppingId} className="summary-list-item">
                            {topping?.name}
                            {topping && topping.priceModifier > 0 && (
                              <span className="summary-price">+${topping.priceModifier.toFixed(2)}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {builder.selectedCondiments.length > 0 && (
                  <div className="summary-item">
                    <span className="summary-label">Condiments:</span>
                    <div className="summary-list">
                      {builder.selectedCondiments.map(condimentId => (
                        <div key={condimentId} className="summary-list-item">
                          {getOptionName(condimentId)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="summary-total">
                  <span className="total-label">Total Price:</span>
                  <span className="total-price">${totalPrice.toFixed(2)}</span>
                </div>

                <div className="summary-actions">
                  <Button
                    kind="primary"
                    renderIcon={Add}
                    onClick={handleAddToCart}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    kind="secondary"
                    renderIcon={ShoppingCart}
                    onClick={() => navigate('/checkout')}
                  >
                    Go to Checkout
                  </Button>
                </div>
              </div>
            )}
          </Tile>
        </div>
      </div>
    </div>
  );
};

export default BurgerBuilderPage;

// Made with Bob
