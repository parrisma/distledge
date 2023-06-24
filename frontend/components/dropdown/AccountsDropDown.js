import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import { useEffect } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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
        <FormControl fullWidth>
            <InputLabel id="account-drop-down-label">{props.label}</InputLabel>
            <Select
                labelId="account-drop-down-label"
                onChange={handleChange}
                variant="filled"
                size="small"
                fullWidth
            >
                {optionsList.map((item) => (
                    <MenuItem
                        value={item.value}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default Contract;