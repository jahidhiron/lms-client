import {
  ActionIcon,
  Box,
  Button,
  Flex,
  List,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  IconFileDownload,
  IconHeart,
  IconHeartFilled,
  IconInfinity,
  IconShare,
  IconShoppingCartFilled,
  IconTrophy,
  IconVideo,
} from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import LoginDialog from '~/components/dialogs/LoginDialog';
import useAuth from '~/features/auth/use-auth';
import { useCartMutations, useCarts } from '~/features/cart/use-cart';
import { CourseModel } from '~/features/course/course.model';
import {
  useWishlistMutations,
  useWishlists,
} from '~/features/wishlist/use-wishlist';
import {
  currencyFormatter,
  errorResolver,
  secondToText,
} from '~/helpers/utils';

type CoursePricingCardProps = {
  course?: CourseModel;
};

export default function CoursePricingCard({ course }: CoursePricingCardProps) {
  const { isAuthenticated } = useAuth();
  const { carts } = useCarts({ page: 1 });
  const { wishlists } = useWishlists({ page: 1 });
  const inWishlist = useMemo(
    () => wishlists?.find((wish) => wish.course?._id == course?._id),
    [wishlists]
  );
  const { addNewWishlist, deleteWishlist } = useWishlistMutations();

  const inCart = useMemo(
    () => carts.find((item) => item.course?._id == course?._id),
    [course, carts]
  );

  const { addNewCart } = useCartMutations();

  return (
    <Paper p="md" withBorder>
      <Title ta="center" order={2}>
        {currencyFormatter(course?.price?.amount || 0)}
      </Title>
      <Text ta="center" size="xs">
        30-Day Money-Back Guarantee
      </Text>
      <Flex align="center" mt="lg" mb="xs" gap="xs">
        {inCart ? (
          <Button
            fullWidth
            leftSection={<IconShoppingCartFilled size="20" />}
            component={Link}
            href="/cart"
          >
            Go To Cart
          </Button>
        ) : (
          <Button
            onClick={() => {
              toast.promise(addNewCart([{ courseId: course?._id! }, course!]), {
                success: (data) => data.message,
                error: errorResolver(),
                loading: 'adding',
              });
            }}
            fullWidth
            leftSection={<IconShoppingCartFilled size="20" />}
          >
            Add To Cart
          </Button>
        )}
        <ActionIcon
          size="lg"
          variant={!inWishlist ? 'outline' : 'filled'}
          onClick={() => {
            if (!isAuthenticated) {
              modals.open({
                children: <LoginDialog />,
              });
              return;
            }
            if (!inWishlist) {
              toast.promise(addNewWishlist({ courseId: course?._id! }), {
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
        >
          {!inWishlist ? <IconHeart size="20" /> : <IconHeartFilled />}
        </ActionIcon>
      </Flex>
      <Button
        variant="outline"
        fullWidth
        leftSection={<IconShoppingCartFilled size="20" />}
      >
        Buy Now
      </Button>
      <Box mt="lg">
        <Title order={6}>This Course Includes: </Title>
        <List mt="sm">
          <List.Item
            styles={{
              itemIcon: { display: 'flex', alignItems: 'center' },
            }}
            c="dark"
            icon={<IconVideo size="20" />}
          >
            {secondToText(course?.totalVideoLength || 0)} On Demand Video
          </List.Item>
          <List.Item
            styles={{
              itemIcon: { display: 'flex', alignItems: 'center' },
            }}
            c="dark"
            icon={<IconFileDownload size="20" />}
          >
            {course?.resourceCount || 0} downloadable resources
          </List.Item>
          <List.Item
            styles={{
              itemIcon: { display: 'flex', alignItems: 'center' },
            }}
            c="dark"
            icon={<IconTrophy size="20" />}
          >
            Certificate of completion
          </List.Item>
          <List.Item
            styles={{
              itemIcon: { display: 'flex', alignItems: 'center' },
            }}
            c="dark"
            icon={<IconInfinity size="20" />}
          >
            Full lifetime access
          </List.Item>
        </List>
      </Box>
      <Flex justify="flex-end">
        <Button
          size="xs"
          variant="subtle"
          rightSection={<IconShare size="15" />}
        >
          Share
        </Button>
      </Flex>
    </Paper>
  );
}
