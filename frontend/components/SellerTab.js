import { addressConfig } from "../constants";
import SettlementTokenDropDown from "../components/dropdown/SettlementTokenDropDown";
import StableCoinDropDown from "../components/dropdown/StableCoinDropDown";
import FXRateDropDown from "../components/dropdown/FXRateDropDown";
import ReferenceLevelDropDown from "../components/dropdown/ReferenceLevelDropDown";
import InputField from "../components/InputField";
import { GloballyUniqueId } from "../lib/GloballyUniqueId";

const Contract = (props) => {

    var contractDetails = {
        "uniqueId": `${GloballyUniqueId()}`,
        "name": "?",
        "description": "?",
        "buyerAddress": "",
        "premium": "0",
        "premiumTokenAddress": "",
        "settlementTokenAddress": "",
        "notional": "0",
        "strike": "0",
        "referenceLevelAddress": "",
        "fxReferenceLevelAddress": ""
    };

    function printContract() {
        console.log(contractDetails);
    }

    return (
        <div>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <p>Seller</p>
                    </div>
                </div>
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
                        <button
                            className="button"
                            onClick={printContract}
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
