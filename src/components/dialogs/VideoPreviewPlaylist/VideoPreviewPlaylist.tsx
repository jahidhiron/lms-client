import {
  Flex,
  Group,
  Modal,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { secondToText } from '~/helpers/utils';
import classes from './VideoPreviewPlaylist.module.css';

type VideoPreviewPlaylistProps = {
  opened: boolean;
  onClose: () => void;
  list: ({
    url: string;
    timeLength: number;
    title: string;
  } | null)[];
};

export default function VideoPreviewPlaylist({
  opened,
  onClose,
  list,
}: VideoPreviewPlaylistProps) {
  const [selectedItem, setSelectedItem] = useState<any>();

  useEffect(() => {
    setSelectedItem(list?.[0]);
  }, [list]);

  return (
    <Modal.Root onClose={onClose} opened={opened} p="xs">
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Title order={6}>{selectedItem?.title}</Title>
          <Modal.CloseButton />
        </Modal.Header>
        <video width="100%" src={selectedItem?.url} controls></video>
        <Stack gap={0} className={classes.playList}>
          <Title p="xs" order={6} c="dimmed">
            Previewed Course
          </Title>
          {list?.map((item, index) => (
            <UnstyledButton
              key={index}
              p="xs"
              w="100%"
              className={classes.playListItem}
              data-playing={item?.url === selectedItem?.url}
              onClick={() => {
                setSelectedItem(item);
              }}
            >
              <Group justify="space-between">
                <Flex align="center" gap="xs">
                  <video width="50" src={selectedItem?.url}></video>
                  {item?.url === selectedItem?.url && (
                    <ThemeIcon variant="light" radius="xl">
                      <IconPlayerPlay size="20" />
                    </ThemeIcon>
                  )}{' '}
                  <Title order={6}>{item?.title}</Title>
                </Flex>
                <Text size="xs">{secondToText(item?.timeLength || 0)}</Text>
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      </Modal.Content>
    </Modal.Root>
  );
}
