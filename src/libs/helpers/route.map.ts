import {
  Icon360View,
  IconChartArcs3,
  IconMessage,
  IconMessage2,
  IconMessage2Check,
  IconMicrophone,
  IconQuestionMark,
  IconSubtask,
  IconUserCircle,
  IconVideoPlus,
  TablerIconsProps,
} from '@tabler/icons-react';
import React from 'react';
import { CourseModel } from '~/features/course/course.model';
import { CustomTranslate } from '~/hooks/use-translation';
import { ROLES, ROLE_ADMIN, ROLE_STUDENT, ROLE_TEACHER } from './constants';

export const route = {
  auth: {
    pathname: '/auth',
  },
  teacher: {
    pathname: '/console/dash',
  },
};
export type NavItemType = {
  label: string;
  url?: string;
  icon: (_props: TablerIconsProps) => React.JSX.Element;
  children?: NavItemType[];
};
export const navigation: (
  _t: CustomTranslate
) => Record<keyof typeof ROLES, NavItemType[]> = (t) => ({
  [ROLE_TEACHER]: [
    {
      label: t('common.navigation.courses'),
      url: '/console/teacher/courses',
      icon: IconVideoPlus,
    },
    {
      label: t('common.navigation.communication'),
      icon: IconMessage,
      children: [
        {
          label: t('common.navigation.qa'),
          url: '/console/teacher/communication/qa',
          icon: IconQuestionMark,
        },
        {
          label: t('common.navigation.messages'),
          url: '/console/teacher/communication/messages',
          icon: IconMessage2Check,
        },
        {
          label: t('common.navigation.assignments'),
          url: '/console/teacher/communication/assignments',
          icon: IconSubtask,
        },
        {
          label: t('common.navigation.announcements'),
          url: '/console/teacher/communication/announcements',
          icon: IconMicrophone,
        },
      ],
    },
    {
      label: t('common.navigation.performance'),
      icon: IconChartArcs3,
      children: [
        {
          label: t('common.navigation.overview'),
          url: '/console/teacher/performance/overview',
          icon: Icon360View,
        },
        {
          label: t('common.navigation.students'),
          url: '/console/teacher/performance/students',
          icon: IconUserCircle,
        },
        {
          label: t('common.navigation.review'),
          url: '/console/teacher/performance/review',
          icon: IconMessage2,
        },
      ],
    },
  ],
  [ROLE_ADMIN]: [],
  [ROLE_STUDENT]: [],
});

export type CourseNavigationType = {
  title: string;
  url?: string;
  children?: CourseNavigationType[];
  done?: boolean;
};
export const courseNavigation: (
  _t: CustomTranslate,
  _course?: CourseModel
) => CourseNavigationType[] = (t, course) => [
  {
    title: t('common.course-navigation.plan-course'),
    children: [
      {
        title: t('common.course-navigation.intended-learners'),
        url: '/manage/goals',
        done:
          (course?.whatWillLearn?.length as number) >= 4 &&
          (course?.prerequisites?.length as number) >= 4 &&
          (course?.whoIsThisCourseFor?.length as number) >= 4,
      },
    ],
  },
  {
    title: t('common.course-navigation.create-your-content'),
    children: [
      {
        title: t('common.course-navigation.curriculum'),
        url: '/manage/curriculum',
        done:
          (course?.sections?.length as number) > 0 &&
          (course?.sections?.at(0)?.items?.length as number) > 0 &&
          !!course?.sections?.at(0)?.title,
      },
    ],
  },
  {
    title: t('common.course-navigation.publish-courses'),
    children: [
      {
        title: t('common.course-navigation.course-landing-page'),
        url: '/manage/basics',
        done: Boolean(
          course?.title &&
            course?.subTitle &&
            course?.desc &&
            course?.language &&
            course?.level &&
            course?.subCategoryId &&
            course?.categoryId &&
            course?.promotionalVideo &&
            course?.thumbnail
        ),
      },
      {
        title: t('common.course-navigation.pricing'),
        url: '/manage/pricing',
        done: Object.values(course?.price || {}).length == 2,
      },
      // {
      //   title: t('common.course-navigation.promotions'),
      //   url: '/manage/promotions',
      // },
      {
        title: t('common.course-navigation.courses-messages'),
        url: '/manage/messages',
        done: Boolean(course?.welcomeMsg && course?.congratulationsMsg),
      },
    ],
  },
];
