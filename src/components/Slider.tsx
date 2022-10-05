import "styles/slider.css";

type PropTypes = {
    text: string;
    onChange: (value: number) => void;
    min: number;
    max: number;
    value: number;
    step?: number;
};

const Slider = ({ text, onChange, min, max, value, step }: PropTypes) => {
    return (
        <div className="setting">
            <div className="slider-label">
                <span>{text}: </span>
                <input
                    type="text"
                    className="slider-input"
                    onChange={(e) =>
                        onChange(parseFloat(e.target.value || "0"))
                    }
                    value={value}
                />
            </div>
            <input
                type="range"
                className="slider-range"
                min={min}
                max={max}
                value={value}
                step={step || 1}
                onChange={(e) => onChange(parseFloat(e.target.value))}
            />
        </div>
    );
};

export default Slider;
