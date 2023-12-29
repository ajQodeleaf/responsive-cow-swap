import React from "react";
import AvatarSelector from "./AppModal";
import LoadingIcon from "./LoadingIcon";

const BuyerTokenCard = ({
  sellTokenAmount,
  buyTokenAmount,
  buyToken,
  buyTokenBalance,
  isLoadingBuyAmount,
  isLoadingBuyTokenBalance,
}) => {
  return (
    /* Buyer Token Card */
    <div className="bg-gray-100 h-full rounded-3xl flex justify-around p-8 ml-8 mr-8">
      <div className="flex flex-col justify-between items-center w-full">
        <div className="flex justify-between items-center pb-8">
          {/* Avatar Selector */}
          <div className="flex justify-start items-center pr-12">
            <AvatarSelector buy={true} />
          </div>
          {/* Buyer Token Amount Input */}
          <div className="flex justify-end items-center">
            {isLoadingBuyAmount ? (
              /* Loading Icon component */
              <LoadingIcon />
            ) : (
              <input
                readOnly
                value={
                  sellTokenAmount === 0 || sellTokenAmount === ""
                    ? 0
                    : buyTokenAmount
                }
                className="text-black bg-gray-100 text-2xl"
              />
            )}
          </div>
        </div>

        {/* Buyer Token Balance */}
        <div className="flex justify-center items-start">
          {isLoadingBuyTokenBalance ? (
            /* Loading Icon component */
            <LoadingIcon />
          ) : (
            <div className="text-yellow-700 font-bold">
              Balance: {parseFloat(Number(buyTokenBalance).toFixed(2))}{" "}
              {buyToken.ticker}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyerTokenCard;
