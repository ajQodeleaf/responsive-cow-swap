import React, { useState } from "react";
import { useWalletProvider } from "../context/WalletContext";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const SlippageMenu = ({ onClose, onApply, buttonRef }) => {
  const { setSlippage } = useWalletProvider();
  const [textFieldValue, setTextFieldValue] = useState("0.50");

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setTextFieldValue(inputValue);
    setSlippage(inputValue);
  };

  const handleApply = () => {
    onApply(textFieldValue);
    onClose();
  };

  const handleAuto = () => {
    setSlippage(0.5);
    onClose();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "100%",
        left: "640px",
        width: "160px",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "8px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Slippage Tolerance (%)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          max="100"
          value={textFieldValue}
          onChange={handleInputChange}
          className="mt-1 p-1 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="flex justify-between">
        <button
          onClick={handleAuto}
          className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 pr-2 rounded-md"
        >
          Auto
        </button>
        <button
          onClick={handleApply}
          className="text-white bg-green-500 hover:bg-green-600 pl-2 px-4 py-2 rounded-md"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

const CardHeader = ({ handleSlippage }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSettingsClick = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleApplySlippage = (newSlippage) => {
    handleSlippage(newSlippage);
  };

  return (
    <div className="flex items-center justify-between p-8 relative">
      <div className="flex">
        <div className="bg-gray-100 text-black p-2 rounded">Swap</div>
      </div>
      <button className="text-black" onClick={handleSettingsClick}>
        <SettingsOutlinedIcon />
      </button>
      {menuOpen && (
        <SlippageMenu onClose={handleCloseMenu} onApply={handleApplySlippage} />
      )}
    </div>
  );
};

export default CardHeader;
