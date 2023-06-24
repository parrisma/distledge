import * as React from 'react';
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Accounts from '../pages/tabs/accounts'
import Escrow from '../pages/tabs/escrow'
import Prices from '../pages/tabs/price'
import Buyer from '../pages/tabs/purchase'
import Seller from '../pages/tabs/sell'
import TabPanel from '../pages/tabs/panel'

const NavigationBar = (props) => {

  const { isWeb3Enabled } = useMoralis();
  const [value, setValue] = useState(0);
  const [connected, setConnected] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    setConnected(isWeb3Enabled);
  }, [isWeb3Enabled])

  return (
    <Grid container spacing={0} columns={1}>
      <Grid item xs={1}>
        <Box height="100%" width="100%" sx={{ flexGrow: 1, display: 'flex', pb: 1 }}>
          <Tabs
            orientation="horizontal"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="main-dl-tabs">
            <Tab sx={{ textTransform: "none", fontSize: '16px' }} label="Accounts" />
            <Tab sx={{ textTransform: "none", fontSize: '16px' }} label="Escrow" />
            <Tab sx={{ textTransform: "none", fontSize: '16px' }} label="Prices" />
            <Tab sx={{ textTransform: "none", fontSize: '16px' }} label="Seller" />
            <Tab sx={{ textTransform: "none", fontSize: '16px' }} label="Buyer" />
          </Tabs>
        </Box>
      </Grid>
      <Grid item xs={1}>
        {isWeb3Enabled ?
          (
            <Box height="100%" width="100%">
              <TabPanel value={value} index={0}>
                <Accounts />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Escrow />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <Prices />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Seller />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <Buyer />
              </TabPanel>
            </Box>
          ) :
          (
            <Box height="100%" width="100%" sx={{ pt: 1 }}>
              <Typography variant="h7" color="error.main" >Not connected, Press Connect Wallet</Typography>
            </Box>
          )
        }
      </Grid>
    </Grid>
  );
}

export default NavigationBar;