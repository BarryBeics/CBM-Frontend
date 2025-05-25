import { createContext, useContext, useState } from "react";

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [showComplete, setShowComplete] = useState(false);
  const [showSomedayMaybe, setShowSomedayMaybe] = useState(false);

  return (
    <SettingsContext.Provider
      value={{ showComplete, setShowComplete, showSomedayMaybe, setShowSomedayMaybe }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
