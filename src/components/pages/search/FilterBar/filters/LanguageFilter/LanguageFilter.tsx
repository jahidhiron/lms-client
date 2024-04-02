import { Checkbox, Spoiler, Stack, TextInput } from '@mantine/core';
import { useMemo, useState } from 'react';
import { Languages } from '~/helpers/languages';

type LanguageFilterProps = {
  onLanguageSelect: (_langs: string[]) => void;
  selectedLanguages: string[];
};

export default function LanguageFilter({
  onLanguageSelect,
  selectedLanguages = [],
}: LanguageFilterProps) {
  const [searchText, setSearchText] = useState('');
  const languages = useMemo(
    () => Languages.filter((lang) => lang.label.includes(searchText)),
    [searchText]
  );

  return (
    <Stack>
      <TextInput
        size="xs"
        placeholder="search"
        onChange={(ev) => setSearchText(ev.target.value)}
      />
      <Spoiler hideLabel="show less" showLabel="show more">
        <Stack>
          {languages.map((lang) => (
            <Checkbox
              key={lang.value}
              onChange={(ev) => {
                if (!ev.target.checked) {
                  onLanguageSelect(
                    selectedLanguages.filter((lang) => lang !== ev.target.value)
                  );
                } else {
                  onLanguageSelect([...selectedLanguages, ev.target.value]);
                }
              }}
              value={lang.value}
              label={lang.label}
              checked={selectedLanguages.includes(lang.value)}
            />
          ))}
        </Stack>
      </Spoiler>
    </Stack>
  );
}
