import "styles/select.css";

type PropTypes = {
    text: string;
    onChange: (value: string) => void;
    value: string;
    options: string[];
};

const Input = ({ text, onChange, value, options }: PropTypes) => {
    return (
        <div className="setting">
            <label className="select-label">{text}</label>
            <select
                className="select-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default Input;
