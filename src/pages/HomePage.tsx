import React from "react";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useTokens } from "../hooks/useTokens";
import { TokenCard } from "../components/TokenCard";

export const HomePage: React.FC = () => {
  const { data: tokens = [], isLoading } = useTokens(20);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tokens.map((token) => (
            <TokenCard key={token.id} tokenInfo={token} />
          ))}
        </motion.div>

        <motion.div
          className="fixed bottom-4 right-4 flex items-center gap-2 text-sm bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Zap className="w-4 h-4" />
          {tokens.length} Tokens Live
        </motion.div>
      </main>
    </>
  );
};
