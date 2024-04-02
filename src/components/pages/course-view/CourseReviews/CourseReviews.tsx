import {
  ActionIcon,
  Box,
  Center,
  CloseIcon,
  Container,
  Divider,
  Flex,
  Group,
  Progress,
  Rating,
  Select,
  Stack,
  Title,
  UnstyledButton,
  rem,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useState } from 'react';
import TextInput from '~/components/core/TextInput';
import { EnrollmentModel } from '~/features/enrollment/enrollment.model';
import { useReviews } from '~/features/review/use-review';
import CourseReviewItem from '../CourseReviewItem';

type CourseReviewsProps = {
  enrollment?: EnrollmentModel;
};

export default function CourseReviews({ enrollment }: CourseReviewsProps) {
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebouncedValue(searchText, 300);
  const [selectedRating, setSelectedRating] = useState<string | null>(null);
  const { reviews } = useReviews({
    courseId: enrollment?.course?._id,
    page: 1,
    q: debouncedSearchText,
    rating: selectedRating || '',
  });

  const onToggleRatingBarClick = (rating: string | null) => () => {
    if (selectedRating == rating) {
      setSelectedRating(null);
    } else {
      setSelectedRating(rating);
    }
  };
  const onResetRatingSelection = () => {
    setSelectedRating(null);
  };

  return (
    <Container p="xl">
      <Box>
        <Title order={2}>Student Reviews</Title>
        <Center w="100%">
          <Flex mt="lg" gap="xl" w="100%">
            <Stack gap="4" align="center" justify="center">
              <Title size={rem(60)}>4.5</Title>
              <Rating value={4.5} fractions={2} />
              <Title order={6}>Course Rating </Title>
            </Stack>
            <Stack gap="xs" style={{ flex: 1 }}>
              <UnstyledButton onClick={onToggleRatingBarClick('5')}>
                <Flex gap="xs" w="100%" align="center">
                  <Progress style={{ flex: 1 }} value={4.5} />
                  <Rating value={5} readOnly />
                  {selectedRating == `${5}` && (
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={onResetRatingSelection}
                    >
                      <CloseIcon />
                    </ActionIcon>
                  )}
                </Flex>
              </UnstyledButton>
              <UnstyledButton onClick={onToggleRatingBarClick('4')}>
                <Flex gap="xs" w="100%" align="center">
                  <Progress style={{ flex: 1 }} value={4.5} />
                  <Rating value={4} readOnly />
                  {selectedRating == `${4}` && (
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={onResetRatingSelection}
                    >
                      <CloseIcon />
                    </ActionIcon>
                  )}
                </Flex>
              </UnstyledButton>
              <UnstyledButton onClick={onToggleRatingBarClick('3')}>
                <Flex gap="xs" w="100%" align="center">
                  <Progress style={{ flex: 1 }} value={4.5} />
                  <Rating value={3} readOnly />
                  {selectedRating == `${3}` && (
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={onResetRatingSelection}
                    >
                      <CloseIcon />
                    </ActionIcon>
                  )}
                </Flex>
              </UnstyledButton>
              <UnstyledButton onClick={onToggleRatingBarClick('2')}>
                <Flex gap="xs" w="100%" align="center">
                  <Progress style={{ flex: 1 }} value={4.5} />
                  <Rating value={2} readOnly />
                  {selectedRating == `${2}` && (
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={onResetRatingSelection}
                    >
                      <CloseIcon />
                    </ActionIcon>
                  )}
                </Flex>
              </UnstyledButton>
              <UnstyledButton onClick={onToggleRatingBarClick('1')}>
                <Flex gap="xs" w="100%" align="center">
                  <Progress style={{ flex: 1 }} value={4.5} />
                  <Rating value={1} readOnly />
                  {selectedRating == `${1}` && (
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={onResetRatingSelection}
                    >
                      <CloseIcon />
                    </ActionIcon>
                  )}
                </Flex>
              </UnstyledButton>
            </Stack>
          </Flex>
        </Center>
      </Box>
      <Box>
        <Group mt="md">
          <TextInput
            placeholder="Search review"
            rightSectionWidth={35}
            rightSection={
              <ActionIcon>
                <IconSearch size="15" />
              </ActionIcon>
            }
            onChange={(ev) => setSearchText(ev.target.value)}
          />
          <Select
            allowDeselect={false}
            onChange={(value) => setSelectedRating(value)}
            value={selectedRating}
            placeholder="Filter Rating"
            data={[
              { value: '5', label: 'Five Star' },
              { value: '4', label: 'Four Star' },
              { value: '3', label: 'Three Star' },
              { value: '2', label: 'Two Star' },
              { value: '1', label: 'One Star' },
            ]}
          />
        </Group>
        <Stack mt="lg">
          {reviews?.map((review, index) => (
            <>
              <CourseReviewItem key={review._id} review={review} />
              {index !== reviews?.length - 1 ? <Divider /> : null}
            </>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}
