import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useEthers, Goerli, Mainnet } from "@usedapp/core";
import { useWalletProvider } from "../context/WalletContext";
import { useForm } from "react-hook-form";

function DropDown() {
  const { switchNetwork } = useEthers();
  const { setChainName } = useWalletProvider();
  const paramChainName = useParams();
  const { register } = useForm();
  const router = useRouter();

  const [selectedChain, setSelectedChain] = useState("");
  const [hasSelection, setHasSelection] = useState(false);

  useEffect(() => {
    switch (paramChainName.testNetName) {
      case "goerli":
        setSelectedChain("Goerli");
        break;
      case "mainnet":
        setSelectedChain("Mainnet");
        break;
      default:
        break;
    }
  }, [paramChainName]);

  const handleChainSelection = async (selectedChainValue) => {
    try {
      setSelectedChain((prevSelectedChain) => selectedChainValue);
      setHasSelection(true);

      switch (selectedChainValue) {
        case "Goerli":
          await switchNetwork(Goerli.chainId);
          break;
        case "Mainnet":
          await switchNetwork(Mainnet.chainId);
          break;
        default:
          break;
      }

      if (selectedChainValue !== paramChainName.testNetName) {
        router.push(`/${selectedChainValue.toLowerCase()}/home`);
        setChainName(selectedChainValue.toLowerCase());
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="inline-block text-left mt-8 tablet:mt-0 ml-4 mr-4">
      <label
        htmlFor={"chain" + "-select-chain-required-label"}
        className="block text-sm font-medium text-gray-700"
      >
        {"Chain"}
      </label>
      <div className="mt-1">
        <select
          id={"chain" + "-select-chain-required-label"}
          name="selectChain"
          value={selectedChain}
          {...register("selectChain", { required: true })}
          onChange={(event) => {
            console.log(event.target.value);
            handleChainSelection(event.target.value);
          }}
          className={`block w-64 h-10 pl-3 pr-10 py-2 text-base focus:outline-none focus:ring focus:border-blue-300 sm:text-sm rounded-md text-black ${
            hasSelection ? "bg-transparent" : ""
          }`}
        >
          <option value="" disabled>
            Select {"Chain"}
          </option>
          {["Goerli", "Mainnet"].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      
    </div>
  );
}

export default DropDown;
