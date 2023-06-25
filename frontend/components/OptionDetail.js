import * as React from 'react';
import { useState, useEffect } from "react";
import { getAddressName } from "@/lib/DisplayName";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function OptionDetail(props) {

    const [value, setValue] = useState(0);
    const [refLevelValue, setRefLevelValue] = useState(0);
    const [optionType, setOptionType] = useState("?");
    const [uniqueId, setUniqueId] = useState("?");
    const [description, setDescription] = useState("?");
    const [notional, setNotional] = useState(0);
    const [strike, setStrike] = useState(0);
    const [refLevel, setRefLevel] = useState("?");
    const [premium, setPremium] = useState(0);
    const [premiumToken, setPremiumToken] = useState("?");
    const [settlementToken, setSettlementToken] = useState("?");
    const [fxReferenceLevel, setFxReferenceLevel] = useState("?");
    const [seller, setSeller] = useState("?");

    console.log(`Val: [${JSON.stringify(props.valuation,null,2)}]`)
    useEffect(() => {
        // Check details exist, as worst case empty JSON is passed via props while WebServer response pending
        if (props.valuation.hasOwnProperty(`value`)) {
            setValue(props.valuation.value);
        }
        if (props.valuation.hasOwnProperty(`parameters`)) {
            setRefLevelValue(props.valuation.parameters.referenceLevel);
        }
        if (props.detail.hasOwnProperty(`type`)) {
            setOptionType(props.detail.type);
        }
        if (props.detail.hasOwnProperty(`uniqueId`)) {
            setUniqueId(props.detail.uniqueId);
        }
        if (props.detail.hasOwnProperty(`description`)) {
            setDescription(props.detail.description);
        }
        if (props.detail.hasOwnProperty(`notional`)) {
            setNotional(props.detail.notional);
        }
        if (props.detail.hasOwnProperty(`premium`)) {
            setPremium(props.detail.premium);
        }
        if (props.detail.hasOwnProperty(`strike`)) {
            setStrike(props.detail.strike);
        }
        if (props.detail.hasOwnProperty(`referenceLevel`)) {
            setRefLevel(props.detail.referenceLevel);
        }
        if (props.detail.hasOwnProperty(`premiumToken`)) {
            setPremiumToken(props.detail.premiumToken);
        }
        if (props.detail.hasOwnProperty(`settlementToken`)) {
            setSettlementToken(props.detail.settlementToken);
        }
        if (props.detail.hasOwnProperty(`fxReferenceLevel`)) {
            setFxReferenceLevel(props.detail.fxReferenceLevel);
        }
        if (props.detail.hasOwnProperty(`seller`)) {
            setSeller(props.detail.seller);
        }
    }, [props.detail, props.valuation]);

    return (
        <Dialog
            onClose={props.handleClose}
            open={props.open}>
            <DialogTitle>{props.optionId} - {props.detail.optionName}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} columns={1}>
                    <Grid item xs={1}>
                        <TextField value={value} label="Current Value" variant="filled" size="small" fullWidth />
                        <TextField value={refLevelValue} label="Current Reference Level" variant="filled" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField value={optionType} label="Option Type" variant="filled" size="small" fullWidth />
                        <TextField value={uniqueId} label="Unique Id" variant="filled" size="small" fullWidth />
                        <TextField value={description} label="Description" variant="filled" size="small" fullWidth />
                        <TextField value={notional} label="Notional" variant="filled" size="small" fullWidth />
                        <TextField value={strike} label="Strike" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(refLevel)} label="Reference Level" variant="filled" size="small" fullWidth />
                        <TextField value={premium} label="Premium" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(premiumToken)} label="Premium Token" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(settlementToken)} label="Settlement Token" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(fxReferenceLevel)} label="Settlement FX" variant="filled" size="small" fullWidth />
                        <TextField value={seller} label="Seller Account" variant="filled" size="small" fullWidth />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    autoFocus
                    variant="outlined"
                    sx={{ fontSize: '14px', pt: 0.1, pb: 0.1, whiteSpace: 'nowrap', textTransform: "none" }}
                    onClick={() => { props.handleClose() }}>
                    <div>Ok</div>
                </Button>
            </DialogActions>
        </Dialog>
    );
}