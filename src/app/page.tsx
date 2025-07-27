"use client";

import React, { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ItemDetailModal } from "@/components/ItemDetailModal";
import { CheckoutModal } from "@/components/CheckoutModal";
import { NotificationSystem, useNotifications } from "@/components/NotificationSystem";
import { Search, Grid, List, ShoppingCart as CartIcon, Star, Eye } from "lucide-react";
import { allItems, categories, rarities } from "@/data/marketplace-data";
import type { ItemType, CartItemType } from "@/types/marketplace";

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedRarity, setSelectedRarity] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [cartItems, setCartItems] = useState<CartItemType[]>([]);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('arcanis-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('arcanis-cart');
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('arcanis-cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('arcanis-cart');
    }
  }, [cartItems]);
  const [showCart, setShowCart] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  const {
    notifications,
    removeNotification,
    showSuccess,
    showError,
    showCartAdd
  } = useNotifications();

  // Filter items based on search and filters
  const filteredItems = allItems.filter((item: ItemType) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesRarity = selectedRarity === "All" || item.rarity === selectedRarity;
    return matchesSearch && matchesCategory && matchesRarity;
  });

  const handleAddToCart = (item: ItemType, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        showCartAdd(item.name, () => setShowCart(true));
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      showCartAdd(item.name, () => setShowCart(true));
      return [...prev, { ...item, quantity }];
    });
  };

  const handleViewItem = (item: ItemType) => {
    setSelectedItem(item);
    setShowItemModal(true);
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePurchaseComplete = () => {
    const itemCount = getTotalItems();
    setCartItems([]);
    setShowCheckout(false);
    showSuccess(
      'Purchase Complete!', 
      `Successfully purchased ${itemCount} item${itemCount > 1 ? 's' : ''}. Items have been added to your inventory.`,
      6000
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-gradient-to-b from-background/70 via-background/50 to-background/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Subtitle */}
            <div className="mb-6">
              <span className="text-primary font-display text-sm tracking-[0.3em] uppercase">
                ARCANIS MARKETPLACE
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black mb-6 leading-tight">
              <span className="text-foreground">TRADE </span>
              <span className="text-primary glitch-text">EVERYTHING</span>
            </h1>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-xl md:text-2xl font-display font-bold mb-4 text-foreground">
                FROM WEAPONS TO AUGMENTATIONS. YOUR LEGEND AWAITS.
              </h2>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search weapons, armor, augmentations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-gaming-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary cyberpunk-border"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-2 h-2 bg-primary neon-glow hidden lg:block" />
        <div className="absolute bottom-20 left-20 w-1 h-1 bg-accent hidden lg:block" />
        <div className="absolute top-1/2 left-10 w-px h-20 bg-gradient-to-b from-transparent via-primary to-transparent hidden lg:block" />
        <div className="absolute top-1/2 right-10 w-px h-16 bg-gradient-to-b from-transparent via-accent to-transparent hidden lg:block" />
      </section>

      {/* Filters and Controls */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-card border border-gaming-border rounded-lg text-foreground cyberpunk-border"
          >
            <option value="All">All Categories</option>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="px-4 py-2 bg-card border border-gaming-border rounded-lg text-foreground cyberpunk-border"
          >
            <option value="All">All Rarities</option>
            {rarities.map(rarity => (
              <option key={rarity.name} value={rarity.name}>{rarity.name}</option>
            ))}
          </select>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 border border-gaming-border rounded cyberpunk-border ${
                viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 border border-gaming-border rounded cyberpunk-border ${
                viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(!showCart)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground border border-gaming-border rounded cyberpunk-border neon-glow"
          >
            <CartIcon className="w-5 h-5" />
            Cart ({getTotalItems()})
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground font-mono">
            Showing {filteredItems.length} items
          </p>
        </div>

        {/* Items Grid */}
        <div className={viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card cyberpunk-border rounded-lg overflow-hidden neon-glow group hover:bg-card/80 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src={item.imageUrl || "/items/rifle.jpg"}
                  alt={item.name}
                  className="w-full h-48 object-cover pixelated"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-primary text-primary-foreground text-sm rounded font-mono">
                  {item.rarity}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleViewItem(item)}
                    className="p-2 bg-secondary text-foreground rounded cyberpunk-border"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleAddToCart(item, 1)}
                    className="p-2 bg-primary text-primary-foreground rounded cyberpunk-border"
                  >
                    <CartIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-foreground mb-2 font-display">{item.name}</h3>
                <p className="text-muted-foreground text-sm mb-3 font-mono">{item.description}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl text-primary font-bold font-mono">${item.price}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={`${
                          index < (item.seller.rating || 4) ? 'text-primary' : 'text-muted-foreground'
                        }`}
                        fill={index < (item.seller.rating || 4) ? 'currentColor' : 'none'}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground mb-3 font-mono">
                  Sold by: {item.seller.name || 'Unknown Vendor'}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewItem(item)}
                    className="flex-1 px-3 py-2 bg-secondary text-foreground border border-gaming-border rounded cyberpunk-border hover:bg-gaming-border transition-colors font-mono"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleAddToCart(item, 1)}
                    className="flex-1 px-3 py-2 bg-primary text-primary-foreground border border-gaming-border rounded cyberpunk-border neon-glow hover:bg-primary/90 transition-colors font-mono"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-mono text-lg">No items found matching your criteria.</p>
          </div>
        )}

        {/* Shopping Cart Sidebar */}
        {showCart && (
          <div className="fixed right-0 top-0 h-full w-96 bg-card border-l border-gaming-border cyberpunk-border z-50 p-6 overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">Shopping Cart</h2>
              <button
                onClick={() => setShowCart(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>
            
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground font-mono">Your cart is empty</p>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-secondary rounded cyberpunk-border">
                    <img src={item.imageUrl || "/items/rifle.jpg"} alt={item.name} className="w-16 h-16 object-cover rounded pixelated" />
                    <div className="flex-1">
                      <h3 className="font-display font-bold text-sm">{item.name}</h3>
                      <p className="text-primary font-mono">${item.price}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center bg-card text-foreground rounded border border-gaming-border text-sm"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-mono text-sm">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center bg-card text-foreground rounded border border-gaming-border text-sm"
                        >
                          +
                        </button>
                        <button
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="ml-2 text-destructive hover:text-destructive/80 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-4 border-t border-gaming-border">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-display font-bold">Total:</span>
                    <span className="text-primary font-mono font-bold">
                      ${getTotalPrice()}
                    </span>
                  </div>
                  <button 
                    onClick={handleCheckout}
                    className="w-full px-4 py-3 bg-primary text-primary-foreground rounded cyberpunk-border neon-glow font-display font-bold hover:bg-primary/90 transition-colors"
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer />
      
      {/* Item Detail Modal */}
      {selectedItem && (
        <ItemDetailModal
          item={selectedItem}
          isOpen={showItemModal}
          onClose={() => {
            setShowItemModal(false);
            setSelectedItem(null);
          }}
          onAddToCart={handleAddToCart}
        />
      )}
      
      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        onPurchaseComplete={handlePurchaseComplete}
      />
      
      {/* Notification System */}
      <NotificationSystem
        notifications={notifications}
        onRemove={removeNotification}
      />
    </div>
  );
}
