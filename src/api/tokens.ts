import { faker } from "@faker-js/faker";
import { Token, TokenInfo, TokenDetails, UniverseLeaf } from "../types";

const UNIVERSE_BASE = "https://universe.lightning.finance/v1/taproot-assets";

const Universes = [
  "universe.lightning.finance",
  "assets.megalith-node.com",
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

async function fetchWithFallback(endpoint: string): Promise<Response> {
  for (const universe of Universes) {
    try {
      const url = `https://${universe}/v1/taproot-assets${endpoint}`;
      const response = await fetch(url);
      if (response.ok) return response;
    } catch (error) {
      console.warn(`Failed to fetch from ${universe}:`, error);
      continue;
    }
  }
  throw new Error("All universe servers failed");
}

export const tokensApi = {
  getTokens: async (count: number = 20): Promise<TokenInfo[]> => {
    const response = await fetch(`${UNIVERSE_BASE}/universe/roots`);
    if (!response.ok) {
      throw new Error("Failed to fetch tokens");
    }
    const data = await response.json();

    try {
      const rawAssets = Object.values(data.universe_roots);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const assets = rawAssets.slice(0, count).map((x: any) => {
        const data: TokenInfo = {
          name: x.asset_name,
          id: x.id.asset_id,
          supply: x.mssmt_root.root_sum,
        };
        return data;
      });
      return assets;
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getTokenDetails: async (id: string): Promise<TokenDetails> => {
    const response = await fetchWithFallback(
      `/universe/leaves/asset-id/${id}?proof_type=PROOF_TYPE_ISSUANCE`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch token details");
    }
    const data = await response.json();

    const leaves: UniverseLeaf[] = data.leaves || [];
    const firstLeaf = leaves[0];

    const genesis = firstLeaf?.asset?.genesis;

    return {
      assetId: id,
      name: genesis?.name || "Unknown",
      supply: firstLeaf?.asset?.amount
        ? parseInt(firstLeaf.asset.amount, 10)
        : 0,
      assetType: genesis?.asset_type || "NORMAL",
      genesisPoint: genesis?.genesis_point,
      metadata: genesis?.meta_hash,
      groupKey: firstLeaf?.asset?.asset_group?.tweaked_group_key,
      leaves,
    };
  },

  getUniverseStats: async (): Promise<{
    numTotalAssets: number;
    numTotalSyncs: number;
    numTotalProofs: number;
  }> => {
    const response = await fetchWithFallback("/universe/stats");
    if (!response.ok) {
      throw new Error("Failed to fetch universe stats");
    }
    const data = await response.json();
    return {
      numTotalAssets: parseInt(data.num_total_assets || "0", 10),
      numTotalSyncs: parseInt(data.num_total_syncs || "0", 10),
      numTotalProofs: parseInt(data.num_total_proofs || "0", 10),
    };
  },
};
