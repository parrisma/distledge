import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

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

    function handleChange(event) {
        props.handleChange(event.target.value);
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="fx-rate-drop-down-label">{props.label}</InputLabel>
            <Select
                labelId="fx-rate-drop-down-label"
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