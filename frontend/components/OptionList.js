import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import MintedOption from "./MintedOption";
import OfferedOption from "./OfferedOption";
const { addressConfig } = require("../constants");

const Contract = (props) => {

    const { isWeb3Enabled } = useMoralis();
    var [optionList, setOptionList] = useState([]);
    const [erc721ContractAddress, setERC721ContractAddress] = useState(`${addressConfig.erc721OptionContractTypeOne}`);

    useEffect(() => {
        if (props.minted) {
            // Get the offered option details as passed by properties
            setOptionList(props.minedOptions);
        } else {
            // Get the offered option details as passed by properties
            setOptionList(props.offeredOptionList);
        }
        console.log(`ERC721: [${erc721ContractAddress}]`);
    }, [isWeb3Enabled, props.buyerAccount, props.offeredOptionList, props.minedOptions, erc721ContractAddress]);

    return (
        <div className="option-list">
            {optionList !== undefined && optionList.length > 0 && props.minted === true ? (
                <ul className="no-bullet">{optionList.map((item, index) => <li key={index}><MintedOption
                    optionId={item.optionId}
                    rowNum={index}
                    handleExercise={props.handleExercise}
                    handleLogChange={props.handleLogChange} /></li>)}
                </ul>
            ) : (``)}
            {optionList !== undefined && optionList.length > 0 && props.offered === true && props.asSeller === true ? (
                <ul className="no-bullet">{optionList.map((item, index) => <li key={index}><OfferedOption
                    optionDetail={item}
                    rowNum={index}
                    handleAction={props.handleDel}
                    action={`Delete`}
                    handleLogChange={props.handleLogChange} /></li>)}
                </ul>
            ) : (``)}
            {optionList !== undefined && optionList.length > 0 && props.offered === true && props.asSeller === false ? (
                <ul className="no-bullet">{optionList.map((item, index) => <li key={index}><OfferedOption
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
