import { addressConfig } from "../../constants";
import Account from "../../components/Account";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Contract = (props) => {

    return (
        <Box sx={{ width: '1400px', overflow: 'auto' }}>
            <Grid container columns={1}>
                <Grid item xs={1}>
                    <Account accountDetail={addressConfig.escrowAccount} displayName={`Control Account`} withHeader={true} />
                </Grid>
                <Grid item xs={1}>
                    <Account accountDetail={addressConfig.dataAccount} displayName={`Data Provider`} withHeader={false} />
                </Grid>
                <Grid item xs={1}>
                    <Account accountDetail={addressConfig.sellerAccount} displayName={`Option Issuer`} withHeader={false} />
                </Grid>
                <Grid item xs={1}>
                    <Account accountDetail={addressConfig.buyerAccount} displayName={`Option Buyer 1`} withHeader={false} />
                </Grid>
                <Grid item xs={1}>
                    <Account accountDetail={addressConfig.buyer2Account} displayName={`Option Buyer 2`} withHeader={false} />
                </Grid>
                <Grid item xs={1}>
                    <Account accountDetail={addressConfig.buyer3Account} displayName={`Option Buyer 3`} withHeader={false} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Contract;
