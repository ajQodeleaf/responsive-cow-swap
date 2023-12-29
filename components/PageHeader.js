import React, { useEffect, useState } from "react";
import { useWalletProvider } from "../context/WalletContext";
import { useWindowSize } from "@uidotdev/usehooks";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import AccountInfo from "../components/AccountInfo";
import DisconnectButton from "../components/DisconnectButton";
import DropDown from "../components/DropDown";

function PageHeader({ pageTitle }) {
  const { isMobile, setIsMobile, isTablet, setIsTablet } = useWalletProvider();
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const size = useWindowSize();

  useEffect(() => {
    if (size.width < 500) {
      setIsMobile(true);
    } else if (size.width > 500 && size.width < 700) {
      setIsMobile(false);
      setIsTablet(true);
    } else {
      setIsTablet(false);
    }
  }, [size]);

  const handleMenuClick = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleCloseClick = () => {
    setIsNavbarOpen(false);
  };

  return (
    <div className="flex justify-between items-center h-12 pr-8">
      <div className="flex justify-self-end w-full smartwatch:justify-items-stretch items-center pl-8 smartwatch:pl-4">
        {isTablet && (
          <MenuIcon onClick={handleMenuClick} style={{ cursor: "pointer" }} />
        )}
        <h1 className="text-black font-bold text-2xl pl-4">{pageTitle}</h1>
      </div>
      {!isMobile && (
        <div className="flex items-center space-x-4">
          <AccountInfo />
          {!isTablet && (
            <>
              <DropDown />
              <DisconnectButton />
            </>
          )}
        </div>
      )}

      <Drawer open={isNavbarOpen} onClose={handleMenuClick}>
        <List>
          <ListItem>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <IconButton
                onClick={handleCloseClick}
                edge="end"
                color="inherit"
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </div>
          </ListItem>
          <AccountInfo />
          <DropDown />
          <DisconnectButton />
        </List>
      </Drawer>
    </div>
  );
}

export default PageHeader;
