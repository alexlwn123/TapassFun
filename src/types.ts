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
