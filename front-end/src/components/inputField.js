import PropsType from "prop-types";

const InputField = ({type, placeholder, ...rest}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="border-1 rounded-lg w-full h-12 px-4"
      {...rest}
    />
  );
};

InputField.propsType = {
  type: PropsType.oneOf(["text", "password", "email", "number"]),
  placeholder: PropsType.string
}

export default InputField;
