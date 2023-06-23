import { ConnectButton } from "web3uikit";
import Head from "next/head";
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const Header = (props) => {
  return (
    <Box height="100%" width="100%">
      <Head>
        <title>Dist Ledger</title>
        <meta name="description" content="Our Option Smart Contract" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MuiAppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Distributed Ledger
          </Typography>
          <ConnectButton className="item-right" moralisAuth={false} />
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};

export default Header;
