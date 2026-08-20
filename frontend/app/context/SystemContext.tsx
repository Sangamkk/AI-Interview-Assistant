"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

type Theme = "default" | "light" | "dark";

interface SystemContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;

  soundEnabled: boolean;
  setSoundEnabled: (value: boolean) => void;

  helpOpen: boolean;
  setHelpOpen: (value: boolean) => void;

  systemInfoOpen: boolean;
  setSystemInfoOpen: (value: boolean) => void;
}

const SystemContext = createContext<SystemContextType | undefined>(
  undefined
);

export function SystemProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setTheme] = useState<Theme>("default");
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [helpOpen, setHelpOpen] = useState(false);
  const [systemInfoOpen, setSystemInfoOpen] = useState(false);

  return (
    <SystemContext.Provider
      value={{
        theme,
        setTheme,
        soundEnabled,
        setSoundEnabled,
        helpOpen,
        setHelpOpen,
        systemInfoOpen,
        setSystemInfoOpen,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const context = useContext(SystemContext);

  if (!context) {
    throw new Error(
      "useSystem must be used inside SystemProvider"
    );
  }

  return context;
}