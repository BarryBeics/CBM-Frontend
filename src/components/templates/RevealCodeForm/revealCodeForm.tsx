import { Field, Input, useThemeClassName } from '@fluentui/react-components';
import { AddCircle24Filled } from '@fluentui/react-icons';
import SectionCard from '../../primatives/Cards/SectionCard';
import Button from '../../primatives/Buttons/Button';
import Stack from '../../primatives/Stack/Stack';
import undrawAddItem from '../../../assets/undraw_add_tasks.svg';
import { useState } from 'react';
import { loadRevealCodes, saveRevealCodes } from '../../../utils/localStorage';

const RevealCodeForm: React.FC = () => {
    const [code, setCode] = useState('');
    const [revealCodes, setRevealCodes] = useState<string[]>(loadRevealCodes());
    const [error, setError] = useState<string | null>(null); // Validation error state
    const themeClassName = useThemeClassName();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        if (error) setError(null); // Clear error on user input
    };

    const handleAddCode = () => {
        if (!code.trim()) {
            setError('Code cannot be empty.');
            return;
        }

        if (revealCodes.includes(code.trim())) {
            setError('Code is already added.');
            return;
        }

        const updatedCodes = [...revealCodes, code.trim()];
        setRevealCodes(updatedCodes);
        saveRevealCodes(updatedCodes);
        setCode(''); // Clear the input field after adding
    };

    return (
        <SectionCard
            title="Reveal Item"
            svgSrc={undrawAddItem}
            svgAlt="Reveal Code"
            footerContent={
                <Button
                    onClick={handleAddCode}
                    appearance="primary"
                    icon={<AddCircle24Filled />}
                    label="Add Code"
                />
            }
        >
            <Stack>
                <Field
                    label="Reveal Code"
                    validationMessage={error} // Display validation message on error
                    required // Mark the field as required
                >
                    <Input
                        placeholder="Enter a reveal code..."
                        value={code}
                        onChange={handleInputChange}
                        className={`fui-Input ${themeClassName} ${error ? 'input-error' : ''}`}
                    />
                </Field>
            </Stack>
        </SectionCard>
    );
};

export default RevealCodeForm;
