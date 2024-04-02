import { NavLink } from '@mantine/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { NavItemType } from '~/helpers/route.map';

type NavLinkListProps = {
  navList: NavItemType[];
};

export default function NavLinkList({ navList }: NavLinkListProps) {
  const router = useRouter();

  return (
    <>
      {useMemo(
        () =>
          navList.map((nl) => {
            const Icon = nl.icon;
            if (nl?.children && nl?.children?.length > 0) {
              return (
                <NavLink
                  key={nl.label}
                  label={nl.label}
                  leftSection={<Icon />}
                  opened={
                    nl.children
                      ?.flatMap((nlChild) => nlChild.url)
                      .includes(router.pathname) || true
                  }
                >
                  <NavLinkList navList={nl.children} />
                </NavLink>
              );
            }
            return (
              <NavLink
                key={nl.label + nl.url}
                label={nl.label}
                component={Link}
                href={nl.url!}
                leftSection={<Icon />}
                active={router.pathname == nl?.url}
              />
            );
          }),
        [navList, router.locale]
      )}
    </>
  );
}
