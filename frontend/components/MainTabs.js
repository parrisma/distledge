import React, { useState } from "react";
import TabButton from "../components/TabButton";
import PriceTab from "../components/PricesTab";
import EscrowTab from "../components/EscrowTab";

const Contract = (props) => {
    const tabs = ["Price", "Escrow"];
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
            <div className="tab-row">
                <TabButton tabName={tabs[0]} onHandleButtonClick={handleButtonClick} currentTab={tab} />
                <TabButton tabName={tabs[1]} onHandleButtonClick={handleButtonClick} currentTab={tab} />
            </div>
            <div>
                {activeTab === tabs[0] ? (
                    <PriceTab handleLogChange={props.handleLogChange} />
                ) : null}
                {activeTab === tabs[1] ? (
                    <EscrowTab handleLogChange={props.handleLogChange} />
                ) : null}
            </div>
        </div>
    );
};

export default Contract;
