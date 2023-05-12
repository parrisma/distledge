const Contract = (props) => {

    return (
        <div className="info-container">
            <div className="info">
                <div className="side-by-side-container">
                    <div className="side-by-side-item">
                        <div className="icon-i icon-info"></div>
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
