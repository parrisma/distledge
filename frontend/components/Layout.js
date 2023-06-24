import MenuAndTabs from "./MenuAndTabs"
import Header from "./Header";
import Console from "./Console";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useConsoleLogContext } from "../context/consoleLog";


export default function Layout({ children }) {

  const [logs] = useConsoleLogContext();

  return (
    <Box height="100%" width="100%" sx={{ fontSize: '14px' }}>
      <Grid container columns={1}>
        <Grid item xs={1}>
          <Header />
        </Grid>
        <Grid item xs={1}>
          <MenuAndTabs></MenuAndTabs>
        </Grid>
        <Grid item xs={1}>
          <Console outputContent={logs} />
        </Grid>
      </Grid>
    </Box>
  );
}