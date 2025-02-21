import { useState, useEffect } from 'react';
import { faker } from '@faker-js/faker';
import { Token } from '../types';

const generateToken = (): Token => ({
  id: faker.string.uuid(),
  name: faker.company.name() + 'Coin',
  symbol: faker.string.alpha(3).toUpperCase(),
  price: faker.number.float({ min: 0.00001, max: 1000, precision: 0.00001 }),
  change24h: faker.number.float({ min: -50, max: 50, precision: 0.01 }),
  volume24h: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
  marketCap: faker.number.float({ min: 100000, max: 10000000, precision: 0.01 }),
  lastUpdate: Date.now(),
});

export const useTokens = (count: number = 20) => {
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    // Initial tokens
    setTokens(Array.from({ length: count }, generateToken));

    // Update random tokens every second
    const interval = setInterval(() => {
      setTokens(currentTokens => {
        const newTokens = [...currentTokens];
        const numToUpdate = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numToUpdate; i++) {
          const indexToUpdate = Math.floor(Math.random() * newTokens.length);
          const token = newTokens[indexToUpdate];
          
          // Simulate more dramatic market cap changes
          const marketCapChange = Math.random() > 0.7 
            ? (1 + (Math.random() * 2 - 1)) // Large change (up to 100% up or down)
            : (1 + (Math.random() * 0.1 - 0.05)); // Small change (5% up or down)
          
          newTokens[indexToUpdate] = {
            ...token,
            price: token.price * (1 + (Math.random() * 0.2 - 0.1)),
            change24h: token.change24h + (Math.random() * 10 - 5),
            volume24h: token.volume24h * (1 + (Math.random() * 0.4 - 0.2)),
            marketCap: token.marketCap * marketCapChange,
            lastUpdate: Date.now(),
          };
        }
        
        return newTokens;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [count]);

  return tokens;
};