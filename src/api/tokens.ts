import { faker } from "@faker-js/faker";
import { Token, TokenInfo } from "../types";

const Universes = [
  "assets.megalith-node.com",
  "universe.lightning.finance",
  "universe.tiramisuwallet.com",
  "universe.nostrassets.com",
] as const;

export const generateToken = (token: Partial<Token>): Token => ({
  id: token.id || faker.string.uuid(),
  name: token.name || faker.company.name() + "Coin",
  symbol: token.symbol || faker.string.alpha(3).toUpperCase(),
  price:
    token.price ||
    faker.number.float({ min: 0.00001, max: 1000, multipleOf: 0.00001 }),
  change24h:
    token.change24h ||
    faker.number.float({ min: -50, max: 50, multipleOf: 0.01 }),
  volume24h:
    token.volume24h ||
    faker.number.float({ min: 10000, max: 1000000, multipleOf: 0.01 }),
  marketCap:
    token.marketCap ||
    faker.number.float({
      min: 100000,
      max: 10000000,
      multipleOf: 0.01,
    }),
  lastUpdate: token.lastUpdate || Date.now(),
  supply: token.supply || faker.number.int({ min: 1000000, max: 1000000000 }),
});

export const tokensApi = {
  getTokens: async (count: number = 20): Promise<TokenInfo[]> => {
    // Simulate API delay

    const response = await fetch(
      "https://universe.lightning.finance/v1/taproot-assets/universe/roots"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch tokens");
    }
    // Extract name, asset_id for future lookup, root_sum for supply
    // TODO: add validation
    const data = await response.json();

    try {
      console.log(data);
      const rawAssets = Object.values(data.universe_roots);
      const assets = rawAssets.slice(0, count).map((x: any) => {
        const data: TokenInfo = {
          name: x.asset_name,
          id: x.id.asset_id,
          supply: x.mssmt_root.root_sum,
        };
        return data;
      });
      console.log(assets);
      return assets;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getTokenDetails: async (id: string): Promise<Token> => {
    const response = await fetch(
      `https://universe.lightning.finance/v1/taproot-assets/universe/leaves/asset-id/${id}?proof_type=PROOF_TYPE_ISSUANCE`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch token details");
    }
    const data = await response.json();
    console.log("here", data.leaves);
    return data;
  },
};
