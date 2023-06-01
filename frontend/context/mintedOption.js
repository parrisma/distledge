import { createContext, useContext, useState } from "react";

const Context = createContext();

export function MintedOptionProvider({ children }) {
  const [mintedOpts, setMinedOpts] = useState({});
  return (
    <Context.Provider value={[mintedOpts, setMinedOpts]}>{children}</Context.Provider>
  );
}

export function useMintedOptionContext() {
  return useContext(Context);
}