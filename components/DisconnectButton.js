import React from "react";
import { useRouter } from "next/navigation";
import { useEthers } from "@usedapp/core";

function DisconnectButton() {
  const { deactivate } = useEthers();
  const router = useRouter();
  return (
    <button
      className="bg-red-500 px-4 py-2 rounded-2xl mt-14 tablet:mt-0 ml-4 mr-4"
      onClick={() => {
        deactivate();
        router.push("/");
      }}
    >
      <span className="text-white font-semibold">DISCONNECT</span>
    </button>
  );
}

export default DisconnectButton;
