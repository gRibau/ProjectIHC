import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavouritesContextType {
  favouriteLines: string[];
  recentlyUnfavorited: string[];
  toggleFavouriteLine: (lineId: string) => void;
  clearRecentlyUnfavorited: () => void;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(undefined);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favouriteLines, setFavouriteLines] = useState<string[]>([]);
  const [recentlyUnfavorited, setRecentlyUnfavorited] = useState<string[]>([]);

  const toggleFavouriteLine = (lineId: string) => {
    if (favouriteLines.includes(lineId)) {
      // When unfavoriting, add to recentlyUnfavorited
      setRecentlyUnfavorited((prev) => [...prev, lineId]);
      setFavouriteLines((prev) => prev.filter((id) => id !== lineId));
    } else {
      // When favoriting, remove from recentlyUnfavorited if it's there
      setRecentlyUnfavorited((prev) => prev.filter((id) => id !== lineId));
      setFavouriteLines((prev) => [...prev, lineId]);
    }
  };

  const clearRecentlyUnfavorited = () => {
    setRecentlyUnfavorited([]);
  };

  return (
    <FavouritesContext.Provider 
      value={{ 
        favouriteLines, 
        recentlyUnfavorited,
        toggleFavouriteLine,
        clearRecentlyUnfavorited
      }}
    >
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const context = useContext(FavouritesContext);
  if (context === undefined) {
    throw new Error('useFavourites must be used within a FavouritesProvider');
  }
  return context;
} 