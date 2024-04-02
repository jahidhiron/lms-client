import { Select, SelectProps } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { useSubCategories } from '~/features/subCategory/use-subCategory';
import { MODEL_FETCH_COUNT_ALL } from '~/helpers/constants';
import useTranslation from './use-translation';

const useSelectSubCategories = ({
  categoryId,
  q,
}: {
  categoryId?: string;
  q?: string;
  enabled?: boolean;
}) => {
  const { t: commonT, lang } = useTranslation('common');
  const { subCategories: _categories } = useSubCategories({
    page: 1,
    size: MODEL_FETCH_COUNT_ALL,
    categoryId,
    q,
  });

  const subcategories = useMemo(
    () =>
      _categories?.map((c) => ({ value: c._id.toString(), label: c.title })) ||
      [],
    [_categories]
  );

  const SelectSubCategories = useCallback(
    (props: Omit<SelectProps, 'data'>) => (
      <Select
        allowDeselect={false}
        label={commonT('common.labels.select-feature', {
          feature: commonT('common.words.sub-category'),
        })}
        data={subcategories}
        searchable
        clearable
        {...props}
      />
    ),
    [subcategories, lang]
  );

  return { subcategories, SelectSubCategories };
};

export default useSelectSubCategories;
