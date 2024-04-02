import {
  ActionIcon,
  Autocomplete,
  Box,
  Burger,
  Flex,
  Group,
  ThemeIcon,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import CartButton from '~/components/core/CartButton';
import LangSwitcher from '~/components/core/LangSwitcher';
import Logo from '~/components/core/Logo';
import UserButton from '~/components/core/UserButton';

type CommonHeaderProps = {
  opened: boolean;
  toggle: () => void;
};

export default function CommonHeader({ opened, toggle }: CommonHeaderProps) {
  const router = useRouter();
  const searchQuery = (router.query?.q as string) || '';
  const [searchText, setSearchText] = useState(searchQuery);
  const searchRef = useRef<HTMLInputElement>(null);
  const onSearch = (value: string) => {
    router.push({
      pathname: '/search',
      query: {
        q: value,
      },
    });
    searchRef?.current?.blur();
  };

  return (
    <Group h="100%" px="md">
      <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
      <Group justify="space-between" style={{ flex: 1 }}>
        <Logo />
        <Box>
          <Autocomplete
            leftSection={
              <ThemeIcon variant="light" radius="xl">
                <IconSearch size="15" />
              </ThemeIcon>
            }
            rightSection={
              searchText ? (
                <ActionIcon
                  onClick={() => setSearchText('')}
                  color="gray"
                  size="sm"
                  radius="xl"
                >
                  <IconX size="15" />
                </ActionIcon>
              ) : null
            }
            radius="xl"
            onKeyDown={(ev) => {
              if (ev.key === 'Enter') {
                onSearch(ev.currentTarget.value);
              }
            }}
            onChange={(v) => {
              setSearchText(v);
            }}
            value={searchText}
            ref={searchRef}
            onOptionSubmit={onSearch}
            variant="filled"
            width="100%"
            data={[{ value: 'Web Development', label: 'Web Development' }]}
            w={400}
            name="asds"
          />
        </Box>
        <Flex justify="flex-end" align="center" gap="xs">
          <CartButton />
          <UserButton />
          <LangSwitcher />
        </Flex>
      </Group>
    </Group>
  );
}
