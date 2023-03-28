import styles from "@/styles/Home.module.css";
import Header from "../components/Header";
import OutputWindow from "../components/OutputWindow";
import MainTabs from "../components/MainTabs";
import { useState } from "react";

export default function Home() {
  const [log, SetLog] = useState("The console started...");

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
        <Header/>
        <MainTabs handleLogChange={handleLogChange}/>
        <OutputWindow outputContent={log} />
      </div>
    </>
  );
}
