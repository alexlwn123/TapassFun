import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Zap,
  Rocket,
  Sparkles,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useNostrContext } from "../context/NostrContext";
import { MintFormData } from "../types";

type MintStep = "form" | "confirm" | "payment" | "success";

export const MintPage: React.FC = () => {
  const { user, login } = useNostrContext();
  const [step, setStep] = useState<MintStep>("form");
  const [formData, setFormData] = useState<MintFormData>({
    name: "",
    symbol: "",
    supply: 1000000,
    description: "",
    imageUrl: "",
    enableEmission: false,
  });
  const [invoice, setInvoice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedFeeSats = 5000; // placeholder minting fee

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number"
          ? parseInt(value, 10) || 0
          : type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const isFormValid =
    formData.name.trim().length > 0 &&
    formData.symbol.trim().length > 0 &&
    formData.symbol.trim().length <= 8 &&
    formData.supply > 0;

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setStep("confirm");
  };

  const handleConfirm = useCallback(async () => {
    setIsSubmitting(true);

    try {
      // Try WebLN first for seamless UX
      if (window.webln) {
        try {
          await window.webln.enable();
          const { paymentRequest } = await window.webln.makeInvoice({
            amount: estimatedFeeSats,
            defaultMemo: `Mint ${formData.name} (${formData.symbol}) - ${formData.supply} units`,
          });
          setInvoice(paymentRequest);
          setStep("payment");
          return;
        } catch {
          // WebLN not available or user rejected, fall back to QR
        }
      }

      // Generate a placeholder invoice for demo
      // In production, this would call the Lnfi SDK or your own tapd
      const demoInvoice = generateDemoInvoice(formData);
      setInvoice(demoInvoice);
      setStep("payment");
    } catch (err) {
      console.error("Failed to create invoice:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const handlePaymentComplete = () => {
    setStep("success");
  };

  const handleCopyInvoice = () => {
    if (invoice) {
      navigator.clipboard.writeText(invoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to tokens
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-400" />
            Mint Taproot Asset
          </h1>
          <p className="text-gray-400 mt-2">
            Create a new asset on the Bitcoin network using the Taproot Assets
            protocol
          </p>
        </motion.div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {(["form", "confirm", "payment", "success"] as MintStep[]).map(
            (s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step === s
                      ? "bg-purple-600 text-white"
                      : i <
                          ["form", "confirm", "payment", "success"].indexOf(step)
                        ? "bg-green-600 text-white"
                        : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 3 && (
                  <div
                    className={`flex-1 h-0.5 ${
                      i <
                      ["form", "confirm", "payment", "success"].indexOf(step)
                        ? "bg-green-600"
                        : "bg-gray-700"
                    }`}
                  />
                )}
              </React.Fragment>
            )
          )}
        </div>

        {/* Auth gate */}
        {!user && step === "form" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-6 mb-6"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-yellow-400 font-medium">
                  Connect with Nostr to mint
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  You need a Nostr identity to sign the minting attestation.
                  Install Alby or nos2x browser extension.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={login}
                  className="mt-3 bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Connect Nostr
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1: Form */}
          {step === "form" && (
            <motion.form
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSubmitForm}
              className="space-y-6"
            >
              <FormField label="Token Name" required>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. My Stablecoin"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                  maxLength={64}
                />
              </FormField>

              <FormField label="Symbol" required>
                <input
                  type="text"
                  name="symbol"
                  value={formData.symbol}
                  onChange={handleInputChange}
                  placeholder="e.g. MYST"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors uppercase"
                  maxLength={8}
                />
              </FormField>

              <FormField label="Total Supply" required>
                <input
                  type="number"
                  name="supply"
                  value={formData.supply}
                  onChange={handleInputChange}
                  placeholder="1000000"
                  min={1}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors font-mono"
                />
              </FormField>

              <FormField label="Description">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your token..."
                  rows={3}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  maxLength={256}
                />
              </FormField>

              <FormField label="Image URL">
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/token-icon.png"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </FormField>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="enableEmission"
                  id="enableEmission"
                  checked={formData.enableEmission}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 accent-purple-600"
                />
                <label htmlFor="enableEmission" className="text-sm">
                  <span className="text-white">Enable ongoing emission</span>
                  <span className="text-gray-400 block text-xs">
                    Creates a grouped asset that allows minting more supply later
                  </span>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={!isFormValid}
                whileHover={isFormValid ? { scale: 1.02 } : {}}
                whileTap={isFormValid ? { scale: 0.98 } : {}}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
                  isFormValid
                    ? "bg-purple-600 hover:bg-purple-500 text-white"
                    : "bg-gray-700 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Rocket className="w-5 h-5" />
                Review Asset
              </motion.button>
            </motion.form>
          )}

          {/* STEP 2: Confirm */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                <h2 className="text-lg font-bold mb-4">Review Your Asset</h2>
                <div className="space-y-3">
                  <ConfirmRow label="Name" value={formData.name} />
                  <ConfirmRow
                    label="Symbol"
                    value={formData.symbol.toUpperCase()}
                  />
                  <ConfirmRow
                    label="Supply"
                    value={formData.supply.toLocaleString()}
                  />
                  {formData.description && (
                    <ConfirmRow
                      label="Description"
                      value={formData.description}
                    />
                  )}
                  {formData.imageUrl && (
                    <ConfirmRow label="Image" value={formData.imageUrl} />
                  )}
                  <ConfirmRow
                    label="Emission"
                    value={formData.enableEmission ? "Enabled" : "Fixed supply"}
                  />
                  <div className="border-t border-gray-700 my-3" />
                  <ConfirmRow
                    label="Minting Fee"
                    value={`~${estimatedFeeSats.toLocaleString()} sats`}
                    highlight
                  />
                  {user && (
                    <ConfirmRow
                      label="Signed by"
                      value={user.npub.slice(0, 20) + "..."}
                    />
                  )}
                </div>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-700/40 rounded-xl p-4">
                <p className="text-yellow-400 text-sm flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>
                    This will create a real Taproot Asset on the Bitcoin
                    blockchain. The minting transaction is irreversible.
                  </span>
                </p>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep("form")}
                  className="flex-1 py-4 rounded-xl font-bold border border-gray-600 hover:border-gray-500 transition-colors"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="flex-1 py-4 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Pay & Mint
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payment */}
          {step === "payment" && invoice && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 flex flex-col items-center">
                <h2 className="text-lg font-bold mb-2">
                  Pay Lightning Invoice
                </h2>
                <p className="text-gray-400 text-sm mb-6">
                  Scan or copy the invoice to pay the minting fee
                </p>

                <div className="bg-white rounded-2xl p-4 mb-6">
                  <QRCodeSVG
                    value={invoice}
                    size={240}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#1f2937"
                  />
                </div>

                <div className="w-full bg-gray-900/50 rounded-xl p-3 mb-4">
                  <p className="text-xs text-gray-400 mb-1">Invoice</p>
                  <p className="text-sm font-mono text-white break-all">
                    {invoice.slice(0, 60)}...
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCopyInvoice}
                  className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-medium transition-colors mb-4"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  {copied ? "Copied!" : "Copy Invoice"}
                </motion.button>

                <p className="text-gray-500 text-xs text-center">
                  Amount: {estimatedFeeSats.toLocaleString()} sats
                </p>
              </div>

              {/* For demo purposes, allow manual completion */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePaymentComplete}
                className="w-full py-4 rounded-xl font-bold bg-green-600 hover:bg-green-500 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                I've Paid — Complete Minting
              </motion.button>
            </motion.div>
          )}

          {/* STEP 4: Success */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
                className="inline-block"
              >
                <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />
              </motion.div>

              <h2 className="text-2xl font-bold">Asset Minted!</h2>
              <p className="text-gray-400">
                <span className="text-white font-bold">{formData.name}</span> (
                {formData.symbol.toUpperCase()}) has been submitted for minting
                on the Bitcoin blockchain.
              </p>

              <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 text-left">
                <h3 className="text-sm font-bold text-gray-400 mb-3">
                  What happens next
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    Your minting transaction will be broadcast to the Bitcoin
                    network
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    Once confirmed (~10 min), your asset will appear in the
                    Universe
                  </li>
                  <li className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                    The asset will be registered with universe servers for
                    discovery
                  </li>
                  {user && (
                    <li className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
                      A Nostr attestation will be published linking you as the
                      minter
                    </li>
                  )}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/"
                  className="flex-1 py-3 rounded-xl font-bold border border-gray-600 hover:border-gray-500 transition-colors text-center"
                >
                  Back to Tokens
                </Link>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setStep("form");
                    setFormData({
                      name: "",
                      symbol: "",
                      supply: 1000000,
                      description: "",
                      imageUrl: "",
                      enableEmission: false,
                    });
                    setInvoice(null);
                  }}
                  className="flex-1 py-3 rounded-xl font-bold bg-purple-600 hover:bg-purple-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Mint Another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-gray-800/30 rounded-2xl p-6 border border-gray-700/50"
        >
          <h3 className="text-sm font-bold text-gray-400 mb-3">
            About Taproot Assets
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Taproot Assets is a protocol built on Bitcoin that enables the
            issuance and transfer of arbitrary assets on the Bitcoin blockchain
            and Lightning Network. Assets are anchored in Bitcoin transactions
            using Taproot, inheriting Bitcoin's security guarantees.
          </p>
          <a
            href="https://docs.lightning.engineering/lightning-network-tools/taproot-assets"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-purple-400 hover:text-purple-300 text-sm mt-3 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Learn more
          </a>
        </motion.div>
      </div>
    </div>
  );
};

