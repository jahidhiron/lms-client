import { createFormContext } from '@mantine/form';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { UpdateCourseModel } from '~/features/course/course.model';
import { useCourseMutations } from '~/features/course/use-course';
import { COURSE_STATUS_DRAFT } from '~/helpers/constants';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';

export const [FormProvider, useCourseFormContext, useCourseForm] =
  createFormContext<UpdateCourseModel>();

export const initialValues: UpdateCourseModel = {
  title: '',
  subTitle: '',
  desc: '',
  language: '',
  level: '',
  categoryId: '',
  subCategoryId: '',
  status: COURSE_STATUS_DRAFT,
  whatWillLearn: [
    { id: 'wwl-1', value: '' },
    { id: 'wwl-2', value: '' },
    { id: 'wwl-3', value: '' },
    { id: 'wwl-4', value: '' },
  ],
  prerequisites: [
    { id: 'pr-1', value: '' },
    { id: 'pr-2', value: '' },
    { id: 'pr-3', value: '' },
    { id: 'pr-4', value: '' },
  ],
  whoIsThisCourseFor: [
    { id: 'wtc-1', value: '' },
    { id: 'wtc-2', value: '' },
    { id: 'wtc-3', value: '' },
    { id: 'wtc-4', value: '' },
  ],
  thumbnailId: '',
  promotionalVideoId: '',
  price: {
    currency: '',
    amount: 0,
  },
  welcomeMsg: '',
  congratulationsMsg: '',
  sections: [
    {
      _id: nanoid(),
      title: 'Introduction',
      desc: '',
      items: [],
    },
  ],
};

const CourseFormProvider = ({
  children,
  course,
}: {
  children: ReactNode;
  course: UpdateCourseModel | null;
}) => {
  const router = useRouter();
  const { t: commonT } = useTranslation('common');
  const formRef = useRef<HTMLFormElement>(null);
  const courseId = router.query?.cid as string;
  const { updateCourse } = useCourseMutations();
  const form = useCourseForm({
    initialValues,
  });

  const onSubmit = (values: UpdateCourseModel) => {
    // Validation For Goals Page
    if (router.asPath.endsWith('/goals')) {
      // let errorMessage;
      // const checks = ([] as BaseItem[])
      //   .concat(values.whatWillLearn)
      //   .concat(values.whoIsThisCourseFor)
      //   .concat(values.prerequisites)
      //   .flatMap((v) => v.value);
      // for (let index = 0; index < checks.length; index++) {
      //   const what = checks[index];
      //   if (what.trim() == '' || !what.trim()) {
      //     errorMessage = commonT('common.errors.empty-not-support');
      //     // errorTitle = commonT('common.errors.empty-not-support-title');
      //     toast.error(errorMessage);
      //     return;
      //   }
      // }
    }
    toast.promise(updateCourse(courseId, values), {
      success: (data) => data.message,
      error: errorResolver(form),
      loading: commonT('common.loading.update', {
        feature: commonT('common.words.course'),
      }),
    });
  };

  // @ts-ignore
  form.formRef = formRef.current;

  useEffect(() => {
    if (!!course) {
      form.setValues(course);
    }
  }, [course]);

  return (
    <FormProvider form={form}>
      <form ref={formRef} onSubmit={form.onSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default CourseFormProvider;
