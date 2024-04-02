import {
  ActionIcon,
  ActionIconGroup,
  Anchor,
  Avatar,
  Card,
  Grid,
  Group,
  Spoiler,
  Stack,
  Text,
  Title,
  TypographyStylesProvider,
} from '@mantine/core';
import { useHover } from '@mantine/hooks';
import {
  IconArrowUp,
  IconEditCircle,
  IconMessage,
  IconTrash,
} from '@tabler/icons-react';
import { FileModel } from '~/features/file/file.model';
import {
  convertToHumanReadable,
  getStaticContentUrl,
  numberFormat,
} from '~/helpers/utils';
type CourseQAItemProps = {
  onPress?: () => void;
  titleUrl?: string;
  authorName?: string;
  authorAvatar?: FileModel | null;
  title: string;
  lectureNo?: number;
  updatedAt?: string;
  description: string;
  totalVote: number;
  isVoted: boolean;
  onVotePress: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  commentCount: number;
};

export default function CourseQAItem({
  onPress,
  authorName,
  authorAvatar,
  title,
  lectureNo,
  updatedAt,
  description,
  totalVote,
  isVoted,
  onVotePress,
  commentCount,
  titleUrl,
  onDelete,
  onEdit,
}: CourseQAItemProps) {
  const { ref, hovered } = useHover();

  return (
    <Card
      role="button"
      style={{ cursor: onPress ? 'pointer' : 'default' }}
      withBorder
      bg={onPress && hovered ? 'gray.1' : 'white'}
      ref={ref}
      onClick={onPress}
    >
      <Grid>
        <Grid.Col span={1}>
          <Avatar
            radius="xl"
            src={getStaticContentUrl(authorAvatar?.path || '')}
          >
            {authorName?.split('')?.splice(0, 2)?.join('')}
          </Avatar>
        </Grid.Col>
        <Grid.Col span={9}>
          <Stack gap={5} justify="space-between">
            {titleUrl ? (
              <Anchor href={titleUrl}>
                <Title order={5}>{title}</Title>
              </Anchor>
            ) : (
              <Title order={5}>{title}</Title>
            )}
            <Group gap="xs">
              {authorName && <Anchor size="xs">{authorName}</Anchor>}
              {lectureNo && <Text size="xs">Lecture {lectureNo}</Text>}
              {updatedAt && (
                <Text size="xs">{convertToHumanReadable(updatedAt)}</Text>
              )}
            </Group>
          </Stack>

          <Group justify="space-between" mt="xs">
            <Spoiler hideLabel="hide" showLabel="show">
              <TypographyStylesProvider p="0" m="0" c="black">
                <div dangerouslySetInnerHTML={{ __html: description || '' }} />
              </TypographyStylesProvider>
            </Spoiler>
          </Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Stack justify="center" align="center" gap="xs">
            <ActionIconGroup orientation="horizontal">
              <ActionIcon
                variant={isVoted ? 'filled' : 'outline'}
                onClick={(ev) => {
                  ev.stopPropagation();
                  onVotePress();
                }}
                pos="relative"
              >
                <Text size="sm" pos="absolute" left={-18} c="gray">
                  {numberFormat(totalVote, 1)}
                </Text>
                <IconArrowUp size="15" />
              </ActionIcon>
              <ActionIcon pos="relative" variant="outline">
                <Text size="sm" pos="absolute" right={-18} c="gray">
                  {numberFormat(commentCount, 1)}
                </Text>
                <IconMessage size="15" />
              </ActionIcon>
            </ActionIconGroup>
            <ActionIconGroup>
              {onEdit && (
                <ActionIcon onClick={onEdit} variant="outline" size="md">
                  <IconEditCircle size="16" />
                </ActionIcon>
              )}
              {onDelete && (
                <ActionIcon
                  onClick={onDelete}
                  color="red"
                  variant="outline"
                  size="md"
                >
                  <IconTrash size="16" />
                </ActionIcon>
              )}
            </ActionIconGroup>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
