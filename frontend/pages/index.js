import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Header from "../components/Header";
import Price from "../components/Price";
import StableToken from "../components/StableToken";
import { addressConfig } from "../constants";

export default function Home() {
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Dist Ledger</title>
          <meta name="description" content="Our Option Smart Contract" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <div className="div-table">
          <div className="div-table-row">
            <div className="div-table-col-fix-wide">
              <Price contract={{
                address: addressConfig["teslaEquityPriceContract"]
                  ? addressConfig["teslaEquityPriceContract"]
                  : null,
                type: "equity"
              }} />
            </div>
            <div className="div-table-col-fix-wide">
              <StableToken contract={{
                address: addressConfig["usdStableCoin"]
                  ? addressConfig["usdStableCoin"]
                  : null,
                type: "usdStableCoin"
              }} />
            </div>
          </div>
          <div className="div-table-row">
            <div className="div-table-col-fix-wide">
              <Price contract={{
                address: addressConfig["UsdEurFXRateContract"]
                  ? addressConfig["UsdEurFXRateContract"]
                  : null,
                type: "fx"
              }} />
            </div>
            <div className="div-table-col-fix-wide">
              <StableToken contract={{
                address: addressConfig["eurStableCoin"]
                  ? addressConfig["eurStableCoin"]
                  : null,
                type: "eurStableCoin"
              }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
