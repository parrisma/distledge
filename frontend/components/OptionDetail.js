import * as React from 'react';
import { getAddressName } from "@/lib/DisplayName";
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';

export default function OptionDetail(props) {

    return (
        <Dialog
            onClose={props.handleClose}
            open={props.open}>
            <DialogTitle>{props.optionId} - {props.detail.optionName}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} columns={1}>
                    <Grid item xs={1}>
                        <TextField value={props.valuation.value} label="Current Value" variant="filled" size="small" fullWidth />
                        <TextField value={props.valuation.parameters.referenceLevel} label="Current Reference Level" variant="filled" size="small" fullWidth />
                    </Grid>
                    <Grid item xs={1}>
                        <TextField value={props.detail.type} label="Option Type" variant="filled" size="small" fullWidth />
                        <TextField value={props.detail.uniqueId} label="Unique Id" variant="filled" size="small" fullWidth />
                        <TextField value={props.detail.description} label="Description" variant="filled" size="small" fullWidth />
                        <TextField value={props.detail.notional} label="Notional" variant="filled" size="small" fullWidth />
                        <TextField value={props.detail.strike} label="Strike" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(props.detail.referenceLevel)} label="Reference Level" variant="filled" size="small" fullWidth />
                        <TextField value={props.detail.premium} label="Premium" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(props.detail.premiumToken)} label="Premium Token" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(props.detail.settlementToken)} label="Settlement Token" variant="filled" size="small" fullWidth />
                        <TextField value={getAddressName(props.detail.fxReferenceLevel)} label="Settlement FX" variant="filled" size="small" fullWidth />
                        <TextField value={props.detail.seller} label="Seller Account" variant="filled" size="small" fullWidth />
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