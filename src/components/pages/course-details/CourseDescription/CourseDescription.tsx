import {
  Box,
  List,
  Spoiler,
  Stack,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';

type CourseDescriptionProps = {
  perquisites: string[];
  desc?: string;
  whosCourseThis: string[];
};

export default function CourseDescription({
  perquisites,
  desc,
  whosCourseThis,
}: CourseDescriptionProps) {
  return (
    <Spoiler maxHeight={500} showLabel="Show more" hideLabel="Show less">
      <Stack>
        <Box>
          <Title order={3}>Perquisites</Title>
          <List mt="xs" pl="xs">
            {perquisites?.map((p, index) => (
              <List.Item key={index}>{p}</List.Item>
            ))}
          </List>
        </Box>
        <Box>
          <Title order={3}>Description</Title>
          <TypographyStylesProvider pl="0" mt="xs">
            <div dangerouslySetInnerHTML={{ __html: desc || '' }} />
          </TypographyStylesProvider>
        </Box>
        <Box>
          <Title order={3}>Who this course is for</Title>
          <List mt="xs" pl="xs">
            {whosCourseThis?.map((wct, index) => (
              <List.Item key={index}>{wct}</List.Item>
            ))}
          </List>
        </Box>
      </Stack>
    </Spoiler>
  );
}
