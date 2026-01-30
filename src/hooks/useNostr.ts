import { useState, useCallback, useEffect } from "react";
import { nip19 } from "nostr-tools";
import { NostrUser } from "../types";

// NIP-07 window.nostr interface
declare global {
  interface Window {
    nostr?: {
      getPublicKey(): Promise<string>;
      signEvent(event: Record<string, unknown>): Promise<Record<string, unknown>>;
      getRelays?(): Promise<Record<string, { read: boolean; write: boolean }>>;
      nip04?: {
        encrypt(pubkey: string, plaintext: string): Promise<string>;
        decrypt(pubkey: string, ciphertext: string): Promise<string>;
      };
    };
    webln?: {
      enable(): Promise<void>;
      sendPayment(paymentRequest: string): Promise<{ preimage: string }>;
      makeInvoice(args: {
        amount: number;
        defaultMemo?: string;
      }): Promise<{ paymentRequest: string }>;
    };
  }
}

const STORAGE_KEY = "tapass_nostr_user";

function loadStoredUser(): NostrUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  return null;
}

export function useNostr() {
  const [user, setUser] = useState<NostrUser | null>(loadStoredUser);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasExtension, setHasExtension] = useState(false);

  useEffect(() => {
    // Check for NIP-07 extension availability (may load async)
    const check = () => setHasExtension(!!window.nostr);
    check();
    const timer = setTimeout(check, 1000);
    return () => clearTimeout(timer);
  }, []);

  const login = useCallback(async () => {
    setError(null);
    setIsConnecting(true);

    try {
      if (!window.nostr) {
        throw new Error(
          "No Nostr extension found. Install Alby or nos2x to continue."
        );
      }

      const pubkey = await window.nostr.getPublicKey();
      const npub = nip19.npubEncode(pubkey);

      const nostrUser: NostrUser = {
        npub,
        pubkey,
        displayName: npub.slice(0, 12) + "...",
      };

      setUser(nostrUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nostrUser));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to connect Nostr";
      setError(message);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    user,
    isConnecting,
    error,
    hasExtension,
    login,
    logout,
  };
}
