import "styles/input.css";

type PropTypes = {
    text: string;
    onChange: (value: string) => void;
    value: string;
};

const Input = ({ text, onChange, value }: PropTypes) => {
    return (
        <div className="setting">
            <label className="input-label">{text}</label>
            <input
                type="password"
                className="input-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default Input;
