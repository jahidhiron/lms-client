import {
  TextInput as MantineTextInput,
  TextInputProps as MantineTextInputProps,
  Text,
} from '@mantine/core';

export type TextInputProps = MantineTextInputProps & {
  withCount?: boolean;
};

export default function TextInput({
  withCount,
  value,
  maxLength,
  ...props
}: TextInputProps) {
  return (
    <MantineTextInput
      rightSectionWidth={50}
      rightSection={
        withCount ? (
          <Text ta="center" c="dimmed">
            {(maxLength || 0) - (value as string)?.length}
          </Text>
        ) : undefined
      }
      maxLength={maxLength}
      value={value}
      {...props}
    />
  );
}
