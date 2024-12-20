interface DropdownProps {
  options: string[];
  selectedOption: string;
  setSelectedOption: (value: string) => void;
  id: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedOption, setSelectedOption, id }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <select id={id} className="dropdown" value={selectedOption} onChange={handleChange}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;

