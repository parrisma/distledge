import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import MintedOption from "./MintedOption";
import OfferedOption from "./OfferedOption";
const { addressConfig } = require("../constants");
import { ERC721OptionContractTypeOneABI } from "../constants";
import { useConsoleLogContext } from "../context/consoleLog";

const Contract = (props) => {

    const [logs, setLogs] = useConsoleLogContext()
    function appendLogs(textLine) {
        logs.push(textLine);
        setLogs(logs.slice(-250))
    }

    const { isWeb3Enabled } = useMoralis();
    var [optionList, setOptionList] = useState([]);
    const [erc721ContractAddress, setERC721ContractAddress] = useState(`${addressConfig.erc721OptionContractTypeOne}`);
    const [latestBlockNum, setLatestBlockNum] = useState(undefined);

    /**
     * Establish connection to chain
     */
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(erc721ContractAddress, ERC721OptionContractTypeOneABI, provider);
    provider.getBlockNumber().then((n) => {
        setLatestBlockNum(n);
        console.log(`Block Num [${latestBlockNum}] [${n}]`);
    });

    const handleNewNotification = (msg) => {
        appendLogs(`${msg.message}`);
    };

    useEffect(() => {
        if (props.minted) {
            // Get the offered option details as passed by properties
            setOptionList(props.minedOptions);
        } else {
            // Get the offered option details as passed by properties
            setOptionList(props.offeredOptionList);
        }
    }, [isWeb3Enabled, props.buyerAccount, props.offeredOptionList, props.minedOptions]);

    // Events from chain.
    useEffect(() => {
        if (isWeb3Enabled) {
            const handleMint = async (
                value,
                event
            ) => {
                const eventBlockNumber = event.blockNumber;
                console.log(`Mint Event [${eventBlockNumber}]`);
                if (latestBlockNum !== undefined) {
                    if (eventBlockNumber > latestBlockNum) {
                        const msg = `Event, Minted Option (NFT) after purchase [${value}] @ [${eventBlockNumber}]`;
                        appendLogs(`${msg}`);
                    }
                }
            };
            const handleBurn = async (
                value,
                event
            ) => {
                const eventBlockNumber = event.blockNumber;
                console.log(`Burn Event [${eventBlockNumber}]`);
                if (latestBlockNum !== undefined) {
                    if (eventBlockNumber > latestBlockNum) {
                        const msg = `Event, Burned Option (NFT) after Exercise [${value}] @ [${eventBlockNumber}]`;
                        appendLogs(`${msg}`);
                    }
                }
            };
            const handleTransfer = async (
                value,
                from,
                to,
                event
            ) => {
                const eventBlockNumber = event.blockNumber;
                console.log(`Transfer Event [${eventBlockNumber}]`);
                if (latestBlockNum !== undefined) {
                    if (eventBlockNumber > latestBlockNum) {
                        const msg = `Event, Transferred (NFT) URI [${value}] from [${from}] to [${to}] @ [${eventBlockNumber}]`;
                        appendLogs(`${msg}`);
                    }
                }
            };
            const setSecureLevelEvents = async () => {
                contract.on("OptionMinted", handleMint, { fromBlock: 0, toBlock: "latest", });
                contract.on("OptionBurned", handleBurn, { fromBlock: 0, toBlock: "latest", });
                contract.on("OptionTransfer", handleTransfer, { fromBlock: 0, toBlock: "latest", });
            };

            setSecureLevelEvents();

            return () => {
                contract.off("OptionMinted", handleMint);
                contract.off("OptionBurned", handleBurn);
                contract.off("OptionTransfer", handleTransfer);
            };
        }
    }, [erc721ContractAddress, ERC721OptionContractTypeOneABI, isWeb3Enabled, latestBlockNum]);

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
