import { createContext, useCallback, useContext, useMemo, useState } from "react";

const INITIAL_CONTEXT = {
  state: "",
  district: "",
  season: "",
  mode: "",
  soil: null,
  weather: null,
  advisory: [],
  recommendations: [],
};

const AgriSenseContext = createContext(null);

export const AgriSenseProvider = ({ children }) => {
  const [agriSenseContext, setAgriSenseContext] = useState(INITIAL_CONTEXT);

  const updateAgriSenseContext = useCallback((data) => {
    setAgriSenseContext((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const clearAgriSenseContext = useCallback(() => {
    setAgriSenseContext(INITIAL_CONTEXT);
  }, []);

  const value = useMemo(
    () => ({
      agriSenseContext,
      updateAgriSenseContext,
      clearAgriSenseContext,
    }),
    [agriSenseContext, updateAgriSenseContext, clearAgriSenseContext]
  );

  return (
    <AgriSenseContext.Provider value={value}>
      {children}
    </AgriSenseContext.Provider>
  );
};

export const useAgriSenseContext = () => {
  const context = useContext(AgriSenseContext);

  if (!context) {
    throw new Error(
      "useAgriSenseContext must be used inside AgriSenseProvider"
    );
  }

  return context;
};

export default AgriSenseContext;