import * as React from "react";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { valueOptionByPOSTRequest, emptyValuationResponse } from "../lib/ERC721Util";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionValuation, setOptionValuation] = useState(emptyValuationResponse());

    async function update(optionDetail) {
        console.log(`Update valuation by POST`);
        try {
            var valRes = await valueOptionByPOSTRequest(optionDetail);
            if (valRes.hasOwnProperty('okCode')) {
                setOptionValuation({
                    "value": `${valRes.message.value}`,
                    "parameters": valRes.message.parameters
                });
                console.log(`Option Val [${JSON.stringify(optionValuation, null, 4)}]`);
            } else {
                props.handleLogChange(`Failed to get OptionList from WebServer [${res.errorCode}]`);
                setOptionValuation(emptyValuationResponse());
            }
        } catch (err) {
            props.handleLogChange(`Failed to value offered option by POST with [${err.message}]`);
        }
    }

    useEffect(() => {
        update(props.optionDetail);
    }, [isWeb3Enabled, props.buyerAccount]);

    return (
        <Box height="100%" width="100%" sx={{
            border: 0,
            bgcolor: 'background.paper',
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "10px"
        }}>
            {props.rowNum === 0 ? (
                <Grid container sx={{ minWidth: 700, color: 'primary.main', fontWeight: 'bold' }} spacing={1} columns={10}>
                    <Grid item xs={3}>
                        Unique Id
                    </Grid>
                    <Grid item xs={2}>
                        Option Name
                    </Grid>
                    <Grid item xs={1}>
                        Premium
                    </Grid>
                    <Grid item xs={1}>
                        Notional
                    </Grid>
                    <Grid item xs={1}>
                        Strike
                    </Grid>
                    <Grid item xs={1}>
                        Value
                    </Grid>
                    <Grid item xs={1}>
                        Action
                    </Grid>
                </Grid>
            ) :
                <div />
            }
            {props.optionDetail !== undefined && props.optionDetail.hasOwnProperty('uniqueId') ? (
                <Grid container sx={{ minWidth: 700 }} spacing={1} columns={10}>
                    <Grid item xs={3}>
                        {props.optionDetail.uniqueId}
                    </Grid>
                    <Grid item xs={2}>
                        {props.optionDetail.optionName}
                    </Grid>
                    <Grid item xs={1}>
                        {props.optionDetail.premium}
                    </Grid>
                    <Grid item xs={1}>
                        {props.optionDetail.notional}
                    </Grid>
                    <Grid item xs={1}>
                        {props.optionDetail.strike}
                    </Grid>
                    <Grid item xs={1}>
                        {Number(optionValuation.value).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.handleAction(props.optionDetail.uniqueId);
                            }}>
                            <div>{props.action}</div>
                        </Button>
                    </Grid>
                </Grid>
            ) :
                <div />
            }
        </Box >
    );
};

export default Contract;
