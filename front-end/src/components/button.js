import PropsType from 'prop-types';

<<<<<<< HEAD
const Button = ({type, title, ...rest}) => {
=======
const Button = ({type, title, role, ...rest}) => {
>>>>>>> 01ad31cc6a6b09b3f155543261ceab64e59275de

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
<<<<<<< HEAD
      <button {...rest} className={`${typeCheck()} text-white inline-block rounded-md font-semibold px-4 py-3 w-2/5`}>
=======
      <button className={`${typeCheck()} text-white inline-block rounded-md font-semibold px-4 py-3 w-2/5`} type={role} {...rest}>
>>>>>>> 01ad31cc6a6b09b3f155543261ceab64e59275de
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