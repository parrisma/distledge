import StableToken from "../components/StableToken";
import { addressConfig } from "../constants";

const Contract = (props) => {

    return (
        <div>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <StableToken
                            contract={{
                                address: addressConfig["usdStableCoin"]
                                    ? addressConfig["usdStableCoin"]
                                    : null,
                                type: "usdStableCoin",
                            }}
                            onAddInfo={props.handleLogChange}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <StableToken
                            contract={{
                                address: addressConfig["eurStableCoin"]
                                    ? addressConfig["eurStableCoin"]
                                    : null,
                                type: "eurStableCoin",
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
