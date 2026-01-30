import React, { createContext, useContext } from "react";
import { useNostr } from "../hooks/useNostr";
import { NostrUser } from "../types";

interface NostrContextValue {
  user: NostrUser | null;
  isConnecting: boolean;
  error: string | null;
  hasExtension: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const NostrContext = createContext<NostrContextValue | null>(null);

export const NostrProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const nostr = useNostr();

  return (
    <NostrContext.Provider value={nostr}>{children}</NostrContext.Provider>
  );
};

export function useNostrContext(): NostrContextValue {
  const ctx = useContext(NostrContext);
  if (!ctx) {
    throw new Error("useNostrContext must be used within a NostrProvider");
  }
  return ctx;
}
