import NavigationBar from "./NavigationBar"
import Header from "./Header";
import Console from "./Console";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useConsoleLogContext } from "../context/consoleLog";


export default function Layout({ children }) {

  const [logs] = useConsoleLogContext();

  return (
    <Box height="100%" width="100%">
      <Grid container>
        <Grid item xs={12}>
          <Header />
        </Grid>
        <Grid item xs={12}>
          <NavigationBar></NavigationBar>
        </Grid>
        <Grid item xs={12}>
          <Console outputContent={logs} />
        </Grid>
      </Grid>
    </Box>
  );
}