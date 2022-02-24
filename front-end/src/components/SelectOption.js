import PropTypes from "prop-types";

const SelectOption = ({ listData, defaultValue, ...rest }) => {
  return (
    <select {...rest} className="border-1 rounded-lg w-full h-12 px-4" value={defaultValue}>
      {listData.length &&
        listData.map((item, index) => (
          <option disabled={defaultValue === item.name ? true : false} value={item.name} key={index}>
            {item.name}
          </option>
        ))}
    </select>
  );
};

SelectOption.propsType = {
  listData: PropTypes.array,
  defaultValue: PropTypes.oneOf(["string", "value", "object"]),
};

export default SelectOption;
