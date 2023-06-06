import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from 'react-select'
import { useEffect } from "react";

/* A list of all Accounts
*/
const Contract = (props) => {

    /* Extract all Accounts from address config by matching names.
    ** The option is the display name of the Token
    ** The value is the contract address of the Token
    */
    var optionsList = [];
    var selectedValue = undefined;
    for (const key in addressConfig) {
        if (key.match(/.*Account.*/)) {
            if (addressConfig[key].accountName) {
                const optionName = getDisplayName(addressConfig[key].accountName);
                if ('buyerAccount' === key.toString()) {
                    selectedValue = { label: `${optionName}`, value: `${addressConfig[key].accountAddress}` };
                }
                optionsList.push({ label: `${optionName}`, value: `${addressConfig[key].accountAddress}` });
            }
        }
    };

    function handleChange(e) {
        props.handleChange(e.value);
    }

    useEffect(() => {
        props.handleChange(selectedValue.value);
    }, [])

    return (
        <Select
            className='selector'
            options={optionsList}
            placeholder={`${props.placeholder}`}
            clearable={false}
            defaultValue={selectedValue}
            onChange={handleChange}
        />
    );
};

export default Contract;