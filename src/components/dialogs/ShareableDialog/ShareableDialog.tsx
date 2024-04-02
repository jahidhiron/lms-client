import { Group, ThemeIcon } from '@mantine/core';
import {
  IconBrandFacebookFilled,
  IconBrandWhatsapp,
  IconBrandXFilled,
} from '@tabler/icons-react';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share';
type ShareableDialogProps = {
  url: string;
};

export default function ShareableDialog({ url }: ShareableDialogProps) {
  return (
    <Group>
      <FacebookShareButton url={url}>
        <ThemeIcon size="xl" color="blue">
          <IconBrandFacebookFilled />
        </ThemeIcon>
      </FacebookShareButton>
      <TwitterShareButton url={url}>
        <ThemeIcon size="xl" color="black">
          <IconBrandXFilled />
        </ThemeIcon>
      </TwitterShareButton>
      <WhatsappShareButton url={url}>
        <ThemeIcon size="xl" color="green">
          <IconBrandWhatsapp />
        </ThemeIcon>
      </WhatsappShareButton>
    </Group>
  );
}
