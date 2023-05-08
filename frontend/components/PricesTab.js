import Price from "../components/Price";
import { addressConfig } from "../constants";

const Contract = (props) => {

    return (
        <div>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <Price
                            contract={{
                                address: addressConfig["teslaEquityPriceContract"]
                                    ? addressConfig["teslaEquityPriceContract"]
                                    : null,
                                type: "equity",
                            }}
                            onAddInfo={props.handleLogChange}
                        />
                    </div>
                    <div className="div-table-col-fix-wide">
                        <Price
                            contract={{
                                address: addressConfig["UsdEurFXRateContract"]
                                    ? addressConfig["UsdEurFXRateContract"]
                                    : null,
                                type: "fx",
                            }}
                            onAddInfo={props.handleLogChange}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <Price
                            contract={{
                                address: addressConfig["appleEquityPriceContract"]
                                    ? addressConfig["appleEquityPriceContract"]
                                    : null,
                                type: "equity",
                            }}
                            onAddInfo={props.handleLogChange}
                        />
                    </div>
                    <div className="div-table-col-fix-wide">
                        <Price
                            contract={{
                                address: addressConfig["UsdCnyFXRateContract"]
                                    ? addressConfig["UsdCnyFXRateContract"]
                                    : null,
                                type: "fx",
                            }}
                            onAddInfo={props.handleLogChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;
