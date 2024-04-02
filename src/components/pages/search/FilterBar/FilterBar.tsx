import { Accordion, Flex, Select, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FilterModel } from '~/helpers/shared-model';
import FeatureFilter from './filters/FeatureFilter';
import LevelFilter from './filters/LevelFilter';
import PriceFilter from './filters/PriceFilter';
import RatingFilter from './filters/RatingFilter';
import VideoDurationFilter from './filters/VideoDurationFilter';

type FilterBarProps = {
  filters: FilterModel;
};

export default function FilterBar({ filters }: FilterBarProps) {
  const router = useRouter();
  const rating = (router.query?.rating as string) || '';
  const price = (router.query?.price as string) || '';
  const sort = (router.query?.sort as string) || '';
  const languages = useMemo(() => {
    const lang = router.query?.languages || [];
    if (typeof lang === 'string') return [lang];
    return lang;
  }, [router.query]);
  const features = useMemo(() => {
    return [
      (router.query?.quiz as string) || '',
      (router.query?.assignment as string) || '',
      (router.query?.subtitle as string) || '',
    ];
  }, [router.query]);
  const duration = (router.query?.duration as string) || '';
  const level = (router.query?.level as string) || '';

  const onFilter = (key: string) => (value: any) => {
    let query = {
      ...router.query,
      [key]: value,
    };
    if (key === 'features') {
      delete query['features'];

      if (value?.at(0)) {
        query['quiz'] = value[0];
      } else {
        delete query['quiz'];
      }
      if (value?.at(1)) {
        query['assignment'] = value[1];
      } else {
        delete query['assignment'];
      }
      if (value?.at(2)) {
        query['subtitle'] = value[2];
      } else {
        delete query['subtitle'];
      }
      console.log({ query, value });
    }
    router.replace(
      {
        pathname: router?.pathname,
        query,
      },
      undefined,
      { scroll: false }
    );
  };

  return (
    <Stack gap="sm">
      <Flex>
        <Select
          data={[
            { label: 'Latest', value: 'latest' },
            { label: 'Reviewed', value: 'reviewed' },
            { label: 'Rated', value: 'rated' },
          ]}
          onChange={onFilter('sort')}
          value={sort}
          label="Sort By"
          placeholder="Choose sorting"
        />
      </Flex>
      <Accordion defaultValue="rating">
        <Accordion.Item value="rating">
          <Accordion.Control>
            <Text fw="bold" size="xl">
              Rating
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <RatingFilter
              onRatingChange={onFilter('rating')}
              selectedRating={rating}
              ratings={filters?.rating || []}
            />
          </Accordion.Panel>
        </Accordion.Item>
        {/* <Accordion.Item value="language">
        <Accordion.Control>
          <Text fw="bold" size="xl">
            Language
          </Text>
        </Accordion.Control>
        <Accordion.Panel>
          <LanguageFilter
            onLanguageSelect={onFilter('languages')}
            selectedLanguages={languages}
          />
        </Accordion.Panel>
      </Accordion.Item> */}
        <Accordion.Item value="duration">
          <Accordion.Control>
            <Text fw="bold" size="xl">
              Video Duration
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <VideoDurationFilter
              selectedDuration={duration}
              onDurationChange={onFilter('duration')}
              durations={filters?.duration || []}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="levels">
          <Accordion.Control>
            <Text fw="bold" size="xl">
              Levels
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <LevelFilter
              selectedLevel={level}
              onLevelChange={onFilter('level')}
              levels={filters?.level || []}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="features">
          <Accordion.Control>
            <Text fw="bold" size="xl">
              Features
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <FeatureFilter
              selectedFeature={features}
              onFeatureChange={onFilter('features')}
              features={filters?.features || []}
            />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="price">
          <Accordion.Control>
            <Text fw="bold" size="xl">
              Price
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <PriceFilter
              onPriceChange={onFilter('price')}
              prices={filters?.price || []}
              selectedPrice={price}
            />
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}
