import { Button } from "@material-ui/core";

const Contract = (props) => {

    return (
        <div>
            {
                props.tabName === props.currentTab ?
                    (<Button color="primary" variant="contained"
                        onClick={() => props.onHandleButtonClick(props.tabName)}
                        className="button-tab-on"
                        name="{props.tabName}"
                    >
                        {props.tabName}
                    </Button>)
                    :
                    (<Button color="primary" variant="contained"
                        onClick={() => props.onHandleButtonClick(props.tabName)}
                        className="button-tab-off"
                        name="{props.tabName}"
                    >
                        {props.tabName}
                    </Button>)
            }

        </div>
    );
};

export default Contract;
