import React, { useState } from "react";
import { useMoralis } from "react-moralis";
import TabButton from "../components/TabButton";
import PriceTab from "../components/PricesTab";
import EscrowTab from "../components/EscrowTab";
import SellerTab from "../components/SellerTab";
import BuyerTab from "../components/BuyerTab";
import AccountsTab from "../components/AccountsTab";
import Info from "../components/Info";
import ListedCollection from "../components/ListedCollection";

const Contract = (props) => {
  const { isWeb3Enabled } = useMoralis();
  const tabs = ["Accounts", "Price", "Escrow", "Seller", "Buyer"];
  const defaultTabId = 0;
  const [tab, setTab] = useState(tabs[defaultTabId]);
  const [activeTab, SetActiveTab] = useState(tabs[defaultTabId]);
  const handleTabChange = (tab) => {
    SetActiveTab(tab);
  };

  const handleButtonClick = (tabName) => {
    const newTab = tabName;
    setTab(newTab);
    console.log(document.getElementsByTagName(tabName));
    handleTabChange(newTab);
  };

  return (
    <div>
      {isWeb3Enabled ? (
        <div>
          <div className="tab-row">
            <TabButton
              tabName={tabs[0]}
              onHandleButtonClick={handleButtonClick}
              currentTab={tab}
            />
            <TabButton
              tabName={tabs[1]}
              onHandleButtonClick={handleButtonClick}
              currentTab={tab}
            />
            <TabButton
              tabName={tabs[2]}
              onHandleButtonClick={handleButtonClick}
              currentTab={tab}
            />
            <TabButton
              tabName={tabs[3]}
              onHandleButtonClick={handleButtonClick}
              currentTab={tab}
            />
            <TabButton
              tabName={tabs[4]}
              onHandleButtonClick={handleButtonClick}
              currentTab={tab}
            />
          </div>
          <div>
            {activeTab === tabs[0] ? (
              <AccountsTab handleLogChange={props.handleLogChange} />
            ) : null}
            {activeTab === tabs[1] ? (
              <PriceTab handleLogChange={props.handleLogChange} />
            ) : null}
            {activeTab === tabs[2] ? (
              <EscrowTab handleLogChange={props.handleLogChange} />
            ) : null}
            {activeTab === tabs[3] ? (
              <div style="display:flex; flex-direction:row;">
                <div style="width:50%;">
                  <SellerTab handleLogChange={props.handleLogChange} />
                </div>
                <div style="width:50%;">
                  <ListedCollection />
                </div>
              </div>
            ) : null}
            {activeTab === tabs[4] ? (
              <BuyerTab handleLogChange={props.handleLogChange} />
            ) : null}
          </div>
        </div>
      ) : (
        <div>
          <Info message="Press the Connect Wallet button to start" />
          <br />
        </div>
      )}
    </div>
  );
};

export default Contract;
