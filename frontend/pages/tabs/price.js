import Price from "../../components/Price";
import { addressConfig } from "../../constants";
import { useConsoleLogContext } from "../../context/consoleLog";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const PricePage = (props) => {

    const [logs, setLogs] = useConsoleLogContext()
    function appendLogs(textLine) {
        logs.push(textLine);
        setLogs(logs.slice(-50))
    }

    return (
        <Box sx={{
            border: 0,
            bgcolor: 'background.paper'
        }}>
            <Grid container spacing={0} columns={1}>
                <Grid item xs={1}>
                    <Price
                        contract={{
                            address: addressConfig["teslaEquityPriceContract"]
                                ? addressConfig["teslaEquityPriceContract"]
                                : null,
                            type: "equity",
                        }}
                        onAddInfo={appendLogs}
                        withHeader={true}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Price
                        contract={{
                            address: addressConfig["appleEquityPriceContract"]
                                ? addressConfig["appleEquityPriceContract"]
                                : null,
                            type: "equity",
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Price
                        contract={{
                            address: addressConfig["UsdEurFXRateContract"]
                                ? addressConfig["UsdEurFXRateContract"]
                                : null,
                            type: "fx",
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <Price
                        contract={{
                            address: addressConfig["UsdCnyFXRateContract"]
                                ? addressConfig["UsdCnyFXRateContract"]
                                : null,
                            type: "fx",
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default PricePage;
