import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Copy,
  ExternalLink,
  Boxes,
  Hash,
  FileText,
  Layers,
  Shield,
} from "lucide-react";
import { useTokenDetails } from "../hooks/useTokens";
import { generateToken } from "../api/tokens";

export const TokenDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: details, isLoading, isError, error } = useTokenDetails(id || "");

  // Generate simulated market data from the real name/supply
  const simulatedMarket = useMemo(() => {
    if (!details) return null;
    return generateToken({
      id: details.assetId,
      name: details.name,
      supply: details.supply,
    });
  }, [details]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateId = (str: string, len = 16) => {
    if (!str || str.length <= len) return str || "—";
    return str.slice(0, len / 2) + "..." + str.slice(-len / 2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Zap className="w-8 h-8 text-purple-400" />
        </motion.div>
      </div>
    );
  }

  if (isError || !details) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-red-400">
          {error instanceof Error ? error.message : "Failed to load token"}
        </p>
        <Link
          to="/"
          className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to tokens
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back navigation */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tokens
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-purple-600/20 rounded-xl">
              <Boxes className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{details.name}</h1>
              <p className="text-gray-400">
                {details.assetType === "COLLECTIBLE" ? "Collectible" : "Normal"}{" "}
                Taproot Asset
              </p>
            </div>
          </div>
        </motion.div>

        {/* Simulated Market Data Banner */}
        {simulatedMarket && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4 mb-6"
          >
            <p className="text-yellow-400 text-sm mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Simulated market data — real pricing coming soon
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-xs">Price</p>
                <p className="text-white font-mono font-bold">
                  ${simulatedMarket.price.toFixed(5)}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">24h Change</p>
                <p
                  className={`font-bold ${
                    simulatedMarket.change24h >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {simulatedMarket.change24h >= 0 ? "+" : ""}
                  {simulatedMarket.change24h.toFixed(2)}%
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Volume (24h)</p>
                <p className="text-white font-mono">
                  ${simulatedMarket.volume24h.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Market Cap</p>
                <p className="text-white font-mono">
                  ${simulatedMarket.marketCap.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* On-Chain Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Asset Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-400" />
              Asset Info
            </h2>
            <div className="space-y-4">
              <InfoRow
                label="Asset ID"
                value={truncateId(details.assetId, 24)}
                fullValue={details.assetId}
                onCopy={copyToClipboard}
              />
              <InfoRow label="Name" value={details.name} />
              <InfoRow
                label="Type"
                value={
                  details.assetType === "COLLECTIBLE"
                    ? "Collectible (NFT)"
                    : "Normal (Fungible)"
                }
              />
              <InfoRow
                label="Total Supply"
                value={details.supply.toLocaleString()}
              />
            </div>
          </motion.div>

          {/* Genesis Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Hash className="w-5 h-5 text-purple-400" />
              Genesis Data
            </h2>
            <div className="space-y-4">
              {details.genesisPoint && (
                <InfoRow
                  label="Genesis Point"
                  value={truncateId(details.genesisPoint, 24)}
                  fullValue={details.genesisPoint}
                  onCopy={copyToClipboard}
                />
              )}
              {details.metadata && (
                <InfoRow
                  label="Meta Hash"
                  value={truncateId(details.metadata, 24)}
                  fullValue={details.metadata}
                  onCopy={copyToClipboard}
                />
              )}
              {details.groupKey && (
                <InfoRow
                  label="Group Key"
                  value={truncateId(details.groupKey, 24)}
                  fullValue={details.groupKey}
                  onCopy={copyToClipboard}
                />
              )}
              {!details.genesisPoint &&
                !details.metadata &&
                !details.groupKey && (
                  <p className="text-gray-500 text-sm">
                    No genesis data available
                  </p>
                )}
            </div>
          </motion.div>
        </div>

        {/* Issuance Proofs */}
        {details.leaves && details.leaves.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 mb-8"
          >
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              Issuance Events ({details.leaves.length})
            </h2>
            <div className="space-y-3">
              {details.leaves.map((leaf, i) => (
                <div
                  key={i}
                  className="bg-gray-900/50 rounded-xl p-4 border border-gray-700/50"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Amount</p>
                      <p className="text-white font-mono">
                        {parseInt(leaf.asset.amount, 10).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">Script Key</p>
                      <p className="text-white font-mono text-xs">
                        {truncateId(leaf.asset.script_key, 20)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-1">
                        Genesis Point
                      </p>
                      <p className="text-white font-mono text-xs">
                        {truncateId(leaf.asset.genesis.genesis_point, 20)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Universe Explorer Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href={`https://universe.lightning.finance/v1/taproot-assets/universe/leaves/asset-id/${details.assetId}?proof_type=PROOF_TYPE_ISSUANCE`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors bg-purple-600/10 px-4 py-2 rounded-lg border border-purple-600/20"
          >
            <ExternalLink className="w-4 h-4" />
            View on Universe Explorer
          </a>
          {details.genesisPoint && (
            <a
              href={`https://mempool.space/tx/${details.genesisPoint.split(":")[0]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors bg-purple-600/10 px-4 py-2 rounded-lg border border-purple-600/20"
            >
              <Shield className="w-4 h-4" />
              View Genesis TX on Mempool
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Helper component for key-value info rows
const InfoRow: React.FC<{
  label: string;
  value: string;
  fullValue?: string;
  onCopy?: (v: string) => void;
}> = ({ label, value, fullValue, onCopy }) => (
  <div className="flex justify-between items-start gap-2">
    <span className="text-gray-400 text-sm shrink-0">{label}</span>
    <div className="flex items-center gap-1.5 min-w-0">
      <span className="text-white text-sm font-mono truncate">{value}</span>
      {fullValue && onCopy && (
        <button
          onClick={() => onCopy(fullValue)}
          className="text-gray-500 hover:text-purple-400 transition-colors shrink-0"
          title="Copy to clipboard"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  </div>
);
