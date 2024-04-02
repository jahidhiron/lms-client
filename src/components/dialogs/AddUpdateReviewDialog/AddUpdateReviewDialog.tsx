import { Button, Center, Rating, Stack, Textarea } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { modals } from '@mantine/modals';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { AddUpdateReviewModel } from '~/features/review/review.model';
import { addUpdateReviewSchema } from '~/features/review/review.validator';
import { useReviewMutations, useReviews } from '~/features/review/use-review';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

type AddUpdateReviewDialogProps = {
  courseId: string;
};

export default function AddUpdateReviewDialog({
  courseId,
}: AddUpdateReviewDialogProps) {
  const { t: commonT } = useTranslation('common');
  const { addNewReview, updateReview } = useReviewMutations();
  const { reviews } = useReviews({ courseId, page: 1 });
  const review = useMemo(() => reviews?.at(0), [reviews]);
  const form = useForm<AddUpdateReviewModel>({
    validate: zodResolver(addUpdateReviewSchema),
    initialValues: {
      msg: '',
      courseId: '',
      rating: 0,
    },
  });

  useEffect(() => {
    if (review) {
      // @ts-ignore
      form.setFieldValue('courseId', review?.courseId?._id as string);
      form.setFieldValue('msg', review?.msg as string);
      form.setFieldValue('rating', (review?.rating as number) || 0);
    }
  }, [review]);

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        if (review) {
          toast.promise(updateReview(review?._id, { ...values }), {
            success: (data) => {
              modals.closeAll();
              return data.message;
            },
            error: errorResolver(form),
            loading: commonT('common.loading.update'),
          });
          return;
        }
        toast.promise(addNewReview({ ...values, courseId }), {
          success: (data) => {
            modals.closeAll();
            return data.message;
          },
          error: errorResolver(form),
          loading: commonT('common.loading.create'),
        });
      })}
    >
      <Stack>
        <Center>
          <Rating size="xl" fractions={2} {...form.getInputProps('rating')} />
        </Center>
        <Textarea label="Message" {...form.getInputProps('msg')} />
        <Button size="xs" type="submit">
          Review
        </Button>
      </Stack>
    </form>
  );
}
