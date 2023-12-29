import React, { useEffect } from "react";
import { formatEther } from "@ethersproject/units";
import { shortenAddress } from "@usedapp/core";
import { Contract, ethers } from "ethers";
import { useWalletProvider } from "../context/WalletContext";
import { useEthers, useEtherBalance } from "@usedapp/core";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";

function AccountInfo() {
  const {
    selectedSigner,
    sellToken,
    buyToken,
    setIsLoadingSellerTokenBalance,
    setIsLoadingBuyTokenBalance,
    setBuyTokenBalance,
    setSellerTokenBalance,
  } = useWalletProvider();
  const { account, chainId } = useEthers();
  const balance = useEtherBalance(account, { chainId: chainId });

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoadingSellerTokenBalance(true);
        const erc20 = new Contract(
          sellToken.address,
          ERC20.abi,
          selectedSigner
        );
        const tx = erc20.connect(selectedSigner);
        const newBalance = await erc20.balanceOf(account);
        setSellerTokenBalance(
          ethers.utils.formatUnits(newBalance, sellToken.decimals)
        );
        setIsLoadingSellerTokenBalance(false);
      } catch (error) {
        setSellerTokenBalance(0);
        setIsLoadingSellerTokenBalance(false);
      }
    };
    if (account) {
      fetchBalance();
    }
  }, [sellToken, buyToken, selectedSigner, account]);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        setIsLoadingBuyTokenBalance(true);
        const erc20 = new Contract(buyToken.address, ERC20.abi, selectedSigner);
        const tx = erc20.connect(selectedSigner);
        const newBalance = await erc20.balanceOf(account);
        setBuyTokenBalance(
          ethers.utils.formatUnits(newBalance, buyToken.decimals)
        );
        setIsLoadingBuyTokenBalance(false);
      } catch (error) {
        setBuyTokenBalance(0);
        setIsLoadingBuyTokenBalance(false);
      }
    };
    if (account) {
      fetchBalance();
    }
  }, [sellToken, buyToken, selectedSigner, account]);

  return (
    <div className="flex items-center space-x-4 ml-4 mr-4">
      <button className="border-2 border-black p-2 rounded-3xl w-60">
        <span className="text-black font-semibold">
          {balance && formatEther(balance)} ETH
        </span>
      </button>
      <button className="border-2 border-black p-2 h-11 w-40 flex items-center rounded-3xl">
        <span className="text-black font-semibold pr-2 ">
          {account && shortenAddress(account)}
        </span>
        <img
          src="/metamask.svg"
          alt="metamask"
          className="w-6 h-6 rounded-full"
        />
      </button>
    </div>
  );
}

export default AccountInfo;
