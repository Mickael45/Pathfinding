import type { ChangeEvent } from "react";

interface Props {
  label: string;
  types: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedType: string;
}

const TypeSelector = ({ label, types, onChange, selectedType }: Props) => {
  const renderLabeledRadioButton = (type: string) => (
    <div>
      <input type="radio" id={type} onChange={onChange} value={type} checked={selectedType === type} />
      <label htmlFor={type}>{type}</label>
    </div>
  );

  return (
    <div>
      <label>{label}</label>
      {types.map(renderLabeledRadioButton)}
    </div>
  );
};

export default TypeSelector;
