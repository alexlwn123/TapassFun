import React, { useEffect, useMemo, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { TokenInfo } from '../types';
import { Rocket, TrendingDown, TrendingUp, Activity, DollarSign, LineChart } from 'lucide-react';
// import { useTokenDetails } from '../hooks/useTokens';
import { generateToken } from '../api/tokens';

interface TokenCardProps {
  tokenInfo: TokenInfo;
}

export const TokenCard: React.FC<TokenCardProps> = ({ tokenInfo }) => {
  // const { data } = useTokenDetails(tokenInfo.id);
  const [simulatedToken, setSimulatedToken] = useState<typeof token>();
  const token = useMemo(() => tokenInfo ? generateToken(tokenInfo) : undefined, [tokenInfo]);
  
  // Use the simulated token values when available, otherwise fall back to the static token
  const displayToken = simulatedToken ?? token;
  const isPositive = displayToken?.change24h ?? 0 > 0;
  
  // Animation controls for individual elements
  const priceControls = useAnimation();
  const volumeControls = useAnimation();
  const marketCapControls = useAnimation();
  const iconControls = useAnimation();
  const cardControls = useAnimation();
  const changeControls = useAnimation();
  
  const [hasChanged, setHasChanged] = useState(false);
  const [prevValues, setPrevValues] = useState({
    marketCap: token?.marketCap,
    price: token?.price,
    volume24h: token?.volume24h
  });

  // Simulation effect
  useEffect(() => {
    if (!token) return;

    const simulateChanges = () => {
      const randomPercentage = () => (Math.random() - 0.5) * 0.05; // ±2.5% change
      
      setSimulatedToken({
        ...token,
        price: token.price * (1 + randomPercentage()),
        marketCap: token.marketCap * (1 + randomPercentage()),
        volume24h: token.volume24h * (1 + randomPercentage()),
        change24h: token.change24h + randomPercentage() * 10, // More volatile
      });
    };

    const intervalId = setInterval(simulateChanges, 1000 + Math.random() * 7000);

    return () => clearInterval(intervalId);
  }, [token]);

  useEffect(() => {
    const currentToken = simulatedToken ?? token;
    const valueChanged = 
      currentToken?.marketCap !== prevValues.marketCap ||
      currentToken?.price !== prevValues.price ||
      currentToken?.volume24h !== prevValues.volume24h;

    if (valueChanged) {
      setHasChanged(true);
      
      // Animate the icon with violent rotation and scaling
      iconControls.start({
        rotate: [0, -180, 720, 360],
        scale: [1, 1.5, 0.7, 1.2, 1],
        x: [0, -5, 8, -3, 0],
        y: [0, 5, -8, 3, 0],
        transition: { 
          duration: 0.8,
          ease: "easeOut"
        }
      });
      
      // Animate the entire card with subtle distortion
      cardControls.start({
        scale: [1, 1.02, 0.98, 1.01, 1],
        rotate: [0, -1, 2, -1, 0],
        x: [0, -3, 5, -2, 0],
        filter: ["blur(0px)", "blur(1px)", "blur(0px)", "blur(0.5px)", "blur(0px)"],
        transition: { 
          duration: 0.8,
          ease: "easeOut"
        }
      });
      
      // Animate the change indicator with a pulse
      changeControls.start({
        scale: [1, 1.3, 1],
        rotate: isPositive ? [0, 5, 0] : [0, -5, 0],
        transition: { 
          duration: 0.5,
          ease: "easeOut"
        }
      });
      
      // Animate individual stat boxes based on which value changed with more extreme effects
      if (currentToken?.price !== prevValues.price) {
        priceControls.start({
          scale: [1, 1.3, 0.8, 1.1, 1],
          rotate: [0, -2, 3, -1, 0],
          x: [0, -5, 8, -3, 0],
          backgroundColor: [
            "rgba(30, 30, 30, 0.5)",
            isPositive ? "rgba(0, 100, 0, 0.6)" : "rgba(100, 0, 0, 0.6)",
            "rgba(30, 30, 30, 0.5)"
          ],
          transition: { 
            duration: 0.7,
            ease: "easeOut",
            times: [0, 0.4, 0.6, 0.8, 1]
          }
        });
      }
      
      if (currentToken?.volume24h !== prevValues.volume24h) {
        volumeControls.start({
          scale: [1, 0.9, 1.2, 0.95, 1],
          rotate: [0, 2, -3, 1, 0],
          y: [0, 5, -8, 3, 0],
          backgroundColor: [
            "rgba(30, 30, 30, 0.5)",
            isPositive ? "rgba(0, 100, 0, 0.6)" : "rgba(100, 0, 0, 0.6)",
            "rgba(30, 30, 30, 0.5)"
          ],
          transition: { 
            duration: 0.7,
            ease: "easeOut",
            times: [0, 0.3, 0.5, 0.7, 1]
          }
        });
      }
      
      if (currentToken?.marketCap !== prevValues.marketCap) {
        marketCapControls.start({
          scale: [1, 1.2, 0.85, 1.1, 1],
          rotate: [0, -3, 2, -1, 0],
          x: [0, 8, -5, 2, 0],
          backgroundColor: [
            "rgba(30, 30, 30, 0.5)",
            isPositive ? "rgba(0, 100, 0, 0.6)" : "rgba(100, 0, 0, 0.6)",
            "rgba(30, 30, 30, 0.5)"
          ],
          transition: { 
            duration: 0.7,
            ease: "easeOut",
            times: [0, 0.2, 0.4, 0.6, 1]
          }
        });
      }

      setPrevValues({
        marketCap: currentToken?.marketCap,
        price: currentToken?.price,
        volume24h: currentToken?.volume24h
      });
      
      setTimeout(() => setHasChanged(false), 800);
    }
  }, [simulatedToken, token, prevValues, priceControls, volumeControls, marketCapControls, iconControls, cardControls, changeControls, isPositive]);

  return (
    <motion.div
      className="bg-gray-800/50 rounded-2xl p-6 border-2 border-gray-700 hover:bg-gray-800/70 hover:border-yellow-500 transition-all relative overflow-hidden group"
      whileHover={{ scale: 1.05 }}
      animate={cardControls}
    >
      {/* Distortion overlay - only visible during changes */}
      {hasChanged && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-yellow-500/20 to-cyan-500/10 mix-blend-overlay"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0.3, 0.5, 0],
            backgroundPosition: ["0% 0%", "100% 100%"]
          }}
          transition={{ duration: 0.8 }}
        />
      )}
      
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
            animate={iconControls}
            className="p-2 bg-purple-600/20 rounded-xl"
          >
            <Rocket className="w-6 h-6 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="font-bold text-xl text-white">{displayToken?.symbol}</h3>
            <p className="text-gray-400 text-sm">{displayToken?.name}</p>
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
          className="bg-gray-900/50 p-4 rounded-xl relative overflow-hidden"
          animate={priceControls}
        >
          {hasChanged && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.4 }}
            />
          )}
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Price</span>
          </div>
          <div className="text-xl font-mono font-bold text-white">
            ${displayToken?.price?.toFixed(5)}
          </div>
        </motion.div>

        {/* 24h Change */}
        <motion.div 
          className="bg-gray-900/50 p-4 rounded-xl"
          animate={changeControls}
        >
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Activity className="w-4 h-4" />
            <span>24h Change</span>
          </div>
          <div className={`text-xl font-bold flex items-center gap-2 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            {displayToken?.change24h?.toFixed(2)}%
          </div>
        </motion.div>

        {/* Volume */}
        <motion.div 
          className="bg-gray-900/50 p-4 rounded-xl relative overflow-hidden"
          animate={volumeControls}
        >
          {hasChanged && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />
          )}
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <LineChart className="w-4 h-4" />
            <span>24h Volume</span>
          </div>
          <div className="text-xl font-bold text-white">
            ${displayToken?.volume24h?.toLocaleString()}
          </div>
        </motion.div>

        {/* Market Cap */}
        <motion.div 
          className="bg-gray-900/50 p-4 rounded-xl relative overflow-hidden"
          animate={marketCapControls}
        >
          {hasChanged && (
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{ duration: 0.4, delay: 0.2 }}
            />
          )}
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <DollarSign className="w-4 h-4" />
            <span>Market Cap</span>
          </div>
          <div className="text-xl font-bold text-white">
            ${displayToken?.marketCap?.toLocaleString()}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};