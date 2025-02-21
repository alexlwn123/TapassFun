import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTokens } from './hooks/useTokens';
import { TokenRow } from './components/TokenRow';
import { Skull, Rocket, Zap } from 'lucide-react';

function App() {
  const tokens = useTokens(20);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowWarning(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {showWarning && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          className="fixed top-0 left-0 right-0 bg-red-600 p-4 text-center font-bold"
        >
          ⚠️ WARNING: CONTAINS FLASHING LIGHTS AND ANIMATIONS ⚠️
        </motion.div>
      )}

      <header className="border-b border-gray-800 bg-gray-900/95 sticky top-0 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 text-3xl font-bold text-purple-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Rocket className="w-10 h-10" />
              <span>PUMP.LOL</span>
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 bg-purple-600 px-6 py-2 rounded-full font-bold hover:bg-purple-500 transition-colors"
            >
              <Skull className="w-5 h-5" />
              Connect Wallet
            </motion.button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/50 rounded-xl overflow-hidden shadow-2xl"
        >
          <div className="grid grid-cols-7 gap-4 p-4 bg-gray-800 font-semibold text-gray-400">
            <div>Token</div>
            <div>Name</div>
            <div>Price</div>
            <div>24h Change</div>
            <div>24h Volume</div>
            <div>Market Cap</div>
            <div></div>
          </div>

          <div className="divide-y divide-gray-800">
            {tokens.map(token => (
              <TokenRow key={token.id} token={token} />
            ))}
          </div>
        </motion.div>

        <motion.div
          className="fixed bottom-4 right-4 flex items-center gap-2 text-sm bg-purple-600/90 backdrop-blur-sm px-4 py-2 rounded-full"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, -2, 0]
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Zap className="w-4 h-4" />
          {tokens.length} Tokens Live
        </motion.div>
      </main>
    </div>
  );
}

export default App;