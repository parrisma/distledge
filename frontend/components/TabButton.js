
const Contract = (props) => {

    return (
        <div>
            {
                props.tabName === props.currentTab ?
                    (<button
                        onClick={() => props.onHandleButtonClick(props.tabName)}
                        className="button-tab-on"
                        name="{props.tabName}"
                    >
                        {props.tabName}
                    </button>)
                    :
                    (<button
                        onClick={() => props.onHandleButtonClick(props.tabName)}
                        className="button-tab-off"
                        name="{props.tabName}"
                    >
                        {props.tabName}
                    </button>)
            }

        </div>
    );
};

export default Contract;
