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
                console.log(JSON.stringify(optionList, null, 2));
            } else {
                console.log(`Failed to get OptionList from WebServer [${res.errorCode}]`);
            }
        } else {
            console.log(`OptionList: Not Web3 Connected`);
        }
    }

    useEffect(() => {
        if (props.minted) {
            console.log(`Get Minted list from server`);
            update(props.buyerAccount);
        } else {
            console.log(`Use offered List [${props.offeredOptionList.length}]`);
            setOptionList(props.offeredOptionList);
        }
    }, [isWeb3Enabled, props.buyerAccount, props.offeredOptionList]);

    return (
        <div className="option-list">
            {optionList !== undefined && optionList.length > 0 && props.minted === true ? (
                <ul>{optionList.map((item, index) => <li key={index}><MintedOption optionId={item.optionId} rowNum={index} /></li>)}</ul>
            ) : (``)}
            {optionList !== undefined && optionList.length > 0 && props.offered === true ? (
                <ul>{optionList.map((item, index) => <li key={index}><OfferedOption optionDetail={item} rowNum={index} /></li>)}</ul>
            ) : (``)}
        </div>
    );
};

export default Contract;
