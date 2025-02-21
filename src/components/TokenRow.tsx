import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Token } from '../types';
import { Rocket, TrendingDown, TrendingUp } from 'lucide-react';

interface TokenRowProps {
  token: Token;
}

export const TokenRow: React.FC<TokenRowProps> = ({ token }) => {
  const isPositive = token.change24h > 0;
  const controls = useAnimation();
  const [hasChanged, setHasChanged] = useState(false);
  const [prevValues, setPrevValues] = useState({
    marketCap: token.marketCap,
    price: token.price,
    volume24h: token.volume24h
  });

  useEffect(() => {
    const valueChanged = 
      token.marketCap !== prevValues.marketCap ||
      token.price !== prevValues.price ||
      token.volume24h !== prevValues.volume24h;

    if (valueChanged) {
      setHasChanged(true);
      const flashColor = isPositive ? 
        ['transparent', 'rgba(255, 255, 0, 0.8)', 'rgba(255, 255, 0, 0.4)', 'transparent'] :
        ['transparent', 'rgba(255, 0, 0, 0.8)', 'rgba(255, 0, 0, 0.4)', 'transparent'];

      controls.start({
        backgroundColor: flashColor,
        scale: [1, 1.3, 0.75, 1.3, 0.9, 1],
        transition: {
          duration: 0.5,
          times: [0, 0.2, 0.5, 1]
        }
      });

      setPrevValues({
        marketCap: token.marketCap,
        price: token.price,
        volume24h: token.volume24h
      });

      setTimeout(() => setHasChanged(false), 700);
    }
  }, [token, prevValues, controls, isPositive]);

  return (
    <div className="grid grid-cols-7 gap-4 p-4 border-b border-gray-800 hover:bg-gray-800/50 cursor-pointer relative overflow-hidden group">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/50 to-yellow-400/0 opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.5, repeat: Infinity }}
      />

      <motion.div
        className="col-span-6 grid grid-cols-6 gap-4"
        initial={{ backgroundColor: 'transparent' }}
        animate={controls}
      >
        <div className="flex items-center gap-2 relative">
          <motion.div
            animate={{ rotate: hasChanged ? 720 : 0 }}
            transition={{ duration: 0.5 }}
          >
            <Rocket className="w-6 h-6 text-purple-400" />
          </motion.div>
          <span className="font-bold text-white">{token.symbol}</span>
        </div>
        
        <div className="text-gray-300 relative">{token.name}</div>
        
        <motion.div 
          className="font-mono text-white relative"
          animate={{
            scale: token.price !== prevValues.price ? [1, 2, 1, 2, 1, 2] : 1,
            color: token.price !== prevValues.price ? 
              [isPositive ? '#22c55e' : '#ef4444', '#ffffff'] : '#ffffff'
          }}
          transition={{ duration: 0.4 }}
        >
          ${token.price.toFixed(5)}
        </motion.div>
        
        <div className={`flex items-center gap-1 ${isPositive ? 'text-yellow-300' : 'text-red-500'} relative`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          {token.change24h.toFixed(2)}%
        </div>
        
        <motion.div 
          className="text-gray-300 relative"
          animate={{
            scale: token.volume24h !== prevValues.volume24h ? [1, 1.5, 1] : 1,
            color: token.volume24h !== prevValues.volume24h ? 
              ['#ffffff', '#FFFF00', '#ffffff'] : '#ffffff'
          }}
          transition={{ duration: 0.4 }}
        >
          ${token.volume24h.toLocaleString()}
        </motion.div>
        
        <motion.div 
          className="text-gray-300 relative"
          animate={{
            scale: token.marketCap !== prevValues.marketCap ? [1, 1.2, 1] : 1,
            color: token.marketCap !== prevValues.marketCap ? 
              ['#ffffff', '#a855f7', '#ffffff'] : '#ffffff'
          }}
          transition={{ duration: 0.5 }}
        >
          ${token.marketCap.toLocaleString()}
        </motion.div>
      </motion.div>

      <motion.div 
        className="flex justify-end relative"
        whileHover={{ scale: 1.1 }}
      >
        <button className="my-auto px-4 py-1 bg-purple-600 text-white rounded-full hover:bg-purple-500 transition-colors">
          Trade
        </button>
      </motion.div>
    </div>
  );
};