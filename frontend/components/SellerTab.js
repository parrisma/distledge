import { addressConfig } from "../constants";
import SettlementTokenDropDown from "../components/dropdown/SettlementTokenDropDown";
import StableCoinDropDown from "../components/dropdown/StableCoinDropDown";
import FXRateDropDown from "../components/dropdown/FXRateDropDown";
import ReferenceLevelDropDown from "../components/dropdown/ReferenceLevelDropDown";

const Contract = (props) => {

    var SettlementToken = null;
    var PremiumCoin = null;
    var SettlementFXRate = null;
    var ReferenceLevel = null;

    const handleSettlementTokenSelection = event => {
        SettlementToken = event.value;
    };

    const handlePremiumCoinSelection = event => {
        PremiumCoin = event.value;
    };

    const handleSettlementFXSelection = event => {
        SettlementFXRate = event.value;
    };

    const handleReferenceLevelSelection = event => {
        ReferenceLevel = event.value;
    };

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
                        <SettlementTokenDropDown
                            handleChange={handleSettlementTokenSelection}
                            placeholder={`Settlement Token`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <StableCoinDropDown
                            handleChange={handlePremiumCoinSelection}
                            placeholder={`Premium Coin`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <FXRateDropDown
                            handleChange={handlePremiumCoinSelection}
                            placeholder={`Settlement Rate`} />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <ReferenceLevelDropDown
                            handleChange={handleReferenceLevelSelection}
                            placeholder={`Reference Level`} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;
