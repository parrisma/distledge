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
    var optionsList = [];
    for (const key in addressConfig) {
        if (key.match(/.*FXRate.*/)) {
            const optionName = getDisplayName(key);
            optionsList.push({ label: `${optionName}`, value: `${addressConfig[key]}` });
        }
    };

    return (
        <Select
            className='selector'
            options={optionsList}
            placeholder={`${props.placeholder}`}
            clearable={false}
            onChange={props.handleChange}
        />
    );
};

export default Contract;