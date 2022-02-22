import PropsType from "prop-types";

const TextAreaField = ({ rows, placeholder, ...rest }) => {
  return <textarea rows={rows} placeholder={placeholder} className="border-1 rounded-lg w-full h-fit px-4" {...rest}></textarea>;
};

TextAreaField.propsType = {
  placeholder: PropsType.string,
  rows: PropsType.string.isRequired,
};

export default TextAreaField;
