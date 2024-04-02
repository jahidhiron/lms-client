import { Group, Image, Menu, UnstyledButton } from '@mantine/core';
import { IconChevronDown } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import classes from './LangSwitcher.module.css';

type LangSwitcherProps = {};

export default function LangSwitcher({}: LangSwitcherProps) {
  const router = useRouter();
  const [opened, setOpened] = useState(false);
  const [selected, setSelected] = useState(
    useMemo(
      () => langs.find((l) => l.value == router.locale),
      [router.locale]
    ) || langs[0]
  );

  useEffect(() => {
    if (window) {
      localStorage.setItem('x-lang-id', router.locale || 'en');
    }
  }, [router.locale]);

  const items = langs.map((item) => (
    <Menu.Item
      leftSection={
        <Image src={item.image} width={18} height={18} alt={item.label} />
      }
      className={classes.label}
      data-selected={item.value == router.locale}
      onClick={() => {
        setSelected(item);
        router.replace(
          {
            pathname: router.pathname,
            query: { ...router.query },
          },
          router.asPath,
          { locale: item.value }
        );
      }}
      key={item.label}
    >
      {item.label}
    </Menu.Item>
  ));

  return (
    <Menu
      onOpen={() => setOpened(true)}
      onClose={() => setOpened(false)}
      radius="md"
    >
      <Menu.Target>
        <UnstyledButton size="sm" className={classes.control}>
          <Group gap="xs">
            <Image
              src={selected.image}
              width={22}
              height={22}
              alt={selected?.label}
            />
          </Group>
          <IconChevronDown
            size="1rem"
            data-opened={opened}
            className={classes.icon}
            stroke={1.5}
          />
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>{items}</Menu.Dropdown>
    </Menu>
  );
}

const langs = [
  {
    label: 'English',
    image: 'https://flagicons.lipis.dev/flags/4x3/us.svg',
    value: 'en',
  },
  {
    label: 'Japanese',
    image: 'https://flagicons.lipis.dev/flags/4x3/jp.svg',
    value: 'jp',
  },
];
