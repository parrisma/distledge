import { addressConfig } from "@/constants";
import { getDisplayName } from "@/lib/DisplayName";
import Select from 'react-select'

/* A list of all stable tokens that can be used to settle a contract
** e.g. stablke coins, stable shares or any contract that implements StableAsset interface.
*/
const Contract = (props) => {

  /* Extract all stake tokens from address config by matching names.
  ** The option is the display name of the Token
  ** The value is the contract address of the Token
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
      placeholder={`${props.placeholder}`}
      clearable={false}
      onChange={props.handleChange}
    />
  );
};

export default Contract;