import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Header from "../components/Header";
import ContractEntrance from "../components/ContractEntrance";

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
        <ContractEntrance />
      </div>
    </>
  );
}
