import SettlementTokenDropDown from "../components/dropdown/SettlementTokenDropDown";
import StableCoinDropDown from "../components/dropdown/StableCoinDropDown";
import FXRateDropDown from "../components/dropdown/FXRateDropDown";
import ReferenceLevelDropDown from "../components/dropdown/ReferenceLevelDropDown";
import InputField from "../components/InputField";
import { GloballyUniqueId } from "../lib/GloballyUniqueId";
import { formatOptionTypeOneTerms } from "../../lib/SimpleOptionTypeOne";
import { useState } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";

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
            <Grid container sx={{ minWidth: 700 }} spacing={1} columns={4}>
                <Grid item xs={1}>
                    Unique Id
                </Grid>
                <Grid item xs={3}>
                    <InputField
                        value={uniqueId || GloballyUniqueId()}
                        handleValueChange={(value) => { setUniqueId(value); }}
                        width={"300px"} />
                </Grid>
                <Grid item xs={1}>
                    <p>Contract Name</p>
                </Grid>
                <Grid item xs={3}>
                    <InputField
                        value={optionName || ""}
                        placeholder={"The name of the contract"}
                        handleValueChange={(value) => { setOptionName(value); }}
                        width={"300px"} />
                </Grid>
                <Grid item xs={1}>
                    <p>Description</p>
                </Grid>
                <Grid item xs={3}>
                    <InputField
                        value={description || ""}
                        placeholder={"A description of the contract"}
                        handleValueChange={(value) => { setDescription(value); }}
                        width={"300px"} />
                </Grid>
                <Grid item xs={1}>
                    <p>Premium</p>
                </Grid>
                <Grid item xs={3}>
                    <InputField
                        value={premium || ""}
                        handleValueChange={(value) => { setPremium(value); }}
                        width={"300px"}
                        type={"number"} />
                </Grid>
                <Grid item xs={1}>
                    <p>Premium Token</p>
                </Grid>
                <Grid item xs={3}>
                    <StableCoinDropDown
                        handleChange={(value) => { setPremiumTokenAddress(value); }}
                        placeholder={`Premium Coin`} />
                </Grid>
                <Grid item xs={1}>
                    <p>Notional</p>
                </Grid>
                <Grid item xs={3}>
                    <InputField
                        value={notional || ""}
                        handleValueChange={(value) => { setNotional(value); }}
                        width={"300px"}
                        type={"number"} />
                </Grid>
                <Grid item xs={1}>
                    <p>Reference Level</p>
                </Grid>
                <Grid item xs={3}>
                    <ReferenceLevelDropDown
                        handleChange={(value) => { setReferenceLevelAddress(value); }}
                        placeholder={`Reference Level`} />
                </Grid>
                <Grid item xs={1}>
                    <p>Strike</p>
                </Grid>
                <Grid item xs={3}>
                    <InputField
                        value={strike || ""}
                        handleValueChange={(value) => { setStrike(value); }}
                        width={"300px"}
                        type={"number"} />
                </Grid>
                <Grid item xs={1}>
                    <p>Settlement Token</p>
                </Grid>
                <Grid item xs={3}>
                    <SettlementTokenDropDown
                        handleChange={(value) => { setSettlementTokenAddress(value); }}
                        placeholder={`Settlement Token`} />
                </Grid>
                <Grid item xs={1}>
                    <p>Settlement FX Rate</p>
                </Grid>
                <Grid item xs={3}>
                    <FXRateDropDown
                        handleChange={(value) => { setFxReferenceLevelAddress(value); }}
                        placeholder={`Settlement Rate`} />
                </Grid>
                <Grid item xs={1}>
                    <div />
                </Grid>
                <Grid item xs={3}>
                    {props.handleOfferOption !== undefined ? (
                        <Button
                            variant="outlined"
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
