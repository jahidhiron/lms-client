import { Select, SelectProps } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { useCategories } from '~/features/category/use-category';
import { MODEL_FETCH_COUNT_ALL } from '~/helpers/constants';
import useTranslation from './use-translation';

const useSelectCategories = () => {
  const { t: commonT, lang } = useTranslation('common');
  const { categories: _categories } = useCategories({
    page: 1,
    size: MODEL_FETCH_COUNT_ALL,
  });

  const categories = useMemo(
    () =>
      _categories?.map((c) => ({
        value: c._id.toString(),
        label: c.title,
        ...c,
      })) || [],
    [_categories]
  );

  const SelectCategories = useCallback(
    (props: Omit<SelectProps, 'data'>) => (
      <Select
        allowDeselect={false}
        label={commonT('common.labels.select-feature', {
          feature: commonT('common.words.category'),
        })}
        data={categories}
        searchable
        clearable
        {...props}
      />
    ),
    [categories, lang]
  );

  return { categories, SelectCategories };
};

export default useSelectCategories;
