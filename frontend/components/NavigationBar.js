import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Accounts from '../pages/tabs/accounts'
import Escrow from '../pages/tabs/escrow'
import Prices from '../pages/tabs/price'
import Buyer from '../pages/tabs/purchase'
import Seller from '../pages/tabs/sell'
import TabPanel from '../pages/tabs/panel'

const NavigationBar = (props) => {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container wrap='nowrap'>
      <Grid item>
        <Box height="100%" width="100%" sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}>
          <Tabs
            orientation="vertical"
            variant="scrollable"
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example">
            <Tab label="Accounts" />
            <Tab label="Escrow" />
            <Tab label="Prices" />
            <Tab label="Seller" />
            <Tab label="Buyer" />
          </Tabs>
        </Box>
      </Grid>
      <Grid item>
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
      </Grid>
    </Grid>
  );
}

export default NavigationBar;