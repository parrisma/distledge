import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { valueOptionByPOSTRequest } from "../lib/ERC721Util";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionValuation, setOptionValuation] = useState({ "value": "0" });

    async function update(optionDetail) {
        console.log(`Update valuation by POST`);
        try {
            var valRes = await valueOptionByPOSTRequest(optionDetail);
            if (valRes.hasOwnProperty('okCode')) {
                console.log(`VAL POST RESP [${valRes}]`);
                //setOptionValuation(valRes.message);
            } else {
                console.log(`Failed to get OptionList from WebServer [${res.errorCode}]`);
                setOptionValuation({});
            }
        } catch (err) {
            console.log(`Failed to value offered option by POST with [${err.message}]`);
        }
    }

    useEffect(() => {
        update(props.optionDetail);
    }, [isWeb3Enabled, props.buyerAccount]);

    return (
        <div className="div-table">
            {props.rowNum === 0 ? (
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        Unique Id
                    </div>
                    <div className="div-table-col-fix-wide">
                        Option Name
                    </div>
                    <div className="div-table-col-fix-number">
                        Notional
                    </div>
                    <div className="div-table-col-fix-number">
                        Strike
                    </div>
                    <div className="div-table-col-fix-number-right">
                        Value
                    </div>
                </div>
            ) :
                <div />
            }
            {props.optionDetail !== undefined && props.optionDetail.hasOwnProperty('uniqueId') ? (
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        {props.optionDetail.uniqueId}
                    </div>
                    <div className="div-table-col-fix-wide">
                        {props.optionDetail.optionName}
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.optionDetail.notional}
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.optionDetail.strike}
                    </div>
                    <div className="div-table-col-fix-number-right">
                        {Number(optionValuation.value).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                    </div>
                </div>
            ) :
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        {``}
                    </div>
                </div>
            }
        </div>
    );
};

export default Contract;
