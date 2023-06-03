import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Layout from "@/components/Layout";
import { OfferedOptionProvider } from "../context/offeredOption";
import { ConsoleLogProvider } from "../context/consoleLog";

export default function App({ Component, pageProps }) {
  return (    
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <OfferedOptionProvider>
            <ConsoleLogProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ConsoleLogProvider>
          </OfferedOptionProvider>
        </NotificationProvider>
      </MoralisProvider>    
  );
}
