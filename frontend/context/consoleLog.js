import { createContext, useContext, useState } from "react";

const Context = createContext();

export function ConsoleLogProvider({ children }) {
  const [logs, setLogs] = useState(['Console start!']);
  return (
    <Context.Provider value={[logs, setLogs]}>{children}</Context.Provider>
  );
}

export function useConsoleLogContext() {
  return useContext(Context);
}