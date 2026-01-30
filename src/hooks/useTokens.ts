import { useQuery } from "@tanstack/react-query";
import { tokensApi } from "../api/tokens";
import { TokenInfo, TokenDetails } from "../types";

export const useTokens = (count: number = 20) => {
  return useQuery<TokenInfo[]>({
    queryKey: ["tokens", count],
    queryFn: () => tokensApi.getTokens(count),
  });
};

export const useTokenDetails = (id: string) => {
  return useQuery<TokenDetails>({
    queryKey: ["tokenDetails", id],
    queryFn: () => tokensApi.getTokenDetails(id),
    enabled: !!id,
  });
};

export const useUniverseStats = () => {
  return useQuery({
    queryKey: ["universeStats"],
    queryFn: () => tokensApi.getUniverseStats(),
  });
};
