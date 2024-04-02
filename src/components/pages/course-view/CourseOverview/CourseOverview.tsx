import {
  Divider,
  Spoiler,
  Stack,
  Table,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { CourseModel } from '~/features/course/course.model';
import { secondToText } from '~/helpers/utils';

type CourseOverviewProps = {
  course?: CourseModel;
};

export default function CourseOverview({ course }: CourseOverviewProps) {
  return (
    <Stack p="xl">
      <Spoiler maxHeight={500} showLabel="show more" hideLabel="show less">
        <Stack py="sm">
          <Title order={2}>About this course</Title>
          <Text w="550">{course?.subTitle}</Text>
        </Stack>
        <Divider />
        <Table verticalSpacing="xl" withRowBorders layout="fixed">
          <Table.Tbody>
            {/* By Numbers */}
            <Table.Tr>
              <Table.Td style={{ verticalAlign: 'top' }}>
                <Text>By the numbers</Text>
              </Table.Td>
              <Table.Td>
                <Text>Skill level: {course?.level}</Text>
                <Text>Students: 296977</Text>
                <Text>Languages: {course?.language}</Text>
                <Text>Captions: Yes</Text>
              </Table.Td>
              <Table.Td>
                {/* @ts-ignore */}
                <Text>Lectures: {course?.totalLecture}</Text>
                <Text>Video: {secondToText(course?.totalLength || 0)}</Text>
              </Table.Td>
            </Table.Tr>

            {/* Description */}
            <Table.Tr>
              <Table.Td style={{ verticalAlign: 'top' }}>
                <Text>Description</Text>
              </Table.Td>
              <Table.Td colSpan={2}>
                <TypographyStylesProvider pl={0}>
                  <Text
                    dangerouslySetInnerHTML={{
                      __html: course?.desc || '',
                    }}
                  ></Text>
                </TypographyStylesProvider>
              </Table.Td>
            </Table.Tr>

            {/* Instructor */}
            <Table.Tr>
              <Table.Td style={{ verticalAlign: 'top' }}>
                <Text>Instructor</Text>
              </Table.Td>
              <Table.Td colSpan={2}>
                <Text>Skill level: Beginner Level</Text>
                <Text>Students: 296977</Text>
                <Text>Languages: English</Text>
                <Text>Captions: Yes</Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Spoiler>
    </Stack>
  );
}
