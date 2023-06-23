import { addressConfig } from "../../constants";
import Account from "../../components/Account";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Contract = (props) => {

    return (
        <Box height="100%" width="100%">
            <Grid container>
                <Grid item xs={12}>
                    <Account accountDetail={addressConfig.escrowAccount} displayName={`Control Account`} withHeader={true} />
                </Grid>
                <Grid item xs={12}>
                    <Account accountDetail={addressConfig.dataAccount} displayName={`Data Provider`} withHeader={false} />
                </Grid>
                <Grid item xs={12}>
                    <Account accountDetail={addressConfig.sellerAccount} displayName={`Option Issuer`} withHeader={false} />
                </Grid>
                <Grid item xs={12}>
                    <Account accountDetail={addressConfig.buyerAccount} displayName={`Option Buyer 1`} withHeader={false} />
                </Grid>
                <Grid item xs={12}>
                    <Account accountDetail={addressConfig.buyer2Account} displayName={`Option Buyer 2`} withHeader={false} />
                </Grid>
                <Grid item xs={12}>
                    <Account accountDetail={addressConfig.buyer3Account} displayName={`Option Buyer 3`} withHeader={false} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Contract;
