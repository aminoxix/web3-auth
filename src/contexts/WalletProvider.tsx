// next
import { useRouter } from "next/router";

import React, {
  createContext,
  PropsWithChildren,
  useEffect,
  useState,
} from "react";

// web3-onboard
import { init, useConnectWallet } from "@web3-onboard/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { ConnectOptions, WalletState } from "@web3-onboard/core";

// ethers
import { ethers } from "ethers";

const injected = injectedModule();

const rpcApiKey = "<ALCHEMY_KEY>" || "<INFURA_KEY>";
const rpcUrl =
  `https://eth-mainnet.g.alchemy.com/v2/${rpcApiKey}` ||
  `https://mainnet.infura.io/v3/${rpcApiKey}`;

// initialize Onboard
init({
  wallets: [injected],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl,
    },
  ],
});

export interface IWalletContext {
  isLoggedIn: boolean;
  wallet: WalletState | null;
  login: (options?: ConnectOptions) => Promise<void>;
  connecting: boolean;
  logout: () => void;
}
export const WalletContext = createContext({} as IWalletContext);

const WalletProvider = (props: PropsWithChildren) => {
  const router = useRouter();

  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (wallet) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [wallet, connecting]);

  useEffect(() => {
    router.push(isLoggedIn ? "/dashboard" : "/landing");
    console.log("isLoggedIn", isLoggedIn);
  }, [isLoggedIn]);

  // create an ethers provider
  let ethersProvider;

  if (wallet) {
    ethersProvider = new ethers.providers.Web3Provider(wallet.provider, "any");
  }

  return (
    <WalletContext.Provider
      value={{
        isLoggedIn,
        wallet,
        login: async (arg) => {
          await connect(arg);
        },
        connecting,
        logout: async () => {
          if (!wallet) return null;
          await disconnect(wallet);
        },
      }}
    >
      {props.children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
export const useWalletContext = () => React.useContext(WalletContext) ?? null;
