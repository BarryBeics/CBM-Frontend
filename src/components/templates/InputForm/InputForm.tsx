import { Field, Input, useThemeClassName } from '@fluentui/react-components';
import { AddCircle24Filled } from '@fluentui/react-icons';
import SectionCard from '../../primatives/Cards/SectionCard';
import undrawAddItem from '../../../assets/undraw_add_tasks.svg';
import Button from '../../primatives/Buttons/Button';
import Stack from '../../primatives/Stack/Stack';
import './InputForm.css';

interface InputFormProps {
    newItem: { title: string; 
            turnover: string;   
           leasehold: string; 
         description: string;
          hiddenCode: string };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string) => void;
    handleAddItem: () => void;
    error: string | null;
}

const InputForm: React.FC<InputFormProps> = ({ newItem, handleInputChange, handleAddItem, error }) => {
    const themeClassName = useThemeClassName();

    return (
        <SectionCard 
            title="Add item"
            svgSrc={undrawAddItem} 
            svgAlt='Add item'
            footerContent={
                <Button
                    onClick={handleAddItem}
                    appearance="primary"
                    icon={<AddCircle24Filled />}
                    label="Add item"              
                />
            }
        >
            <Stack>
                {/* item Title Field with Validation */}
                <Field
                    label="Item Title"
                    validationMessage={error}  // Validation message shown on error
                    required  // Adds required field indicator
                >
                    <Input
                        placeholder="Enter a item title..."
                        name="title"
                        value={newItem.title}
                        onChange={(e) => handleInputChange(e, 'title')}
                        className={`fui-Input ${themeClassName} ${error ? 'input-error' : ''}`}
                    />
                </Field>
                
                {/* Optional item Turnover price Input */}
                <Field>
                    <Input
                        placeholder="Enter an optional item description..."
                        name="turnover"
                        value={newItem.turnover}
                        onChange={(e) => handleInputChange(e, 'description')}
                        className={`fui-Input ${themeClassName}`}
                        />
                </Field>

                {/* Optional item Leasehold price Input */}
                <Field>
                    <Input
                        placeholder="Enter an optional item description..."
                        name="leasehold"
                        value={newItem.leasehold}
                        onChange={(e) => handleInputChange(e, 'description')}
                        className={`fui-Input ${themeClassName}`}
                        />
                </Field>

                {/* Optional item Description Input */}
                <Field>
                    <Input
                        placeholder="Enter an optional item description..."
                        name="description"
                        value={newItem.description}
                        onChange={(e) => handleInputChange(e, 'description')}
                        className={`fui-Input ${themeClassName}`}
                        />
                </Field>
                {/* Optional item Description Input */}
                <Field>
                    <Input
                        placeholder="Will be moved to admin page..."
                        name="hiddenCode"
                        value={newItem.hiddenCode}
                        onChange={(e) => handleInputChange(e, 'hiddenCode')}
                        className={`fui-Input ${themeClassName}`}
                        />
                </Field>
                </Stack>
        </SectionCard>
    );
};

export default InputForm;