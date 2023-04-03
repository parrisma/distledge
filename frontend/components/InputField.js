/* Simple text input field
*/
import { useState } from "react";

const Contract = (props) => {

    const [inputValue, setInputValue] = useState(`${props.value}`);
    const inputWidth = props.width ? props.width : "600px";

    function handleChange(e) {
        setInputValue(e.target.value);
        props.handleValueChange(e.target.value);
    }

    return (
        <div>
            <input
                style={{ width: `${inputWidth}` }}
                className='input'
                type={props.type || "text"}
                onChange={handleChange}
                value={inputValue || "?"}
            />
        </div>
    );
};

export default Contract;
