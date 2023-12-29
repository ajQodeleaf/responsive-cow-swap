"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useEthers, Goerli, Mainnet } from "@usedapp/core";
import { useWalletProvider } from "../context/WalletContext";

const ConnectWallet = () => {
  const { activateBrowserWallet, account, chainId } = useEthers();
  const { chainName, setChainName } = useWalletProvider();
  const router = useRouter();

  useEffect(() => {
    if (account) {
      switch (chainId) {
        case Goerli.chainId:
          setChainName("Goerli");
          break;
        case Mainnet.chainId:
          setChainName("Mainnet");
          break;
        default:
          break;
      }
      if (chainName !== "") {
        router.push(`/${chainName.toLowerCase()}/home`);
      }
    }
  }, [chainId, chainName]);

  const handleConnectWallet = () => {
    activateBrowserWallet();
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="text-center">
        <button
          onClick={handleConnectWallet}
          className="bg-blue-500 text-white py-2 px-4 rounded-md"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;
