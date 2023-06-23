import * as React from "react";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getOptionById, valueOptionById } from "../lib/ERC721Util";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionDetail, setOptionDetail] = useState({});
    var [optionValuation, setOptionValuation] = useState({});

    async function update(optionId) {
        if (isWeb3Enabled) {
            var res = await getOptionById(optionId);
            if (res.hasOwnProperty('okCode')) {
                setOptionDetail(res.message.terms);
                var valRes = await valueOptionById(optionId);
                if (valRes.hasOwnProperty('okCode')) {
                    setOptionValuation(valRes.message);
                } else {
                    props.handleLogChange(`Failed to get OptionList from WebServer [${res.errorCode}]`);
                    setOptionValuation({});
                }
            } else {
                props.handleLogChange(`Failed to get OptionList from WebServer [${res.errorCode}]`);
                setOptionDetail({});
            }
        } else {
            props.handleLogChange(`OptionList: Not Web3 Connected`);
        }
    }

    useEffect(() => {
        update(props.optionId);
    }, [isWeb3Enabled, props.buyerAccount]);

    return (
        <Box height="100%" width="100%" sx={{
            border: 0,
            bgcolor: 'background.paper',
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "10px"
        }}>            {props.rowNum === 0 ? (
            <Grid container sx={{ minWidth: 700, color: 'primary.main', fontWeight: 'bold' }} spacing={1} columns={7}>
                <Grid item xs={1}>
                    Option Id
                </Grid>
                <Grid item xs={2}>
                    Option Name
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
            {optionDetail !== undefined && optionDetail.hasOwnProperty('uniqueId') ? (
                <Grid container sx={{ minWidth: 700 }} spacing={1} columns={7}>
                    <Grid item xs={1}>
                        {props.optionId}
                    </Grid>
                    <Grid item xs={2}>
                        {optionDetail.optionName}
                    </Grid>
                    <Grid item xs={1}>
                        {optionDetail.notional}
                    </Grid>
                    <Grid item xs={1}>
                        {optionDetail.strike}
                    </Grid>
                    <Grid item xs={1}>
                        {Number(optionValuation.value).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </Grid>
                    <Grid item xs={1}>
                        <Button
                            variant="outlined"
                            onClick={() => {
                                props.handleExercise(props.optionId, optionValuation.value);
                            }}>
                            <div>Exercise</div>
                        </Button>
                    </Grid>
                </Grid>
            ) :
                <div />
            }
        </Box>
    );
};

export default Contract;
