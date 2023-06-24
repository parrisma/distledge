import SettlementTokenDropDown from "../components/dropdown/SettlementTokenDropDown";
import StableCoinDropDown from "../components/dropdown/StableCoinDropDown";
import FXRateDropDown from "../components/dropdown/FXRateDropDown";
import ReferenceLevelDropDown from "../components/dropdown/ReferenceLevelDropDown";
import { GloballyUniqueId } from "../lib/GloballyUniqueId";
import { formatOptionTypeOneTerms } from "../../lib/SimpleOptionTypeOne";
import { useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';

const Contract = (props) => {

    var [uniqueId, setUniqueId] = useState(`${GloballyUniqueId()}`);
    var [optionName, setOptionName] = useState("");
    var [description, setDescription] = useState("");
    var [premium, setPremium] = useState("");
    var [premiumTokenAddress, setPremiumTokenAddress] = useState("");
    var [settlementTokenAddress, setSettlementTokenAddress] = useState("");
    var [notional, setNotional] = useState("");
    var [strike, setStrike] = useState("");
    var [referenceLevelAddress, setReferenceLevelAddress] = useState("");
    var [fxReferenceLevelAddress, setFxReferenceLevelAddress] = useState("");

    return (
        <Box height="100%" width="100%" sx={{
            border: 0,
            bgcolor: 'background.paper',
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "10px"
        }}>
            <Grid container spacing={1} columns={1}>
                <Grid item xs={1}>
                    <TextField
                        label="Unique Id"
                        defaultValue={uniqueId || GloballyUniqueId()}
                        onChange={(event) => { setUniqueId(event.target.value); }}
                        variant="filled"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        label="Option Name"
                        defaultValue={optionName || ""}
                        onChange={(event) => { setOptionName(event.target.value); }}
                        variant="filled"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        label="Description"
                        defaultValue={description || ""}
                        onChange={(event) => { setDescription(event.target.value); }}
                        variant="filled"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        label="Premium"
                        defaultValue={premium || ""}
                        onChange={(event) => { setPremium(event.target.value); }}
                        type="number"
                        variant="filled"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <StableCoinDropDown
                        handleChange={(value) => { setPremiumTokenAddress(value); }}
                        label={`Premium Coin`} />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        label="Notional"
                        defaultValue={notional || ""}
                        onChange={(event) => { setNotional(event.target.value); }}
                        type="number"
                        variant="filled"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <ReferenceLevelDropDown
                        handleChange={(value) => { setReferenceLevelAddress(value); }}
                        label={`Reference Level`} />
                </Grid>
                <Grid item xs={1}>
                    <TextField
                        label="Strike"
                        defaultValue={strike || ""}
                        onChange={(event) => { setStrike(event.target.value); }}
                        type="number"
                        variant="filled"
                        size="small"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                    />
                </Grid>
                <Grid item xs={1}>
                    <SettlementTokenDropDown
                        handleChange={(value) => { setSettlementTokenAddress(value); }}
                        label={`Settlement Token`} />
                </Grid>
                <Grid item xs={1}>
                    <FXRateDropDown
                        handleChange={(value) => { setFxReferenceLevelAddress(value); }}
                        label={`Settlement Token`} />
                </Grid>
                <Grid item xs={1}>
                    <div />
                </Grid>
                <Grid item xs={1}>
                    {props.handleOfferOption !== undefined ? (
                        <Button
                            variant="outlined"
                            sx={{ fontSize: '14px', pt: 0.1, pb: 0.1, whiteSpace: 'nowrap', textTransform: "none" }}
                            onClick={() => {
                                props.handleOfferOption(
                                    formatOptionTypeOneTerms(
                                        uniqueId,
                                        optionName,
                                        description,
                                        premium,
                                        premiumTokenAddress,
                                        settlementTokenAddress,
                                        notional,
                                        strike,
                                        referenceLevelAddress,
                                        fxReferenceLevelAddress)
                                );
                            }}
                        >
                            <div>Offer Option</div>
                        </Button>
                    ) : <div />}
                </Grid>
            </Grid>
        </Box>
    );
};

export default Contract;
