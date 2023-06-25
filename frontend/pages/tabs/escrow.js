import StableToken from "../../components/StableToken";
import EscrowAccount from "../../components/Escrow";
import { addressConfig, StableCoinType, StableShareType, EscrowAccountType } from "../../constants";
import { useConsoleLogContext } from "../../context/consoleLog";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


const EscrowPage = (props) => {

    const [logs, setLogs] = useConsoleLogContext()
    function appendLogs(textLine) {
        logs.push(textLine);
        setLogs(logs.slice(-250))
    }

    return (
        <Box sx={{ width: '1150px', overflow: 'auto', border: 0 }}>
            <Grid container spacing={0} columns={2}>
                <Grid item xs={1}>
                    <EscrowAccount
                        contract={{
                            address: addressConfig["usdEscrowAccount"]
                                ? addressConfig["usdEscrowAccount"]
                                : null,
                            type: `${EscrowAccountType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={true}
                    />
                </Grid>
                <Grid item xs={1}>
                    <StableToken
                        contract={{
                            address: addressConfig["usdStableCoin"]
                                ? addressConfig["usdStableCoin"]
                                : null,
                            type: `${StableCoinType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={true}
                    />
                </Grid>
                <Grid item xs={1}>
                    <EscrowAccount
                        contract={{
                            address: addressConfig["eurEscrowAccount"]
                                ? addressConfig["eurEscrowAccount"]
                                : null,
                            type: `${EscrowAccountType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <StableToken
                        contract={{
                            address: addressConfig["eurStableCoin"]
                                ? addressConfig["eurStableCoin"]
                                : null,
                            type: `${StableCoinType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <EscrowAccount
                        contract={{
                            address: addressConfig["cnyEscrowAccount"]
                                ? addressConfig["cnyEscrowAccount"]
                                : null,
                            type: `${EscrowAccountType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <StableToken
                        contract={{
                            address: addressConfig["cnyStableCoin"]
                                ? addressConfig["cnyStableCoin"]
                                : null,
                            type: `${StableCoinType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <EscrowAccount
                        contract={{
                            address: addressConfig["appleEscrowAccount"]
                                ? addressConfig["appleEscrowAccount"]
                                : null,
                            type: `${EscrowAccountType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <StableToken
                        contract={{
                            address: addressConfig["appleStableShare"]
                                ? addressConfig["appleStableShare"]
                                : null,
                            type: `${StableShareType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <EscrowAccount
                        contract={{
                            address: addressConfig["teslaEscrowAccount"]
                                ? addressConfig["teslaEscrowAccount"]
                                : null,
                            type: `${EscrowAccountType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
                <Grid item xs={1}>
                    <StableToken
                        contract={{
                            address: addressConfig["teslaStableShare"]
                                ? addressConfig["teslaStableShare"]
                                : null,
                            type: `${StableShareType}`,
                        }}
                        onAddInfo={appendLogs}
                        withHeader={false}
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export default EscrowPage;
