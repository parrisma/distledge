import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Layout from "@/components/Layout";
import { OfferedOptionProvider } from "../context/offeredOption";
import { ConsoleLogProvider } from "../context/consoleLog";
import { ThemeProvider } from "@material-ui/core/styles";
import { customTheme, defaultTheme } from "../theme/theme";

export default function App({ Component, pageProps }) {
  return (    
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <OfferedOptionProvider>
            <ConsoleLogProvider>
              <ThemeProvider theme={defaultTheme}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </ThemeProvider>
            </ConsoleLogProvider>
          </OfferedOptionProvider>
        </NotificationProvider>
      </MoralisProvider>    
  );
}
