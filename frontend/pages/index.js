import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Header from "../components/Header";
import PriceTab from "../components/PricesTab";
import EscrowTab from "../components/EscrowTab";
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
          <PriceTab handleLogChange={handleLogChange} />
        ) : null}
        {activeTab === "Escrow" ? (
          <div>
            <EscrowTab handleLogChange={handleLogChange} />
          </div>
        ) : null}
        <OutputWindow outputContent={log} />
      </div>
    </>
  );
}
