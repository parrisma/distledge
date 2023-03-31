import styles from "@/styles/Home.module.css";
import Header from "../components/Header";
import Console from "../components/Console";
import MainTabs from "../components/MainTabs";
import { handleLogChange } from "@/lib/ConsoleUtil";
import { useState } from "react";

export default function Home() {

  const [log, SetLog] = useState(`The console started...`);

  return (
    <>
      <div className={styles.container}>
        <Header />
        <MainTabs handleLogChange={(newLogMessage) => { handleLogChange(SetLog, log, newLogMessage) }} />
        <Console outputContent={log} />
      </div>
    </>
  );
}
