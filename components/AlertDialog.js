import React from "react";
import { useRouter } from "next/navigation";

function AlertDialog(props) {
  const { onClose, open, orderId, chainName, alert } = props;

  const router = useRouter();

  const handleClose = () => {
    onClose();
    router.push(`/${chainName}/home`);
  };

  const handleSwitchNetwork = () => {
    onClose();
    router.push(`/${chainName}/home`);
  };

  return (
    <div
      className={`fixed inset-0 z-10 overflow-y-auto ${
        open ? "block" : "hidden"
      }`}
      aria-labelledby="alert-dialog-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          {orderId !== "" && (
            <>
              <div className="mb-4">
                <p className="text-lg font-bold" id="alert-dialog-title">
                  Order ID
                </p>
              </div>
              <div>
                <p className="text-base" id="alert-dialog-description">
                  <a
                    href={`https://explorer.cow.fi/${chainName}/orders/${orderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    View Order ID on CoW Explorer: {orderId}
                  </a>
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                >
                  Close
                </button>
              </div>
            </>
          )}
          {alert && (
            <>
              <div className="mb-4">
                <p className="text-lg font-bold" id="alert-dialog-title">
                  Switch Network
                </p>
              </div>
              <div>
                <p className="text-base" id="alert-dialog-description">
                  <span className="text-gray-700">
                    Please switch to Goerli Testnet.
                  </span>
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleSwitchNetwork}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Switch Network
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AlertDialog;
