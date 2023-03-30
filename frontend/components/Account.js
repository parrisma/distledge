import { addressConfig } from "../constants";

const Contract = (props) => {

    return (
        <div>
            <div className="div-table">
                {props.withHeader ? (
                    <div className="div-table-row">
                        <div className="div-table-col-fix-lab">
                            Name:
                        </div>
                        <div className="div-table-col-fix-address">
                            Address:
                        </div>
                        <div className="div-table-col-fix-lab">
                            EUR Cash:
                        </div>
                        <div className="div-table-col-fix-lab">
                            EUR Token
                        </div>
                        <div className="div-table-col-fix-lab">
                            USD Cash:
                        </div>
                        <div className="div-table-col-fix-lab">
                            USD Token
                        </div>
                        <div className="div-table-col-fix-lab">
                            CNY Cash:
                        </div>
                        <div className="div-table-col-fix-lab">
                            CNY Token
                        </div>
                    </div>
                ) : null}
                <div className="div-table-row">
                    <div className="div-table-col-fix-lab">
                        {props.accountDetail.accountName}
                    </div>
                    <div className="div-table-col-fix-address">
                        {props.accountDetail.accountAddress}
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.accountDetail.eur}
                    </div>
                    <div className="div-table-col-fix-number">
                        ?
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.accountDetail.usd}
                    </div>
                    <div className="div-table-col-fix-number">
                        ?
                    </div>
                    <div className="div-table-col-fix-number">
                        {props.accountDetail.cny}
                    </div>
                    <div className="div-table-col-fix-number">
                        ?
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;