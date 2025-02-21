import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Token } from '../types';
import { Rocket, TrendingDown, TrendingUp, Activity, DollarSign, LineChart } from 'lucide-react';

interface TokenCardProps {
  token: Token;
}

export const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
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
        ['rgba(0, 255, 0, 0)', 'rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 1)', 'rgba(0, 255, 0, 0)'] :
        ['rgba(255, 0, 0, 0)', 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 1)', 'rgba(255, 0, 0, 0)'];

      controls.start({
        backgroundColor: flashColor,
        scale: [1, 1.8, 0.7, 1.8, 1],
        transition: {
          duration: 0.7,
          type: 'spring',
          bounce: 0.1,
          times: [0, 0.25, 0.5, 0.75, 1]
        }
      });

      setPrevValues({
        marketCap: token.marketCap,
        price: token.price,
        volume24h: token.volume24h
      });

      setTimeout(() => setHasChanged(false), 1000);
    }
  }, [token, prevValues, controls, isPositive]);

  return (
    <motion.div
      className="bg-gray-800/50 rounded-2xl p-6 border-2 border-gray-700 hover:bg-gray-800/70 hover:border-yellow-500 transition-all relative overflow-hidden group"
      initial={{ backgroundColor: 'transparent' }}
      animate={controls}
      whileHover={{ scale: 1.05 }}
    >
      {/* Hover effect gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-yellow-600/0 via-yellow-600/80 to-yellow-600/0 opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {/* Token Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{ rotate: hasChanged ? 720 : 0 }}
            transition={{ duration: 0.5 }}
            className="p-2 bg-purple-600/20 rounded-xl"
          >
            <Rocket className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-xl text-white">{token.symbol}</h3>
            <p className="text-gray-400 text-sm">{token.name}</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-colors z-10"
        >
          Trade
        </motion.button>
      </div>

      {/* Token Stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Price */}
        <motion.div 
          className="bg-gray-900/50 p-4 rounded-xl"
          animate={{
            scale: token.price !== prevValues.price ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Price</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            ${token.price.toFixed(5)}
          </div>
        </motion.div>

        {/* 24h Change */}
        <div className="bg-gray-900/50 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Activity className="w-4 h-4" />
            <span>24h Change</span>
          </div>
          <div className={`text-xl font-bold flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {token.change24h.toFixed(2)}%
          </div>
        </div>

        {/* Volume */}
        <motion.div 
          className="bg-gray-900/50 p-4 rounded-xl"
          animate={{
            scale: token.volume24h !== prevValues.volume24h ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <LineChart className="w-4 h-4" />
            <span>24h Volume</span>
          </div>
          <div className="text-xl font-bold text-white">
            ${token.volume24h.toLocaleString()}
          </div>
        </motion.div>

        {/* Market Cap */}
        <motion.div 
          className="bg-gray-900/50 p-4 rounded-xl"
          animate={{
            scale: token.marketCap !== prevValues.marketCap ? [1, 1.05, 1] : 1,
          }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Market Cap</span>
          </div>
          <div className="text-xl font-bold text-white">
            ${token.marketCap.toLocaleString()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};