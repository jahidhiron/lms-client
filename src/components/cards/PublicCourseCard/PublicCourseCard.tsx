import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Flex,
  Group,
  Image,
  Overlay,
  Popover,
  Rating,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import {
  IconCheck,
  IconHeart,
  IconHeartFilled,
  IconShoppingBag,
} from '@tabler/icons-react';
import Link from 'next/link';
import { ReactNode, useMemo } from 'react';
import toast from 'react-hot-toast';
import LoginDialog from '~/components/dialogs/LoginDialog';
import useAuth from '~/features/auth/use-auth';
import { useCartMutations, useCarts } from '~/features/cart/use-cart';
import { CourseModel } from '~/features/course/course.model';
import { UserModel } from '~/features/user/user.model';
import {
  useWishlistMutations,
  useWishlists,
} from '~/features/wishlist/use-wishlist';
import {
  currencyFormatter,
  errorResolver,
  getStaticContentUrl,
  secondToText,
} from '~/helpers/utils';
import classes from './PublicCourseCard.module.css';

type PublicCourseCardProps = {
  orientation?: 'vertical' | 'horizontal';
  course: CourseModel;
  actionSection?: ReactNode;
  disablePopup?: boolean;
};

export default function PublicCourseCard({
  orientation = 'vertical',
  course,
  actionSection,
  disablePopup,
}: PublicCourseCardProps) {
  const { isAuthenticated } = useAuth();
  const [opened, { open, close }] = useDisclosure(false);
  const { carts } = useCarts({ page: 1 });
  const inCart = useMemo(
    () => !!carts?.find((cart) => cart.course?._id === course?._id),
    [course, carts]
  );
  const { wishlists } = useWishlists({ page: 1 });
  const inWishlist = useMemo(
    () => wishlists?.find((wish) => wish.course?._id == course?._id),
    [wishlists]
  );
  const { addNewCart } = useCartMutations();
  const { addNewWishlist, deleteWishlist } = useWishlistMutations();

  const timeAndLevel = (
    <Group gap="xs">
      <Text c="dimmed" size="xs">
        {secondToText(course?.totalLength)}
      </Text>
      <Text c="dimmed" size="xs">
        {course?.level}
      </Text>
      <Text c="dimmed" size="xs">
        {course?.language}
      </Text>
    </Group>
  );

  return (
    <Box onMouseOver={!disablePopup ? open : undefined} onMouseLeave={close}>
      <Popover
        withArrow
        offset={{ mainAxis: -10 }}
        arrowRadius={5}
        shadow="lg"
        arrowSize={20}
        withRoles
        position={orientation === 'horizontal' ? 'top' : 'right'}
        transitionProps={{ transition: 'pop' }}
        opened={opened}
      >
        <Popover.Target>
          <Box className={classes.courseCard} data-orientation={orientation}>
            <Box pos="relative" h="200" mb="sm">
              <Overlay opacity={opened ? 0.4 : 0} />
              <Image
                h="200px"
                src={getStaticContentUrl(course?.thumbnail?.path || '')}
                alt="course-thumb"
              />
            </Box>
            <Stack gap={5} className={classes.courseContent}>
              <Anchor
                component={Link}
                href={`/courses/${course?.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Box>
                  <Flex gap="md" w="100%" justify="space-between">
                    <Text
                      size="md"
                      fw="bold"
                      lineClamp={2}
                      className={classes.title}
                      c="black"
                    >
                      {course?.title}
                    </Text>
                    <Title
                      order={4}
                      c="black"
                      className={classes.coursePrice}
                      hidden={orientation === 'vertical'}
                    >
                      {course?.price?.amount
                        ? currencyFormatter(
                            course?.price?.amount,
                            course?.price?.currency
                          )
                        : 'Free'}
                    </Title>
                  </Flex>
                  <Text my="1" size="sm" c="black">
                    {course?.subTitle}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {(course?.updatedBy as UserModel)?.name}
                  </Text>
                </Box>
                <Group gap="xs" align="center">
                  <Text size="xs" fw="bold">
                    4.5
                  </Text>
                  <Rating size="xs" readOnly />
                  <Text size="xs">(123,12313)</Text>
                </Group>
                {timeAndLevel}
              </Anchor>
              {actionSection && (
                <Group justify="flex-end">{actionSection}</Group>
              )}
              <Box style={{ flex: 1 }} />
              <Title
                order={4}
                className={classes.coursePrice}
                hidden={orientation === 'horizontal'}
              >
                {course?.price?.amount
                  ? currencyFormatter(
                      course?.price?.amount,
                      course?.price?.currency
                    )
                  : 'Free'}
              </Title>
            </Stack>
          </Box>
        </Popover.Target>
        <Popover.Dropdown maw={400} miw={400}>
          <Stack gap={5}>
            {orientation == 'vertical' ? (
              <>
                <Title order={4}>{course?.title}</Title>
                {timeAndLevel}
                <Text size="sm">{course?.subTitle}</Text>
              </>
            ) : (
              <>
                <Title order={4}>What will learn</Title>
              </>
            )}
            <SimpleGrid cols={2} spacing="0" mt="lg">
              {course?.whatWillLearn?.map((wwl, i) => (
                <Flex align="center" gap="xs" key={wwl + i}>
                  <IconCheck color="gray" size="20" />
                  <Text>{wwl}</Text>
                </Flex>
              ))}
            </SimpleGrid>
            <Flex mt="lg" align="center" gap="xs">
              {inCart ? (
                <Button
                  fullWidth
                  leftSection={<IconShoppingBag />}
                  component={Link}
                  href="/cart"
                >
                  Go To Cart
                </Button>
              ) : (
                <Button
                  fullWidth
                  leftSection={<IconShoppingBag />}
                  onClick={() => {
                    toast.promise(
                      addNewCart([{ courseId: course?._id }, course]),
                      {
                        success: (data) => data.message,
                        error: errorResolver(),
                        loading: 'adding',
                      }
                    );
                  }}
                >
                  Add To Cart
                </Button>
              )}
              <ActionIcon
                size="xl"
                radius="xl"
                onClick={() => {
                  if (!isAuthenticated) {
                    modals.open({
                      children: <LoginDialog />,
                    });
                    return;
                  }
                  if (!inWishlist) {
                    toast.promise(addNewWishlist({ courseId: course?._id }), {
                      success: (data) => data.message,
                      error: errorResolver(),
                      loading: 'adding',
                    });
                  } else {
                    toast.promise(deleteWishlist(inWishlist?._id), {
                      success: (data) => data.message,
                      error: errorResolver(),
                      loading: 'adding',
                    });
                  }
                }}
                variant="outline"
              >
                {inWishlist ? <IconHeartFilled /> : <IconHeart />}
              </ActionIcon>
            </Flex>
          </Stack>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
}
