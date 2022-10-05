import "styles/input.css";

type PropTypes = {
    text: string;
    onChange: (value: string) => void;
    value: string;
    isPassword?: boolean;
};

const Input = ({ text, onChange, value, isPassword }: PropTypes) => {
    return (
        <div className="setting">
            <label className="input-label">{text}</label>
            <input
                type={isPassword ? "password" : "text"}
                className="input-input"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default Input;
