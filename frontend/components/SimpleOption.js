import SettlementTokenDropDown from "../components/dropdown/SettlementTokenDropDown";
import StableCoinDropDown from "../components/dropdown/StableCoinDropDown";
import FXRateDropDown from "../components/dropdown/FXRateDropDown";
import ReferenceLevelDropDown from "../components/dropdown/ReferenceLevelDropDown";
import AccountDropDown from "../components/dropdown/AccountsDropDown";
import InputField from "../components/InputField";
import { deployOptionContract } from "../lib/SimpleOptionWrapper";
import { GloballyUniqueId } from "../lib/GloballyUniqueId";

const Contract = (props) => {

    var contractDetails = {
        "uniqueId": `${GloballyUniqueId()}`,
        "name": "",
        "description": "",
        "buyerAddress": "",
        "premium": "",
        "premiumTokenAddress": "",
        "settlementTokenAddress": "",
        "notional": "",
        "strike": "",
        "referenceLevelAddress": "",
        "fxReferenceLevelAddress": ""
    };

    return (
        <div>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Unique Id</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={contractDetails.uniqueId || GloballyUniqueId()}
                            handleValueChange={(value) => { contractDetails.GloballyUniqueId = value }}
                            width={"300px"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Contract Name</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={contractDetails.name || ""}
                            placeholder={"The name of the contract"}
                            handleValueChange={(value) => { contractDetails.name = value }}
                            width={"300px"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Description</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={contractDetails.description || ""}
                            placeholder={"A description of the contract"}
                            handleValueChange={(value) => { contractDetails.description = value }}
                            width={"300px"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Buyer Account</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <AccountDropDown
                            handleChange={(value) => { contractDetails.buyerAddress = value }}
                            placeholder={`Buyer Account`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Premium</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={contractDetails.premium || ""}
                            handleValueChange={(value) => { contractDetails.premium = value }}
                            width={"300px"}
                            type={"number"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Premium Token</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <StableCoinDropDown
                            handleChange={(value) => { contractDetails.premiumTokenAddress = value }}
                            placeholder={`Premium Coin`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Notional</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={contractDetails.notional || ""}
                            handleValueChange={(value) => { contractDetails.notional = value }}
                            width={"300px"}
                            type={"number"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Reference Level</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <ReferenceLevelDropDown
                            handleChange={(value) => { contractDetails.referenceLevelAddress = value }}
                            placeholder={`Reference Level`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Strike</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <InputField
                            value={contractDetails.strike || ""}
                            handleValueChange={(value) => { contractDetails.strike = value }}
                            width={"300px"}
                            type={"number"} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Settlement Token</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <SettlementTokenDropDown
                            handleChange={(value) => { contractDetails.settlementTokenAddress = value }}
                            placeholder={`Settlement Token`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Settlement FX Rate</p>
                    </div>
                    <div className="div-table-col-fix-wide">
                        <FXRateDropDown
                            handleChange={(value) => { contractDetails.fxReferenceLevelAddress = value }}
                            placeholder={`Settlement Rate`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <button
                            className="button"
                            onClick={() => {
                                deployOptionContract(
                                    contractDetails.buyerAddress,
                                    contractDetails.uniqueId,
                                    contractDetails.name,
                                    contractDetails.description,
                                    contractDetails.buyerAddress,
                                    contractDetails.premium,
                                    contractDetails.premiumTokenAddress,
                                    contractDetails.settlementTokenAddress,
                                    contractDetails.notional,
                                    contractDetails.strike,
                                    contractDetails.referenceLevelAddress,
                                    contractDetails.fxReferenceLevelAddress
                                );
                            }}
                        >
                            <div>Print Contract</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;
