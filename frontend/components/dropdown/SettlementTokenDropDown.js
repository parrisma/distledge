import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from 'react-select'

const Contract = (props) => {

  /* Extract all stake tokens from address config by matching names.
  */
  var optionsList = [];
  for (const key in addressConfig) {
    if (key.match(/.*Stable.*/)) {
      const optionName = getDisplayName(key);
      optionsList.push({ label: `${optionName}`, value: `${addressConfig[key]}` });
    }
  };

  return (
    <Select
      className='selector'
      options={optionsList}
      placeholder={'Settlement Token'}
      clearable={false}
      onChange={props.handleChange}
    />
  );
};

export default Contract;