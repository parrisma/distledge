import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from 'react-select'

/* A list of all option types that can be printed
*/
const Contract = (props) => {

    /* List all of the Option Types that can be printed.
    ** The option is the display name of the OPtion
    ** The value is the contract ABI of the Option
    */
    var optionsList = [
        { label: "Simple Option", value: "1" },
        { label: "Simple Put Option", value: "2" }
    ];

    function handleChange(e) {
        props.handleChange(e.value);
    }

    return (
        <Select
            className='selector'
            options={optionsList}
            placeholder={`${props.placeholder}`}
            clearable={false}
            onChange={handleChange}
        />
    );
};

export default Contract;