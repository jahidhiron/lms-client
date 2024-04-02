import { useDebounceCallback } from '@mantine/hooks';
import React, { useState } from 'react';
import TextInput from '../TextInput';
import { TextInputProps } from '../TextInput/TextInput';
import classes from './DebounceInputField.module.css';

type DebounceInputFieldProps = TextInputProps & {
  onDebouncedChange: (_value: string) => void;
  debounceTime?: number;
};

export default function DebounceInputField({
  onDebouncedChange,
  debounceTime = 300,
  ...props
}: DebounceInputFieldProps) {
  const [inputValue, setInputValue] = useState(props.value || '');

  // @ts-ignore
  const debouncedOnChange = useDebounceCallback(() => {
    onDebouncedChange(inputValue as string);
  }, debounceTime);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    debouncedOnChange();
  };

  return (
    <TextInput
      className={classes.text_input}
      {...props}
      value={inputValue}
      onChange={handleInputChange}
    />
  );
}
