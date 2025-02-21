import { useQuery } from "@tanstack/react-query";
import { tokensApi } from "../api/tokens";
import { Token } from "../types";

export const useTokens = (count: number = 20) => {
  return useQuery<Token[]>({
    queryKey: ["tokens", count],
    queryFn: () => tokensApi.getTokens(count),
  });
};
