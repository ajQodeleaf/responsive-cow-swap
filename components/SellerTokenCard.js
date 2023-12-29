import React from "react";
import AvatarSelector from "./AppModal";
import LoadingIcon from "./LoadingIcon";

const SellerTokenCard = ({
  sellTokenAmount,
  handleSellTokenAmountChange,
  sellToken,
  sellerTokenBalance,
  isLoadingSellerTokenBalance,
}) => {
  return (
    /* Seller Token Card */
    <div className="bg-red-100 h-full rounded-3xl flex justify-around p-8 ml-8 mr-8">
      <div className="flex flex-col justify-between items-center w-full">
        <div className="flex justify-between items-center pb-8">
          <div className="flex justify-start items-center pr-12">
            <AvatarSelector buy={false} />
          </div>
          <div className="flex justify-end items-center">
            <input
              type="number"
              placeholder="Enter Sell Token Amount"
              value={sellTokenAmount}
              onChange={handleSellTokenAmountChange}
              className="text-black bg-gray-100 text-2xl"
            />
          </div>
        </div>

        {/* Seller Token Balance */}
        <div className="flex justify-end items-start">
          {isLoadingSellerTokenBalance ? (
            <LoadingIcon />
          ) : (
            <div className="text-yellow-700 font-bold">
              Balance: {parseFloat(Number(sellerTokenBalance).toFixed(2))}{" "}
              {sellToken.ticker}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerTokenCard;
