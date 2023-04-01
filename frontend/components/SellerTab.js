import { addressConfig } from "../constants";
import SettlementTokenDropDown from "../components/dropdown/SettlementTokenDropDown";

const Contract = (props) => {

    var SettlementToken = null;

    const handleSelection = event => {
        console.log(event.value);
        SettlementToken = event.value;
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
                        <SettlementTokenDropDown handleChange={handleSelection} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;
