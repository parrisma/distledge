import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Layout from "@/components/Layout";
import { MintedOptionProvider } from "../context/mintedOption";
import { ConsoleLogProvider } from "../context/consoleLog";

export default function App({ Component, pageProps }) {
  return (    
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <MintedOptionProvider>
            <ConsoleLogProvider>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </ConsoleLogProvider>
          </MintedOptionProvider>
        </NotificationProvider>
      </MoralisProvider>    
  );
}
