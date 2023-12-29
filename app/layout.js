"use client";
import "./globals.css";
import { DAppProvider } from "@usedapp/core";
import { config } from "../dapp-config";
import { WalletProvider } from "../context/WalletContext";

export default function RootLayout({ children }) {
  const gradientStyle = {
    background: "linear-gradient(to top, #e4cb1ef7, #ffffff)",
    minHeight: "100vh",
    minWidth: "100vw",
  };
  return (
    <WalletProvider>
      <DAppProvider config={config}>
        <html lang="en">
          <body style={gradientStyle}>{children}</body>
        </html>
      </DAppProvider>
    </WalletProvider>
  );
}
