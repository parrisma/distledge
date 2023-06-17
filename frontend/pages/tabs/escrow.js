import StableToken from "../../components/StableToken";
import EscrowAccount from "../../components/Escrow";
import { addressConfig, StableCoinType, StableShareType, EscrowAccountType } from "../../constants";
import { useConsoleLogContext } from "../../context/consoleLog";

const EscrowPage = (props) => {

    const [logs, setLogs] = useConsoleLogContext()
    function appendLogs(textLine) {
        logs.push(textLine);
        setLogs(logs.slice(-50))
    }

    return (
        <div className="resizable-horizontal">
            <div className="div-table">
                <div className="div-table-row">
                    <div className="div-table-col">
                        <EscrowAccount
                            contract={{
                                address: addressConfig["usdEscrowAccount"]
                                    ? addressConfig["usdEscrowAccount"]
                                    : null,
                                type: `${EscrowAccountType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={true}
                        />
                    </div>
                    <div className="div-table-col">
                        <StableToken
                            contract={{
                                address: addressConfig["usdStableCoin"]
                                    ? addressConfig["usdStableCoin"]
                                    : null,
                                type: `${StableCoinType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={true}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <EscrowAccount
                            contract={{
                                address: addressConfig["eurEscrowAccount"]
                                    ? addressConfig["eurEscrowAccount"]
                                    : null,
                                type: `${EscrowAccountType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                    <div className="div-table-col">
                        <StableToken
                            contract={{
                                address: addressConfig["eurStableCoin"]
                                    ? addressConfig["eurStableCoin"]
                                    : null,
                                type: `${StableCoinType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <EscrowAccount
                            contract={{
                                address: addressConfig["cnyEscrowAccount"]
                                    ? addressConfig["cnyEscrowAccount"]
                                    : null,
                                type: `${EscrowAccountType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                    <div className="div-table-col">
                        <StableToken
                            contract={{
                                address: addressConfig["cnyStableCoin"]
                                    ? addressConfig["cnyStableCoin"]
                                    : null,
                                type: `${StableCoinType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <EscrowAccount
                            contract={{
                                address: addressConfig["appleEscrowAccount"]
                                    ? addressConfig["appleEscrowAccount"]
                                    : null,
                                type: `${EscrowAccountType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                    <div className="div-table-col">
                        <StableToken
                            contract={{
                                address: addressConfig["appleStableShare"]
                                    ? addressConfig["appleStableShare"]
                                    : null,
                                type: `${StableShareType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                </div>
                <div className="div-table-row">
                    <div className="div-table-col">
                        <EscrowAccount
                            contract={{
                                address: addressConfig["teslaEscrowAccount"]
                                    ? addressConfig["teslaEscrowAccount"]
                                    : null,
                                type: `${EscrowAccountType}`,
                            }}
                            onAddInfo={appendLogs}
                            withHeader={false}
                        />
                    </div>
                    <div className="div-table-col">
                        <StableToken
                            contract={{
                                address: addressConfig["teslaStableShare"]
                                    ? addressConfig["teslaStableShare"]
                                    : null,
                                type: `${StableShareType}`,
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

export default EscrowPage;
