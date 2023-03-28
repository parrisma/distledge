import { ConnectButton } from "web3uikit";
import Link from "next/link";
import React, { useState } from "react";

const Header = (props) => {
  const [tab, setTab] = useState("Price");

  const handleButtonClick = (tabName) => {
    const newTab = tabName;
    setTab(newTab);
    console.log(document.getElementsByTagName(tabName));
    props.onHeaderTabChange(newTab);
  };

  return (
    <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-blog text-3xl">Distributed Ledger</h1>
      <div style={{ display: "none" }}>Current tab:{tab}</div>
      <p>{tab}</p>
      <div className="ml-auto py-2 px-4">
        <div className="flex flex-row items-center">
          <button
            onClick={() => handleButtonClick("Price")}
            className="button-tab"
            name="Price"
          >
            Prices
          </button>
          <button
            onClick={() => handleButtonClick("Escrow")}
            className="button-tab"
            name="Escrow"
          >
            Escrow
          </button>
          <ConnectButton moralisAuth={false} />
        </div>
      </div>
    </nav>
  );
};

export default Header;
