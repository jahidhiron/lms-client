import { ActionIcon, Flex, Title } from '@mantine/core';
import { IconChevronLeft, IconHome2 } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import classes from './AuthPageHeader.module.css';

type AuthPageHeaderProps = {
  title: string;
  backUrl?: string | (() => void);
};

export default function AuthPageHeader({
  title,
  backUrl,
}: AuthPageHeaderProps) {
  const router = useRouter();
  return (
    <Flex>
      <Flex align="center" justify="flex-start" w="100%" mb="xl" gap="xs">
        {typeof backUrl == 'string' ? (
          <ActionIcon component={Link} href={backUrl} size="md">
            <IconChevronLeft size="15" />
          </ActionIcon>
        ) : typeof backUrl == 'function' ? (
          <ActionIcon onClick={backUrl} size="md">
            <IconChevronLeft size="15" />
          </ActionIcon>
        ) : null}
        <Title order={2} className={classes.title} ta="center">
          {title}
        </Title>
      </Flex>

      {router.pathname.includes('/auth') ? (
        <ActionIcon component={Link} href={'/'} size="md">
          <IconHome2 size="15" />
        </ActionIcon>
      ) : null}
    </Flex>
  );
}
