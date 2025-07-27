import { useState } from "react";

export function useMarketplaceFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 600]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleRarity = (rarity: string) => {
    setSelectedRarities(prev => 
      prev.includes(rarity) 
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRarities([]);
    setPriceRange([0, 600]);
  };

  return {
    selectedCategories,
    selectedRarities,
    priceRange,
    toggleCategory,
    toggleRarity,
    setPriceRange,
    clearFilters,
  };
}
