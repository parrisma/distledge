import SettlementTokenDropDown from "../components/dropdown/SettlementTokenDropDown";
import StableCoinDropDown from "../components/dropdown/StableCoinDropDown";
import FXRateDropDown from "../components/dropdown/FXRateDropDown";
import ReferenceLevelDropDown from "../components/dropdown/ReferenceLevelDropDown";
import InputField from "../components/InputField";
import { GloballyUniqueId } from "../lib/GloballyUniqueId";
import { formatOptionTypeOneTerms } from "../../lib/SimpleOptionTypeOne";
import { useState } from "react";

const Contract = (props) => {

    var [uniqueId, setUniqueId] = useState(`${GloballyUniqueId()}`);
    var [optionName, setOptionName] = useState("");
    var [description, setDescription] = useState("");
    var [premium, setPremium] = useState("");
    var [premiumTokenAddress, setPremiumTokenAddress] = useState("");
    var [settlementTokenAddress, setSettlementTokenAddress] = useState("");
    var [notional, setNotional] = useState("");
    var [strike, setStrike] = useState("");
    var [referenceLevelAddress, setReferenceLevelAddress] = useState("");
    var [fxReferenceLevelAddress, setFxReferenceLevelAddress] = useState("");

    return (
        <div>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Unique Id</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={uniqueId || GloballyUniqueId()}
                            handleValueChange={(value) => { setUniqueId(value); }}
                            width={"300px"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Contract Name</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={optionName || ""}
                            placeholder={"The name of the contract"}
                            handleValueChange={(value) => { setOptionName(value); }}
                            width={"300px"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Description</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={description || ""}
                            placeholder={"A description of the contract"}
                            handleValueChange={(value) => { setDescription(value); }}
                            width={"300px"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Premium</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={premium || ""}
                            handleValueChange={(value) => { setPremium(value); }}
                            width={"300px"}
                            type={"number"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Premium Token</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <StableCoinDropDown
                            handleChange={(value) => { setPremiumTokenAddress(value); }}
                            placeholder={`Premium Coin`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Notional</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={notional || ""}
                            handleValueChange={(value) => { setNotional(value); }}
                            width={"300px"}
                            type={"number"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Reference Level</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <ReferenceLevelDropDown
                            handleChange={(value) => { setReferenceLevelAddress(value); }}
                            placeholder={`Reference Level`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Strike</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={strike || ""}
                            handleValueChange={(value) => { setStrike(value); }}
                            width={"300px"}
                            type={"number"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Settlement Token</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <SettlementTokenDropDown
                            handleChange={(value) => { setSettlementTokenAddress(value); }}
                            placeholder={`Settlement Token`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        <p>Settlement FX Rate</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <FXRateDropDown
                            handleChange={(value) => { setFxReferenceLevelAddress(value); }}
                            placeholder={`Settlement Rate`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-mid">
                        {props.handleOfferOption !== undefined ? (
                            <button
                                className="button"
                                onClick={() => {
                                    props.handleOfferOption(
                                        formatOptionTypeOneTerms(
                                            uniqueId,
                                            optionName,
                                            description,
                                            premium,
                                            premiumTokenAddress,
                                            settlementTokenAddress,
                                            notional,
                                            strike,
                                            referenceLevelAddress,
                                            fxReferenceLevelAddress)
                                    );
                                }}
                            >
                                <div>Offer Option</div>
                            </button>
                        ) : ``}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;
