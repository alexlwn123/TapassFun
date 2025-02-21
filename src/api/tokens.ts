import { faker } from "@faker-js/faker";
import { Token } from "../types";

const generateToken = (): Token => ({
  id: faker.string.uuid(),
  name: faker.company.name() + "Coin",
  symbol: faker.string.alpha(3).toUpperCase(),
  price: faker.number.float({ min: 0.00001, max: 1000, precision: 0.00001 }),
  change24h: faker.number.float({ min: -50, max: 50, precision: 0.01 }),
  volume24h: faker.number.float({ min: 10000, max: 1000000, precision: 0.01 }),
  marketCap: faker.number.float({
    min: 100000,
    max: 10000000,
    precision: 0.01,
  }),
  lastUpdate: Date.now(),
});

export const tokensApi = {
  getTokens: async (count: number = 20): Promise<Token[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return Array.from({ length: count }, generateToken);
  },
};
