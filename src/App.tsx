import { motion } from 'framer-motion';
import { useTokens } from './hooks/useTokens';
import { TokenCard } from './components/TokenRow';
import { Footer } from './components/Footer';
import { Skull, Rocket, Zap } from 'lucide-react';

function App() {
  const { data: tokens = [], isLoading } = useTokens(20);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">

      <header className="border-b border-gray-800 bg-gray-900/95 sticky top-0 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <motion.div
              className="flex items-center gap-2 text-3xl font-bold text-purple-400"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Rocket className="w-10 h-10" />
              <span>TAPASS.FUN</span>
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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {tokens.map(token => (
            <TokenCard key={token.id} token={token} />
          ))}
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
      <Footer />
    </div>
  );
}

export default App;