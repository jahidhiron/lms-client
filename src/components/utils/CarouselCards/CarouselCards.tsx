import { Carousel } from '@mantine/carousel';
import { Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react';
import { Children, ReactNode, useMemo } from 'react';

type CarouselCardsProps = {
  children: ReactNode | ReactNode[];
  title?: ReactNode;
  subTitle?: ReactNode;
};

export default function CarouselCards({
  children,
  title: _title,
  subTitle: _subTitle,
}: CarouselCardsProps) {
  const slides = useMemo(
    () =>
      Children.map(children, (child, index) => (
        <Carousel.Slide key={index}>{child}</Carousel.Slide>
      )),
    [children]
  );
  const title =
    typeof _title == 'string' ? <Title order={4}>{_title}</Title> : _title;
  const subTitle =
    typeof _subTitle == 'string' ? (
      <Text size="md">{_subTitle}</Text>
    ) : (
      _subTitle
    );
  return (
    <Stack my="md">
      {title}
      {subTitle}
      <Carousel
        slideSize={250}
        slideGap="md"
        align="start"
        loop
        slidesToScroll={5}
        controlSize={30}
        nextControlIcon={
          <ThemeIcon size="lg" radius="xl">
            <IconArrowRight size="15" />
          </ThemeIcon>
        }
        previousControlIcon={
          <ThemeIcon size="lg" radius="xl">
            <IconArrowLeft size="15" />
          </ThemeIcon>
        }
      >
        {slides}
      </Carousel>
    </Stack>
  );
}
