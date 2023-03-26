import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Header from "../components/Header";
import Price from "../components/Price";
import EscrowManager from "../components/EscrowManager";
import { addressConfig } from "../constants";
import OutputWindow from "../components/OutputWindow";
import { useState } from "react";

export default function Home() {
  const [activeTab, SetActiveTab] = useState("Price");
  const [log, SetLog] = useState("The console started...");
  const handleTabChange = (tab) => {
    SetActiveTab(tab);
  };
  const handleLogChange = (newlog) => {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "numeric",
      hour12: false,
    });
    SetLog(`${log}\n${currentTime}:${newlog}`);
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Dist Ledger</title>
          <meta name="description" content="Our Option Smart Contract" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header onHeaderTabChange={handleTabChange} />
        {activeTab === "Price" ? (
          <div>
            <Price
              contract={{
                address: addressConfig["teslaEquityPriceContract"]
                  ? addressConfig["teslaEquityPriceContract"]
                  : null,
                type: "equity",
              }}
              onAddInfo={handleLogChange}
            />
            <Price
              contract={{
                address: addressConfig["UsdEurFXRateContract"]
                  ? addressConfig["UsdEurFXRateContract"]
                  : null,
                type: "fx",
              }}
              onAddInfo={handleLogChange}
            />
          </div>
        ) : null}
        {activeTab === "Escrow" ? (
          <div>
            <EscrowManager
              contract={{
                address: addressConfig["usdEscrowAccount"]
                  ? addressConfig["usdEscrowAccount"]
                  : null,
              }}
            />
          </div>
        ) : null}
        <OutputWindow outputContent={log} />
      </div>
    </>
  );
}
