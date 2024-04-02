import { Image } from '@mantine/core';

type BannerProps = {};

export default function Banner({}: BannerProps) {
  return (
    <div>
      <Image w="100%" height={300} src="/banner.webp" alt="banner" />
    </div>
  );
}
