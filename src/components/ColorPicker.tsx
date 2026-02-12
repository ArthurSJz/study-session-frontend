interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const COLORS: string[] = [
  "#ff6b6b", "#ee5a24", "#f0932b", "#feca57",
  "#6ab04c", "#badc58", "#48dbfb", "#4A90D9",
  "#6c5ce7", "#a29bfe", "#e056fd", "#fd79a8",
];

function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="color-picker">
      {COLORS.map((color: string) => (
        <button
          key={color}
          type="button"
          className={`color-option ${value === color ? "selected" : ""}`}
          style={{ background: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}

export default ColorPicker;