import PropsType from 'prop-types'

const Form = ({children, title}) => {
  return (
    <div className="bg-white rounded-2xl border shadow-xl p-10 w-full">
      <div className="flex flex-col items-center space-y-4">
        <h1 className="font-bold text-2xl text-gray-700 w-5/6 text-center">
         {title}
        </h1>
        {children}
      </div>
    </div>
  );
};

Form.propsType = {
    children: PropsType.element,
    title: PropsType.string
}

export default Form;
