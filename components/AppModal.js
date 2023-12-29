import React, { useState, useEffect, useRef } from "react";
import { useWalletProvider } from "../context/WalletContext";
import { goerliTokensList } from "../TokenList";

// TokenItem component
const TokenItem = ({ item, onItemClick, isSelected }) => (
  <li
    onClick={() => onItemClick(item)}
    className={`flex items-center space-x-4 p-2 cursor-pointer ${
      isSelected ? 'bg-gray-200' : ''
    }`}
  >
    <div className="relative">
      <img src={item.img} alt={item.name} className="w-6 h-6 rounded-full" />
      {isSelected && (
        <div className="absolute top-0 left-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M0 11l2-2 5 5L18 3l2 2L7 18z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
    <div>
      <p className="text-lg">{item.name}</p>
      <p className="text-sm text-gray-500">{`Symbol: ${item.ticker}`}</p>
    </div>
  </li>
);

// AvatarSelector component
const AvatarSelector = ({ buy }) => {
  const { setBuyToken, buyToken, sellToken, setSellToken } =
    useWalletProvider();
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedItem(buy ? buyToken : sellToken);

    // Add event listener to close dropdown when clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [buyToken, sellToken, buy]);

  const handleToggleDropdown = () => {
    setOpen(!open);
  };

  const handleItemClick = (item) => {
    if (buy) {
      setBuyToken(item);
    } else {
      setSellToken(item);
    }
    setSelectedItem(item);
    setOpen(false);
  };

  return (
    <div className="inline-block text-left" ref={dropdownRef}>
      <button
        onClick={handleToggleDropdown}
        className="text-amber-600 hover:text-amber-400 focus:outline-none"
      >
        <span className="flex items-center">
          {selectedItem ? (
            <img
              alt="Selected"
              src={selectedItem.img}
              className="w-6 h-6 rounded-full mr-2"
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          )}
          <span className="text-xl">
            {selectedItem ? selectedItem.name : "Select"}
          </span>
        </span>
      </button>

      {open && (
        <div className="origin-top-right absolute right-120 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <ul>
              {goerliTokensList.map((item) => (
                <TokenItem
                  key={item.name}
                  item={item}
                  onItemClick={handleItemClick}
                  isSelected={item === selectedItem}
                />
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarSelector;
