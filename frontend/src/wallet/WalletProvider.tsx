import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  BrowserProvider,
  JsonRpcProvider,
  type Eip1193Provider,
  type JsonRpcSigner,
} from "ethers";
import { NEXUS_CHAIN } from "../config";

type WalletState = {
  address: string | null;
  chainIdHex: string | null;
  isOnNexus: boolean;
  connecting: boolean;
  hasMetaMask: boolean;
  connect: () => Promise<void>;
  switchToNexus: () => Promise<void>;
  getReadProvider: () => JsonRpcProvider;
  getSigner: () => Promise<JsonRpcSigner>;
};

const WalletContext = createContext<WalletState | undefined>(undefined);

declare global {
  interface Window {
    ethereum?: Eip1193Provider & {
      on?: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (
        event: string,
        handler: (...args: unknown[]) => void
      ) => void;
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [chainIdHex, setChainIdHex] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  const hasMetaMask =
    typeof window !== "undefined" && Boolean(window.ethereum);

  const refresh = useCallback(async () => {
    if (!window.ethereum) return;
    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[];
    const cid = (await window.ethereum.request({
      method: "eth_chainId",
    })) as string;
    setAddress(accounts[0] ?? null);
    setChainIdHex(cid ?? null);
  }, []);

  useEffect(() => {
    refresh();
    const eth = window.ethereum;
    if (!eth?.on) return;
    const onAccounts = (...args: unknown[]) => {
      const accs = args[0] as string[];
      setAddress(accs[0] ?? null);
    };
    const onChain = (...args: unknown[]) => {
      const cid = args[0] as string;
      setChainIdHex(cid);
    };
    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, [refresh]);

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
      return;
    }
    setConnecting(true);
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await refresh();
    } finally {
      setConnecting(false);
    }
  }, [refresh]);

  const switchToNexus = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: NEXUS_CHAIN.chainIdHex }],
      });
    } catch (err) {
      const code = (err as { code?: number }).code;
      if (code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: NEXUS_CHAIN.chainIdHex,
              chainName: NEXUS_CHAIN.chainName,
              rpcUrls: NEXUS_CHAIN.rpcUrls,
              nativeCurrency: NEXUS_CHAIN.nativeCurrency,
              blockExplorerUrls: NEXUS_CHAIN.blockExplorerUrls,
            },
          ],
        });
      } else {
        throw err;
      }
    }
    await refresh();
  }, [refresh]);

  const getReadProvider = useCallback(
    () => new JsonRpcProvider(NEXUS_CHAIN.rpcUrls[0], NEXUS_CHAIN.chainIdDec),
    []
  );

  const getSigner = useCallback(async () => {
    if (!window.ethereum) throw new Error("No wallet detected");
    const provider = new BrowserProvider(window.ethereum);
    return provider.getSigner();
  }, []);

  const value = useMemo<WalletState>(
    () => ({
      address,
      chainIdHex,
      isOnNexus: chainIdHex?.toLowerCase() === NEXUS_CHAIN.chainIdHex.toLowerCase(),
      connecting,
      hasMetaMask,
      connect,
      switchToNexus,
      getReadProvider,
      getSigner,
    }),
    [
      address,
      chainIdHex,
      connecting,
      hasMetaMask,
      connect,
      switchToNexus,
      getReadProvider,
      getSigner,
    ]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
