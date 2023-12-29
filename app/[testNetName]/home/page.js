"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Contract, ethers } from "ethers";
import { useWalletProvider } from "../../../context/WalletContext.js";
import { useEthers } from "@usedapp/core";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";
import {
  OrderBookApi,
  OrderKind,
  OrderSigningUtils,
} from "@cowprotocol/cow-sdk";
import BigNumber from "bignumber.js";
import PageHeader from "../../../components/PageHeader.js";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import CardHeader from "../../../components/CardHeader.js";
import LoadingIcon from "../../../components/LoadingIcon.js";
import SellerTokenCard from "../../../components/SellerTokenCard.js";
import BuyerTokenCard from "../../../components/BuyerTokenCard.js";
import Dialog from "../../../components/Dialog.js";
import DisconnectButton from "../../../components/DisconnectButton";
import { useWindowSize } from "@uidotdev/usehooks";

const HomePage = () => {
  const {
    selectedSigner,
    setSelectedSigner,
    setIsLoading,
    isLoading,
    isLoadingSellerTokenBalance,
    sellToken,
    buyToken,
    setSellToken,
    setBuyToken,
    slippage,
    fees,
    chainName,
    setFees,
    buyTokenAmount,
    sellTokenAmount,
    setBuyTokenAmount,
    setSellTokenAmount,
    sellerTokenBalance,
    isLoadingBuyTokenBalance,
    buyTokenBalance,
    isMobile,
    setIsMobile,
    isTablet,
    setIsTablet,
  } = useWalletProvider();

  const { chainId, library, account } = useEthers();

  const router = useRouter();
  const size = useWindowSize();

  const [isLoadingBuyAmount, setIsLoadingBuyAmount] = useState(false);
  const [sellAmountError, setSellAmountError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [quote, setQuote] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [receiveAmount, setReceiveAmount] = useState(0);

  const open = Boolean(anchorEl);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSlippage = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (size.width < 500) {
      setIsMobile(true);
    } else if (size.width > 500 && size.width < 700) {
      setIsTablet(true);
    } else {
      setIsMobile(false);
      setIsTablet(false);
    }
  }, [size]);

  useEffect(() => {
    if (library && account) {
      const signer = library.getSigner(account);
      setSelectedSigner(signer);
    }
  }, [library, account]);

  useEffect(() => {
    setReceiveAmount(buyTokenAmount - buyTokenAmount * (slippage / 100));
  }, [buyTokenAmount, slippage]);

  useEffect(() => {
    if (!selectedSigner) {
      router.push("/");
    }
  }, [selectedSigner]);

  useEffect(() => {
    const fetchQuote = async () => {
      setIsLoadingBuyAmount(true);
      const orderBookApi = new OrderBookApi({
        chainId: chainId,
      });

      const quoteRequest = {
        sellToken: sellToken.address,
        buyToken: buyToken.address,
        from: account,
        receiver: account,
        sellAmountBeforeFee: (
          sellTokenAmount *
          10 ** sellToken.decimals
        ).toString(),
        kind: OrderKind.SELL,
      };

      // Get quote
      const { quote } = await orderBookApi.getQuote(quoteRequest);
      setQuote(quote);
      const buyAmount = quote.buyAmount / 10 ** buyToken.decimals;
      setBuyTokenAmount(buyAmount);
      console.log(quote);
      setIsLoadingBuyAmount(false);
      const fees = quote.feeAmount / 10 ** sellToken.decimals;
      setFees(Number(fees));
    };

    if (
      sellTokenAmount !== "" &&
      sellTokenAmount !== 0 &&
      sellerTokenBalance > sellTokenAmount
    ) {
      fetchQuote();
    }
  }, [sellTokenAmount]);

  const handleSellTokenAmountChange = (event) => {
    const amount = event.target.value;
    if (amount !== "" && Number(amount) < Number(sellerTokenBalance)) {
      setSellTokenAmount(Number(amount));
      setSellAmountError("");
    } else {
      setSellAmountError("Amount is greater than Trader's Balance");
    }

    if (amount == "") {
      setSellTokenAmount("");
      setSellAmountError("Amount cannot be empty");
    }
  };

  const handleSwap = async () => {
    try {
      if (quote !== null) {
        setIsLoading(true);
        const erc20 = new Contract(
          sellToken.address,
          ERC20.abi,
          selectedSigner
        );

        const tx = erc20.connect(selectedSigner);

        const allowance = await tx.allowance(
          selectedSigner.getAddress(),
          "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110"
        );

        if (allowance) {
          console.log("Approval successful!");
        } else {
          const approveTx = await tx.approve(
            "0xC92E8bdf79f0507f65a392b0ab4667716BFE0110",
            ethers.constants.MaxUint256
          );
        }

        const orderBookApi = new OrderBookApi({
          chainId: chainId,
        });

        const bigNum = new BigNumber(quote.buyAmount);
        const buyAmount = bigNum.times(1 - slippage / 100);

        const order = {
          sellToken: sellToken.address,
          buyToken: buyToken.address,
          sellAmount: quote.sellAmount,
          buyAmount: buyAmount.round(null, BigNumber.ROUND_DOWN).toFixed(),
          validTo: quote.validTo,
          appData:
            "0xf785fae7a7c5abc49f3cd6a61f6df1ff26433392b066ee9ff2240ff1eb7ab6e4",
          feeAmount: quote.feeAmount,
          kind: OrderKind.SELL,
          partiallyFillable: false,
          receiver: account,
        };

        // Sign order
        const orderSigningResult = await OrderSigningUtils.signOrder(
          order,
          chainId,
          selectedSigner
        );

        const requestBody = {
          ...order,
          signature: orderSigningResult.signature,
          signingScheme: orderSigningResult.signingScheme,
        };

        // Send order to the order-book
        const orderId = await orderBookApi.sendOrder(requestBody);
        setOrderId(orderId);

        setIsLoading(false);
        setOpenDialog(true);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const disableSwapButton =
    sellTokenAmount === "" ||
    sellTokenAmount === 0 ||
    sellerTokenBalance < sellTokenAmount;

  return (
    <div>
      <PageHeader pageTitle="CoW Swap" />
      <>
        <div className="flex justify-center items-center mt-24">
          <div className="w-108 h-108 rounded-3xl bg-yellow-200">
            <CardHeader handleSlippage={handleSlippage} />

            <SellerTokenCard
              sellTokenAmount={sellTokenAmount}
              handleSellTokenAmountChange={handleSellTokenAmountChange}
              sellToken={sellToken}
              sellerTokenBalance={sellerTokenBalance}
              isLoadingSellerTokenBalance={isLoadingSellerTokenBalance}
            />

            {/* Swap Button */}
            <div className="h-20 flex justify-center items-center p-4">
              <button
                onClick={() => {
                  const buyT = sellToken;
                  const sellT = buyToken;
                  setSellToken(sellT);
                  setBuyToken(buyT);
                }}
                className="text-black"
              >
                <SwapVertIcon />
              </button>
            </div>

            <BuyerTokenCard
              sellTokenAmount={sellTokenAmount}
              buyTokenAmount={buyTokenAmount}
              buyToken={buyToken}
              buyTokenBalance={buyTokenBalance}
              isLoadingBuyAmount={isLoadingBuyAmount}
              isLoadingBuyTokenBalance={isLoadingBuyTokenBalance}
            />

            {/* Fees and Swap Button Section */}
            <div className="h-17 pl-12 pr-12 pt-4 pb-4">
              {/* Fees */}
              <div className="flex justify-between items-center">
                <div className="text-black">Fees:</div>
                <div className="text-black font-bold">
                  {fees + ` ${sellToken.ticker}`}
                </div>
              </div>
              {/* Slippage Tolerance */}
              <div className="flex justify-between items-center">
                <div className="text-black">Slippage Tolerance:</div>
                <div className="text-black font-bold">{slippage + " %"}</div>
              </div>
              {/* Minimum Received */}
              <div className="flex justify-between items-center">
                <div className="text-black">Minimum Received:</div>
                <div className="text-black font-bold">
                  {receiveAmount + ` ${buyToken.ticker}`}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="h-24 flex justify-center items-center pb-8 ml-8 mr-8">
              {isLoading ? (
                <LoadingIcon />
              ) : (
                <button
                  onClick={handleSwap}
                  disabled={disableSwapButton}
                  className="bg-yellow-700 w-full h-full text-white rounded-3xl"
                >
                  <div className="font-bold">SWAP</div>
                </button>
              )}
            </div>
          </div>
        </div>
      </>

      {/* Bottom Bar for Mobile */}
      {!isMobile && isTablet && (
        <div className="bg-white-800 w-full text-white p-4 fixed bottom-0 left-0 right-0 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <DisconnectButton />
          </div>
        </div>
      )}
      {openDialog && (
        <Dialog
          chainName={chainName.toLowerCase()}
          orderId={orderId}
          onClose={handleCloseDialog}
        />
      )}
    </div>
  );
};

export default HomePage;
