import PropsType from "prop-types";

const InputField = ({type, placeholder}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className="border-1 rounded-lg w-full h-12 px-4"
    />
  );
};

InputField.propsType = {
  type: PropsType.oneOf(["text", "password", "email"]),
  placeholder: PropsType.string
}

export default InputField;
