import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Stack,
  Title,
} from '@mantine/core';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import PublicCourseCard from '~/components/cards/PublicCourseCard';
import { useCartMutations, useCarts } from '~/features/cart/use-cart';
import { useEnrollmentMutations } from '~/features/enrollment/use-enrollment';
import { currencyFormatter, errorResolver } from '~/helpers/utils';

const CartPage = () => {
  const { carts } = useCarts({ page: 1 });
  const { deleteCart } = useCartMutations();
  const { addNewEnrollment } = useEnrollmentMutations();
  const totalAmount = useMemo(
    () => carts?.reduce((acc, crr) => acc + crr?.course?.price?.amount || 0, 0),
    [carts]
  );
  return (
    <Container size="xl" pt="md">
      <Title>Shopping Cart</Title>
      <Grid mt="lg" gutter={'xl'}>
        <Grid.Col span={8}>
          <Stack>
            <Box>
              {carts?.length > 0 && (
                <Title order={6}>{carts?.length} Course is cart</Title>
              )}
              <Divider />
            </Box>
            {carts?.map((cart) => (
              <PublicCourseCard
                course={cart?.course}
                key={cart?._id}
                actionSection={
                  <Group>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => {
                        toast.promise(deleteCart([cart?._id, cart?.course]), {
                          success: (data) => data.message,
                          error: errorResolver(),
                          loading: 'removing...',
                        });
                      }}
                    >
                      Remove
                    </Button>
                  </Group>
                }
                orientation="horizontal"
                disablePopup
              />
            ))}
          </Stack>
        </Grid.Col>
        <Grid.Col span={4}>
          <Stack pl="xl">
            <Box>
              <Title order={5} c="dimmed">
                Total
              </Title>
              <Title order={2}>{currencyFormatter(totalAmount || 0)}</Title>
            </Box>
            <Button
              fullWidth
              onClick={() => {
                toast.promise(
                  Promise.allSettled(
                    carts?.map((cart) =>
                      addNewEnrollment({ courseId: cart.course?._id })
                    )
                  ),
                  {
                    success: (data) => {
                      carts.forEach((cart) => {
                        deleteCart([cart._id, cart.course]);
                      });
                      return 'enrollment done';
                    },
                    loading: 'enrolling....',
                    error: errorResolver(),
                  }
                );
              }}
            >
              Checkout
            </Button>
            {/* <Divider />
            <Title order={6}>Promotion</Title>
            <Box>
              <Group gap="xs">
                <CloseButton />
                <Text c="dimmed">
                  <Text component="span" tt="uppercase" fw="bold">
                    avrsad
                  </Text>{' '}
                  ls applied
                </Text>
              </Group>
              <TextInput
                rightSectionWidth={75}
                rightSection={
                  <Center w="100%">
                    <Button size="xs">Apply</Button>
                  </Center>
                }
              />
            </Box> */}
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default CartPage;
