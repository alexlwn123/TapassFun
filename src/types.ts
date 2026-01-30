export type TokenInfo = Pick<Token, "id" | "name" | "supply">;

export type Token = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  lastUpdate: number;
  supply: number;
};

export interface TokenDetails {
  assetId: string;
  name: string;
  supply: number;
  assetType: string;
  genesisPoint?: string;
  genesisHeight?: number;
  metadata?: string;
  metadataDecoded?: Record<string, unknown>;
  groupKey?: string;
  leaves?: UniverseLeaf[];
}

export interface UniverseLeaf {
  asset: {
    genesis: {
      genesis_point: string;
      name: string;
      meta_hash: string;
      asset_id: string;
      asset_type: string;
      output_index: number;
    };
    amount: string;
    script_version: number;
    script_key: string;
    asset_group?: {
      raw_group_key: string;
      tweaked_group_key: string;
    };
  };
  issuance_proof: string;
}

export interface UniverseStats {
  numTotalAssets: number;
  numTotalSyncs: number;
  numTotalProofs: number;
}

export interface NostrUser {
  npub: string;
  pubkey: string;
  displayName?: string;
}

export interface MintFormData {
  name: string;
  symbol: string;
  supply: number;
  description: string;
  imageUrl: string;
  enableEmission: boolean;
}

export interface LightningInvoice {
  paymentRequest: string;
  paymentHash: string;
  amountSats: number;
  description: string;
  expiresAt: number;
}
