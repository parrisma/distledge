import { createContext, useContext, useState } from "react";

const Context = createContext();

export function OfferedOptionProvider({ children }) {
  const [offeredOpts, setOfferedOpts] = useState({});
  return (
    <Context.Provider value={[offeredOpts, setOfferedOpts]}>{children}</Context.Provider>
  );
}

export function useOfferedOptionContext() {
  return useContext(Context);
}