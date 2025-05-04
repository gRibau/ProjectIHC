import React, { createContext, useContext, useState } from 'react';

interface ActiveLinesContextType {
  activeLines: string[];
  setActiveLines: React.Dispatch<React.SetStateAction<string[]>>;
}

const ActiveLinesContext = createContext<ActiveLinesContextType | undefined>(undefined);

export const ActiveLinesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeLines, setActiveLines] = useState<string[]>([]);
  return (
    <ActiveLinesContext.Provider value={{ activeLines, setActiveLines }}>
      {children}
    </ActiveLinesContext.Provider>
  );
};

export function useActiveLines() {
  const context = useContext(ActiveLinesContext);
  if (!context) throw new Error('useActiveLines must be used within ActiveLinesProvider');
  return context;
} 