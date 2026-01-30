import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Skull, Sparkles, LogOut, User } from "lucide-react";
import { useNostrContext } from "../context/NostrContext";

export const Header: React.FC = () => {
  const { user, login, logout, isConnecting } = useNostrContext();

  return (
    <header className="border-b border-gray-800 bg-gray-900/95 sticky top-0 backdrop-blur-sm z-20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/">
            <motion.div
              className="flex items-center gap-2 text-3xl font-bold text-purple-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Rocket className="w-10 h-10" />
              <span>TAPASS.FUN</span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-3">
            <Link to="/mint">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full font-bold hover:bg-green-500 transition-colors text-sm"
              >
                <Sparkles className="w-4 h-4" />
                Mint
              </motion.button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full text-sm">
                  <User className="w-4 h-4 text-purple-400" />
                  <span className="text-gray-300 font-mono text-xs">
                    {user.npub.slice(0, 12)}...
                  </span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="flex items-center gap-2 bg-gray-700 px-3 py-2 rounded-full font-bold hover:bg-gray-600 transition-colors text-sm"
                  title="Disconnect"
                >
                  <LogOut className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={login}
                disabled={isConnecting}
                className="flex items-center gap-2 bg-purple-600 px-6 py-2 rounded-full font-bold hover:bg-purple-500 transition-colors disabled:opacity-50"
              >
                <Skull className="w-5 h-5" />
                {isConnecting ? "Connecting..." : "Connect"}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
