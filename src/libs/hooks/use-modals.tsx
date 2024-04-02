import { Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import useTranslation from './use-translation';

const useModals = () => {
  const { t: commonT } = useTranslation('common');

  const remove = (
    feature: string,
    title: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => {
    modals.openConfirmModal({
      title: commonT('common.labels.remove', {
        feature,
        title,
      }),
      centered: true,
      children: (
        <Text size="sm">
          {commonT('common.labels.remove-message', {
            feature,
            title,
          })}
        </Text>
      ),
      labels: {
        confirm: commonT('common.words.confirm'),
        cancel: commonT('common.words.cancel'),
      },
      confirmProps: { color: 'red' },
      onConfirm,
      onCancel,
    });
  };

  return { remove };
};

export default useModals;
