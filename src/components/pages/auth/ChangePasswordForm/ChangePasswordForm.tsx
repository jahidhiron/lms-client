import { Button, Group, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconFocus2 } from '@tabler/icons-react';
import { type FC } from 'react';
import toast from 'react-hot-toast';
import { ChangePasswordReqBody } from '~/features/auth/auth.model';
import { changePasswordSchema } from '~/features/auth/auth.validator';
import { useAuthMutations } from '~/features/auth/use-auth';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import classes from './ChangePasswordForm.module.css';

interface ChangePasswordFormProps {}

const ChangePasswordForm: FC<ChangePasswordFormProps> = () => {
  const [loading, { close: closeLoading, open: openLoading }] =
    useDisclosure(false);
  const { t: commonT } = useTranslation('common');
  const { changePassword } = useAuthMutations();
  const form = useForm<ChangePasswordReqBody & { confirm_password: string }>({
    validate: changePasswordSchema,
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirm_password: '',
    },
  });

  return (
    <>
      <form
        onSubmit={form.onSubmit((values) => {
          openLoading();
          toast.promise(changePassword(values), {
            loading: commonT('common.loading.update'),
            success(data) {
              closeLoading();
              form.reset();
              return data.message;
            },
            error(error) {
              closeLoading();
              return errorResolver(form)(error);
            },
          });
        })}
      >
        <PasswordInput
          withAsterisk
          label={commonT('common.words.old-password')}
          placeholder="*******"
          mt="sm"
          {...form.getInputProps('oldPassword')}
        />
        <PasswordInput
          withAsterisk
          label={commonT('common.words.new-password')}
          placeholder="*******"
          mt="sm"
          {...form.getInputProps('newPassword')}
        />
        <PasswordInput
          withAsterisk
          label={commonT('common.words.confirm_password')}
          placeholder="*******"
          mt="sm"
          {...form.getInputProps('confirm_password')}
        />

        <Group mt="lg" className={classes.controls}>
          <Button
            loading={loading}
            type="submit"
            className={classes.control}
            rightSection={<IconFocus2 />}
          >
            {commonT('common.words.change-password')}
          </Button>
        </Group>
      </form>
    </>
  );
};

export default ChangePasswordForm;
