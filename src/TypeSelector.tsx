import type { ChangeEvent } from "react";

interface Props {
  types: string[];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  selectedType: string;
}

const TypeSelector = ({ types, onChange, selectedType }: Props) => {
  const renderLabeledRadioButton = (type: string) => (
    <div>
      <input type="radio" id={type} name="drone" onChange={onChange} value={type} checked={selectedType === type} />
      <label htmlFor={type}>{type}</label>
    </div>
  );

  return <div>{types.map(renderLabeledRadioButton)}</div>;
};

export default TypeSelector;
