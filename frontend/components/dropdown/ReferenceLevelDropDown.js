import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

/* A list of all Reference Level (price) feeds
*/
const Contract = (props) => {

    /* Extract all Reference levels from address config by matching names.
    ** The option is the display name of the Token
    ** The value is the contract address of the Token
    */
    var optionsList = [];
    for (const key in addressConfig) {
        if (key.match(/.*Price.*/)) {
            const optionName = getDisplayName(key);
            optionsList.push({ label: `${optionName}`, value: `${addressConfig[key]}` });
        }
    };

    function handleChange(event) {
        props.handleChange(event.target.value);
    }

    return (
        <FormControl fullWidth>
            <InputLabel id="ref-level-drop-down-label">{props.label}</InputLabel>
            <Select
                labelId="ref-level-drop-down-label"
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