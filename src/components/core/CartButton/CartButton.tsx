import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Indicator,
  Menu,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconShoppingCart } from '@tabler/icons-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { useCarts } from '~/features/cart/use-cart';
import { UserModel } from '~/features/user/user.model';
import { currencyFormatter, getStaticContentUrl } from '~/helpers/utils';

type CartButtonProps = {};

export default function CartButton({}: CartButtonProps) {
  const router = useRouter();
  const inCartPage = router.pathname.endsWith('/cart');
  const { carts } = useCarts({ page: 1 });
  const totalAmount = useMemo(
    () => carts?.reduce((acc, crr) => acc + crr?.course?.price?.amount, 0),
    [carts]
  );
  const [opened, { open, close }] = useDisclosure();

  return (
    <Menu trigger="hover" opened={opened} onClose={close} onOpen={open}>
      <Menu.Target>
        <Indicator
          label={carts?.length || 0}
          disabled={carts?.length === 0}
          inline
          size={16}
        >
          <ActionIcon
            size="lg"
            radius="xl"
            color={opened ? 'orange' : 'dark'}
            variant="subtle"
          >
            <IconShoppingCart size="20" />
          </ActionIcon>
        </Indicator>
      </Menu.Target>
      <Menu.Dropdown miw={300} maw={300}>
        {carts?.map((cart) => (
          <Menu.Item p="xs" key={cart._id}>
            <Flex gap="xs" align="flex-start">
              <Image
                width={100}
                w="100"
                src={getStaticContentUrl(cart?.course?.thumbnail?.path || '')}
                alt="123"
              />
              <Box>
                <Text lineClamp={2} lh="xs" mt="0" pt={0} fw="bold" size="sm">
                  {cart?.course?.title}
                </Text>
                <Text size="xs" c="dimmed">
                  {(cart?.course?.updatedBy as UserModel)?.name}
                </Text>
                <Title order={6}>
                  {cart?.course?.price?.amount
                    ? currencyFormatter(
                        cart?.course?.price?.amount,
                        cart?.course?.price?.currency
                      )
                    : 'Free'}
                </Title>
              </Box>
            </Flex>
          </Menu.Item>
        ))}
        <Menu.Divider />
        <Group justify="space-between" p="sm">
          <Title order={4}>Total: {currencyFormatter(totalAmount || 0)}</Title>
          {!inCartPage && (
            <Button
              component={Link}
              href="/cart"
              onClick={close}
              fullWidth
              variant="light"
            >
              Go To Cart
            </Button>
          )}
        </Group>
      </Menu.Dropdown>
    </Menu>
  );
}
