import { Paper, SimpleGrid } from '@mantine/core';
import PublicCourseCard from '~/components/cards/PublicCourseCard';
import { useWishlists } from '~/features/wishlist/use-wishlist';

type WishlistingProps = {};

export default function Wishlisting({}: WishlistingProps) {
  const { wishlists } = useWishlists({ page: 1 });

  return (
    <Paper p="lg">
      <SimpleGrid cols={4}>
        {wishlists?.map((wish) => (
          <PublicCourseCard
            key={wish._id}
            orientation="vertical"
            course={wish.course}
            disablePopup
          />
        ))}
      </SimpleGrid>
    </Paper>
  );
}
