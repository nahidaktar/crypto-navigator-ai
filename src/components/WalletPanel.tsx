import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, ExternalLink, Copy, Check, LogOut, Shield, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
    };
  }
}

interface WalletInfo {
  address: string;
  balance: string;
  chainId: string;
  chainName: string;
}

const CHAINS: Record<string, string> = {
  "0x1": "Ethereum",
  "0x89": "Polygon",
  "0xa86a": "Avalanche",
  "0xa4b1": "Arbitrum",
  "0x38": "BSC",
  "0xa": "Optimism",
  "0x2105": "Base",
  "0x279f": "Monad Testnet",
};

const WALLET_OPTIONS = [
  { id: "metamask", name: "MetaMask", icon: "🦊", desc: "Browser extension wallet" },
  { id: "walletconnect", name: "WalletConnect", icon: "🔗", desc: "Scan QR code to connect" },
  { id: "coinbase", name: "Coinbase Wallet", icon: "🔵", desc: "Coinbase browser wallet" },
  { id: "trust", name: "Trust Wallet", icon: "🛡️", desc: "Multi-chain mobile wallet" },
  { id: "phantom", name: "Phantom", icon: "👻", desc: "Solana & multi-chain wallet" },
  { id: "rabby", name: "Rabby Wallet", icon: "🐰", desc: "Multi-chain DeFi wallet" },
];

export default function WalletPanel() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("MetaMask not detected. Please install MetaMask extension.");
      window.open("https://metamask.io/download/", "_blank");
      return;
    }

    setConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" }) as string[];
      const address = accounts[0];
      const chainId = await window.ethereum.request({ method: "eth_chainId" }) as string;
      const balanceHex = await window.ethereum.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      }) as string;

      const balanceWei = BigInt(balanceHex);
      const balanceEth = Number(balanceWei) / 1e18;

      setWallet({
        address,
        balance: balanceEth.toFixed(4),
        chainId,
        chainName: CHAINS[chainId] || `Chain ${parseInt(chainId, 16)}`,
      });

      toast.success(`Connected: ${address.slice(0, 6)}...${address.slice(-4)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Connection failed";
      toast.error(message);
    } finally {
      setConnecting(false);
      setShowOptions(false);
    }
  }, []);

  const handleWalletSelect = (walletId: string) => {
    if (walletId === "metamask") {
      connectMetaMask();
    } else {
      toast.info(`${walletId} integration coming soon! Use MetaMask for now.`);
    }
  };

  const disconnect = () => {
    setWallet(null);
    toast.success("Wallet disconnected");
  };

  const copyAddress = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Address copied!");
    }
  };

  const shortAddr = wallet ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}` : "";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <Wallet className="w-6 h-6 text-primary" /> Wallet Connection
      </h2>

      {wallet ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Connected Wallet</p>
                  <p className="font-mono font-semibold">{shortAddr}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="icon" variant="ghost" onClick={copyAddress}>
                  {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="ghost" onClick={() => window.open(`https://etherscan.io/address/${wallet.address}`, "_blank")}>
                  <ExternalLink className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={disconnect}>
                  <LogOut className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Balance</p>
                <p className="text-lg font-mono font-bold">{wallet.balance} ETH</p>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Network</p>
                <p className="text-lg font-semibold flex items-center gap-1">
                  <Globe className="w-4 h-4 text-primary" />
                  {wallet.chainName}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">QUICK ACTIONS</h3>
            <div className="grid grid-cols-2 gap-2">
              {["Send Tokens", "Swap", "Bridge", "Stake"].map((action) => (
                <Button key={action} variant="outline" className="h-12" onClick={() => toast.info(`${action} coming soon!`)}>
                  <Zap className="w-4 h-4 mr-2" />{action}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="glass-card p-6 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Connect Your Wallet</h3>
              <p className="text-sm text-muted-foreground">Link your crypto wallet to trade, stake, and interact with Web3</p>
            </div>
            <Button onClick={() => setShowOptions(true)} className="w-full h-12 text-base" disabled={connecting}>
              {connecting ? "Connecting..." : "Choose Wallet"}
            </Button>
          </div>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {WALLET_OPTIONS.map((w, i) => (
                  <motion.button
                    key={w.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => handleWalletSelect(w.id)}
                    className="w-full glass-card p-4 flex items-center gap-4 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <span className="text-2xl">{w.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{w.name}</p>
                      <p className="text-xs text-muted-foreground">{w.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
