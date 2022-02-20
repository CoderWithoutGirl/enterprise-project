import PropsType from 'prop-types';

const Button = ({type, title, role, ...rest}) => {

    const typeCheck = () => {
        switch(type) {
            case 'primary':
                return "bg-blue-400";
            case 'secondary':
                return "bg-gray-400";
            case 'warning':
                return "bg-yellow-400";
            case 'danger':
                return "bg-red-400";
            case 'info':
                return "bg-blue-300";
            case 'success':
                return "bg-green-400";
            default:
                return "bg-white";
        }
    }

    return (
      <button className={`${typeCheck()} text-white inline-block rounded-md font-semibold px-4 py-3 w-fit`} type={role} {...rest}>
        {title}
      </button>
    );
}

Button.propsType = {
  type: PropsType.oneOf([
    "primary",
    "secondary",
    "warning",
    "danger",
    "info",
    "success",
  ]),
  title: PropsType.string,
  role: PropsType.oneOf(["button", "submit"]),
};

export default Button;