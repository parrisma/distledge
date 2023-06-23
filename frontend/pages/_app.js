import * as React from "react";
import "@/styles/globals.css";
import { MoralisProvider } from "react-moralis";
import { NotificationProvider } from "web3uikit";
import Layout from "@/components/Layout";
import { OfferedOptionProvider } from "../context/offeredOption";
import { ConsoleLogProvider } from "../context/consoleLog";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import { blue, yellow } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <Box height="100%" width="100%" sx={{ border: 0, bgcolor: 'background.paper' }}>
        <CssBaseline />
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
      </Box>
    </ThemeProvider>
  );
}
