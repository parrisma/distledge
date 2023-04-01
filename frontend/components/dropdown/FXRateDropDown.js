import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from 'react-select'

/* A list of all FX Rate feeds
*/
const Contract = (props) => {

    /* Extract all FX Rates from address config by matching names.
    ** The option is the display name of the Token
    ** The value is the contract address of the Token
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