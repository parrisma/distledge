import Price from "../../components/Price";
import { addressConfig } from "../../constants";
import { useConsoleLogContext } from "../../context/consoleLog";

const PricePage = (props) => {

    const [logs, setLogs] = useConsoleLogContext()
    function appendLogs(textLine) {
        logs.push(textLine);
        setLogs(logs.slice(-50))
    }

    return (
        <div>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col">
                        <Price
                            contract={{
                                address: addressConfig["teslaEquityPriceContract"]
                                    ? addressConfig["teslaEquityPriceContract"]
                                    : null,
                                type: "equity",
                            }}
                            onAddInfo={appendLogs}
                            withHeader={true}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <Price
                            contract={{
                                address: addressConfig["appleEquityPriceContract"]
                                    ? addressConfig["appleEquityPriceContract"]
                                    : null,
                                type: "equity",
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <Price
                            contract={{
                                address: addressConfig["UsdEurFXRateContract"]
                                    ? addressConfig["UsdEurFXRateContract"]
                                    : null,
                                type: "fx",
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <Price
                            contract={{
                                address: addressConfig["UsdCnyFXRateContract"]
                                    ? addressConfig["UsdCnyFXRateContract"]
                                    : null,
                                type: "fx",
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PricePage;
