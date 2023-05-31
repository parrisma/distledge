import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { getERC721MintedOptionList } from "../lib/ERC721Util";
import MintedOption from "./MintedOption";
import OfferedOption from "./OfferedOption";

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionList, setOptionList] = useState([]);

    async function update(buyerAccount) {
        if (isWeb3Enabled) {
            const res = JSON.parse(await getERC721MintedOptionList());
            if (res.hasOwnProperty('okCode')) {
                setOptionList(res.message.terms);
            } else {
                props.handleLogChange(`Failed to get OptionList from WebServer [${res.errorCode}]`);
            }
        } else {
            props.handleLogChange(`OptionList: Not Web3 Connected`);
        }
    }

    useEffect(() => {
        if (props.minted) {
            // Get the minted option details from server
            update(props.buyerAccount);
        } else {
            // Get the offered option details as passed by properties
            setOptionList(props.offeredOptionList);
        }
    }, [isWeb3Enabled, props.buyerAccount, props.offeredOptionList]);

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
