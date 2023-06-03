import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import MintedOption from "./MintedOption";
import OfferedOption from "./OfferedOption";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionList, setOptionList] = useState([]);    

    useEffect(() => {
        if (props.minted) {
            // Get the offered option details as passed by properties
            setOptionList(props.minedOptions);
        } else {
            // Get the offered option details as passed by properties
            setOptionList(props.offeredOptionList);
        }
    }, [isWeb3Enabled, props.buyerAccount, props.offeredOptionList,props.minedOptions]);

    return (
        <div className="option-list">
            {optionList !== undefined && optionList.length > 0 && props.minted === true ? (
                <ul>{optionList.map((item, index) => <li key={index}><MintedOption
                    optionId={item.optionId}
                    rowNum={index}
                    handleExercise={props.handleExercise}
                    handleLogChange={props.handleLogChange} /></li>)}
                </ul>
            ) : (``)}
            {optionList !== undefined && optionList.length > 0 && props.offered === true && props.asSeller === true ? (
                <ul>{optionList.map((item, index) => <li key={index}><OfferedOption
                    optionDetail={item}
                    rowNum={index}
                    handleAction={props.handleDel}
                    action={`Delete`}
                    handleLogChange={props.handleLogChange} /></li>)}
                </ul>
            ) : (``)}
            {optionList !== undefined && optionList.length > 0 && props.offered === true && props.asSeller === false ? (
                <ul>{optionList.map((item, index) => <li key={index}><OfferedOption
                    optionDetail={item}
                    rowNum={index}
                    handleAction={props.handleBuy}
                    action={`Buy`}
                    handleLogChange={props.handleLogChange} /></li>)}
                </ul>
            ) : (``)}
        </div>
    );
};

export default Contract;
