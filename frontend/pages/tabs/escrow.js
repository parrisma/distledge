import StableToken from "../../components/StableToken";
import EscrowAccount from "../../components/Escrow";
import { addressConfig } from "../../constants";
import { useConsoleLogContext } from "../../context/consoleLog";

const EscrowPage = (props) => {

    const [logs,setLogs] = useConsoleLogContext()
    function appendLogs(textLine){  
        logs.push(textLine);
        setLogs(logs.slice(-50))
    }

    return (
        <div>
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                        <EscrowAccount
                            contract={{
                                address: addressConfig["usdEscrowAccount"]
                                    ? addressConfig["usdEscrowAccount"]
                                    : null,
                                type: "EscrowAccount",
                            }}
                            onAddInfo={appendLogs}
                        />
                    </div>
                    <div className="div-table-col-fix-wide">
                        <StableToken
                            contract={{
                                address: addressConfig["usdStableCoin"]
                                    ? addressConfig["usdStableCoin"]
                                    : null,
                                type: "usdStableCoin",
                            }}
                            onAddInfo={appendLogs}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                    <EscrowAccount
                            contract={{
                                address: addressConfig["eurEscrowAccount"]
                                    ? addressConfig["eurEscrowAccount"]
                                    : null,
                                type: "EscrowAccount",
                            }}
                            onAddInfo={appendLogs}
                        />
                    </div>
                    <div className="div-table-col-fix-wide">
                        <StableToken
                            contract={{
                                address: addressConfig["eurStableCoin"]
                                    ? addressConfig["eurStableCoin"]
                                    : null,
                                type: "eurStableCoin",
                            }}
                            onAddInfo={appendLogs}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col-fix-wide">
                    <EscrowAccount
                            contract={{
                                address: addressConfig["cnyEscrowAccount"]
                                    ? addressConfig["cnyEscrowAccount"]
                                    : null,
                                type: "EscrowAccount",
                            }}
                            onAddInfo={appendLogs}
                        />
                    </div>
                    <div className="div-table-col-fix-wide">
                        <StableToken
                            contract={{
                                address: addressConfig["cnyStableCoin"]
                                    ? addressConfig["cnyStableCoin"]
                                    : null,
                                type: "cnyStableCoin",
                            }}
                            onAddInfo={appendLogs}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EscrowPage;
