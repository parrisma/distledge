const Contract = (props) => {

    return (
        <div className="error-container">
            <div className="error">
                <div className="side-by-side-container">
                    <div className="side-by-side-item">
                        <div className="icon-e icon-error"></div>
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
