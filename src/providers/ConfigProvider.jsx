import { createContext, useContext, useMemo } from "react";

const ConfigContext = createContext(undefined);

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }

  return context;
};

export const ConfigProvider = ({ children, config }) => {
  const value = useMemo(
    () => ({
      companyName: config.companyName,
    }),
    [config.companyName],
  );

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  );
};
