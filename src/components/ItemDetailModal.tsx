"use client"

import React, { useState } from 'react'
import { X, ShoppingCart, Star, TrendingUp, Shield, Zap, Target, Crosshair } from 'lucide-react'
import { ItemType } from '@/types/marketplace'
import { allItems } from '@/data/marketplace-data'
import { Button } from '@/components/ui/button'

interface ItemDetailModalProps {
  item: ItemType
  isOpen: boolean
  onClose: () => void
  onAddToCart: (item: ItemType, quantity: number) => void
}

export function ItemDetailModal({ item, isOpen, onClose, onAddToCart }: ItemDetailModalProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (!isOpen) return null

  // Get related items from the same category
  const relatedItems = allItems
    .filter(i => i.category === item.category && i.id !== item.id)
    .slice(0, 3)

  const handleAddToCart = () => {
    onAddToCart(item, quantity)
    onClose()
  }

  const StatBar = ({ label, value, icon: Icon }: { label: string; value: number; icon: React.ComponentType<{ className?: string }> }) => (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-primary" />
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-muted-foreground">{label}</span>
          <span className="text-sm font-mono text-primary">{value}%</span>
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-primary to-primary-glow h-2 rounded-full transition-all duration-500"
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto cyberpunk-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-orbitron text-primary">{item.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm font-mono ${
                item.rarity === 'Legendary' ? 'text-yellow-400' :
                item.rarity === 'Epic' ? 'text-purple-400' :
                item.rarity === 'Rare' ? 'text-blue-400' :
                'text-gray-400'
              }`}>
                {item.rarity}
              </span>
              <span className="text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{item.category}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Left Column - Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden cyberpunk-border neon-glow">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover pixelated"
              />
            </div>
            
            {/* Additional images placeholder */}
            <div className="grid grid-cols-4 gap-2">
              {[item.imageUrl, item.imageUrl, item.imageUrl, item.imageUrl].map((img, idx) => (
                <div 
                  key={idx}
                  className={`aspect-square rounded cyberpunk-border cursor-pointer overflow-hidden ${
                    selectedImage === idx ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(idx)}
                >
                  <img
                    src={img}
                    alt={`${item.name} view ${idx + 1}`}
                    className="w-full h-full object-cover pixelated"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-orbitron text-primary">${item.price}</span>
                {item.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">${item.originalPrice}</span>
                    <span className="bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-mono">
                      -{item.discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Instant digital delivery</p>
            </div>

            {/* Seller Info */}
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-lg cyberpunk-border">
              <img
                src={item.seller.avatar}
                alt={item.seller.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-mono text-foreground">{item.seller.name}</p>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-mono text-muted-foreground">{item.seller.rating}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="font-mono">
                View Shop
              </Button>
            </div>

            {/* Stats */}
            {item.stats && (
              <div className="space-y-4">
                <h3 className="text-lg font-orbitron text-primary">Item Statistics</h3>
                <div className="space-y-3">
                  <StatBar label="Damage" value={item.stats.damage || 0} icon={Zap} />
                  <StatBar label="Accuracy" value={item.stats.accuracy || 0} icon={Target} />
                  <StatBar label="Range" value={item.stats.range || 0} icon={Crosshair} />
                  <StatBar label="Stability" value={item.stats.stability || 0} icon={Shield} />
                </div>
              </div>
            )}

            {/* Quantity and Purchase */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-mono text-muted-foreground">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 p-0"
                  >
                    -
                  </Button>
                  <span className="w-12 text-center font-mono">{quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="arcanis-button"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">
                  Buy Now
                </Button>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-orbitron text-primary">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.description || "No description available for this item."}
              </p>
            </div>
          </div>
        </div>

        {/* Related Items */}
        {relatedItems.length > 0 && (
          <div className="border-t border-border p-6">
            <h3 className="text-lg font-orbitron text-primary mb-4">Related Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedItems.map((relatedItem) => (
                <div key={relatedItem.id} className="bg-secondary rounded-lg p-4 cyberpunk-border hover:neon-glow transition-all cursor-pointer">
                  <img
                    src={relatedItem.imageUrl}
                    alt={relatedItem.name}
                    className="w-full aspect-square object-cover rounded pixelated mb-3"
                  />
                  <h4 className="font-orbitron text-sm text-foreground mb-1">{relatedItem.name}</h4>
                  <p className="text-primary font-mono">${relatedItem.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}