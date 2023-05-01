const Contract = (props) => {

    return (
        <div className="warning-container">
            <div className="warning">
                <div className="side-by-side-container">
                    <div className="side-by-side-item">
                        <div className="icon-w icon-warn"></div>
                    </div>
                    <div className="side-by-side-item">
                        <p>{props.message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contract;
