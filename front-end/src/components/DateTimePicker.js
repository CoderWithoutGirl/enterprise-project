import PropsType from 'prop-types';
const DateTimePicker = ({defaultValue, onChange, maxDate, minDate, ...rest}) => {
    return (
        <input
          type="date"
          className='border-1 rounded-lg w-full h-12 px-4'
          defaultValue={defaultValue}
          {...rest}
          onChange={onChange}
          min={minDate}
          max={maxDate}
        />
    );
}

DateTimePicker.propsType = {
    defaultValue: PropsType.string.isRequired,
    onChange: PropsType.func.isRequired,
    maxDate: PropsType.string,
    minDate: PropsType.string
}


export default DateTimePicker;