// Form field wrapper
const FormField: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-2">
      {label}
      {required && <span className="text-purple-400 ml-1">*</span>}
    </label>
    {children}
  </div>
);

// Confirm review row
const ConfirmRow: React.FC<{
  label: string;
  value: string;
  highlight?: boolean;
}> = ({ label, value, highlight }) => (
  <div className="flex justify-between items-start">
    <span className="text-gray-400 text-sm">{label}</span>
    <span
      className={`text-sm font-mono text-right ${
        highlight ? "text-yellow-400 font-bold" : "text-white"
      }`}
    >
      {value}
    </span>
  </div>
);

// Demo invoice generator (placeholder)
function generateDemoInvoice(formData: MintFormData): string {
  // This would be replaced with a real Lightning invoice from Lnfi SDK or tapd
  const timestamp = Math.floor(Date.now() / 1000);
  return `lnbc50u1p${timestamp}dqqnp4q0n326hr8v9zpr4jd5gfqnq6nrwzqe9sxqyjw5qcqp2rzjqvppegf0r09qqnp4q0n326hr8v9zpr4jd5gfqnq6nrwzqe9sxqyjw5qcqpjrzjq${formData.name.replace(/\s/g, "").toLowerCase()}sp5zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zyg3zygshp58yjmdan79s6qqdhdzgynm4zwqd5d7xmw5fk98klysy043l2ahrqsqqqqqqqqqqqqqqqqqqqsq9q`;
}
