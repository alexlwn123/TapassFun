import { useQuery } from "@tanstack/react-query";
import { tokensApi } from "../api/tokens";
import { Token, TokenInfo } from "../types";

export const useTokens = (count: number = 20) => {
  return useQuery<TokenInfo[]>({
    queryKey: ["tokens", count],
    queryFn: () => tokensApi.getTokens(count),
  });
};

export const useTokenDetails = (id: string) => {
  return useQuery<Token>({
    queryKey: ["tokenDetails", id],
    queryFn: () => tokensApi.getTokenDetails(id),
  });
};
