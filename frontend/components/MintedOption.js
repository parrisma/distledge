import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getOptionById, valueOptionById } from "../lib/ERC721Util";

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
        <div className="div-table">
            {props.rowNum === 0 ? (
                <div className="div-table-row-header">
                    <div className="div-table-col-fix-number">
                        Option Id
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
                    <div className="div-table-col-fix-number">
                        Value
                    </div>
                    <div className="div-table-col">
                        Action
                    </div>
                </div>
            ) :
                <div />
            }
            {optionDetail !== undefined && optionDetail.hasOwnProperty('uniqueId') ? (
                <div className="div-table-row">
                    <div className="div-table-col-fix-number">
                        {props.optionId}
                    </div>
                    <div className="div-table-col-fix-wide">
                        {optionDetail.optionName}
                    </div>
                    <div className="div-table-col-fix-number">
                        {optionDetail.notional}
                    </div>
                    <div className="div-table-col-fix-number">
                        {optionDetail.strike}
                    </div>
                    <div className="div-table-col-fix-number">
                        <div className="item-right">
                            {Number(optionValuation.value).toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </div>
                    </div>
                    <div className="div-table-col">
                        <button
                            className="button"
                            onClick={() => {
                                props.handleExercise(props.optionId);
                            }}>
                            <div>Exercise</div>
                        </button>
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
