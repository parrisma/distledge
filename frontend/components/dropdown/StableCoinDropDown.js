import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

/* A list of all stable coins that can be used to pay premiums
*/
const Contract = (props) => {

    /* Extract all stable coins from address config by matching names.
    ** The option is the display name of the Token
    ** The value is the contract address of the Token
    */
    var optionsList = [];
    for (const key in addressConfig) {
        if (key.match(/.*StableCoin.*/)) {
            const optionName = getDisplayName(key);
            optionsList.push({ label: `${optionName}`, value: `${addressConfig[key]}` });
        }
    };

    function handleChange(event) {
        props.handleChange(event.target.value);
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="stable-coin-drop-down-label">{props.label}</InputLabel>
            <Select
                labelId="stable-coin-drop-down-label"
                onChange={handleChange}
                variant="filled"
                size="small"
                fullWidth
                InputLabelProps={{ shrink: true }}
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