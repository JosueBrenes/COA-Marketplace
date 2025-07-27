"use client"

import { Button } from "@/components/button"
import type { CategoryType, RarityType } from "@/types/marketplace"

interface FilterSidebarProps {
  categories: CategoryType[]
  rarities: RarityType[]
  selectedCategories: string[]
  selectedRarities: string[]
  priceRange: number[]
  onToggleCategory: (category: string) => void
  onToggleRarity: (rarity: string) => void
  onPriceRangeChange: (value: number[]) => void
  onClearFilters: () => void
}

export function FilterSidebar({
  categories,
  rarities,
  selectedCategories,
  selectedRarities,
  priceRange,
  onToggleCategory,
  onToggleRarity,
  onPriceRangeChange,
  onClearFilters,
}: FilterSidebarProps) {
  return (
    <div className="bg-gray-900/80 rounded-lg p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">Filters</h2>
        <Button
          onClick={onClearFilters}
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
        >
          Clear All
        </Button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between">
              <button
                onClick={() => onToggleCategory(category.name)}
                className={`flex items-center text-sm transition-colors ${
                  selectedCategories.includes(category.name)
                    ? 'text-cyan-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <span className={`w-3 h-3 mr-2 border rounded ${
                  selectedCategories.includes(category.name)
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-gray-600'
                }`} />
                {category.name}
              </button>
              <span className="text-xs text-gray-500">{category.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rarity */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Rarity</h3>
        <div className="space-y-2">
          {rarities.map((rarity) => (
            <button
              key={rarity.name}
              onClick={() => onToggleRarity(rarity.name)}
              className={`flex items-center text-sm transition-colors ${
                selectedRarities.includes(rarity.name)
                  ? 'text-cyan-400'
                  : `${rarity.color} hover:text-white`
              }`}
            >
              <span className={`w-3 h-3 mr-2 border rounded ${
                selectedRarities.includes(rarity.name)
                  ? 'bg-cyan-500 border-cyan-500'
                  : 'border-gray-600'
              }`} />
              {rarity.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="font-semibold text-white mb-3">Price Range</h3>
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>{priceRange[0]} STRK</span>
          <span>{priceRange[1]} STRK</span>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          Use sliders to adjust price range
        </div>
      </div>
    </div>
  )
}

