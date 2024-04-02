import { BaseItem } from '~/components/core/SortableList/SortableList';
import {
  COURSE_STATUS,
  SECTION_ITEM_ASSIGNMENT,
  SECTION_ITEM_LECTURE,
  SECTION_ITEM_QUIZ,
} from '~/helpers/constants';
import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { AssignmentModel } from '../assignment/assignment.model';
import { CategoryModel } from '../category/category.model';
import { FileModel } from '../file/file.model';
import { LectureModel } from '../lecture/lecture.model';
import { QuizModel } from '../quiz/quiz.model';
import { SubCategoryModel } from '../subCategory/subCategory.model';
import { UserModel } from '../user/user.model';

export type GetCourseProps = GetFeatureProps & {
  isPublic?: boolean;
};

export type ListCoursesProps = ListFeaturesProps & {
  isPublic?: boolean;
  categoryId?: string;
  subCategoryId?: string;
  level?: string;
  rating?: string;
  duration?: string;
  quiz?: string;
  assignment?: string;
  subtitle?: string;
  sort?: string;
  paid?: string;
};

export type SectionItemType =
  | typeof SECTION_ITEM_LECTURE
  | typeof SECTION_ITEM_QUIZ
  | typeof SECTION_ITEM_ASSIGNMENT;

export type CourseModel = {
  price: {
    currency: string;
    amount: 3000;
  };
  _id: string;
  title: string;
  slug: string;
  subTitle: string;
  desc: string;
  language: string;
  level: string;
  status: keyof typeof COURSE_STATUS;
  whatWillLearn: string[];
  prerequisites: string[];
  whoIsThisCourseFor: string[];
  thumbnail?: FileModel;
  thumbnailId: string | FileModel;
  promotionalVideo?: FileModel;
  promotionalVideoId: string | FileModel;
  welcomeMsg: string;
  congratulationsMsg: string;
  sections: SectionModel[];
  updatedBy: string | UserModel;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  categoryId: string | CategoryModel;
  category: CategoryModel;
  subCategoryId: string | SubCategoryModel;
  subCategory: SubCategoryModel;
  totalVideoLength: number;
  lectureCount: number;
  resourceCount: number;
  totalLength: number;
};

export type SectionItemModel = {
  rowId: string;
  itemType: SectionItemType;
  lectureId?: string | LectureModel;
  lecture?: LectureModel;
  quizId?: string | QuizModel;
  quiz?: QuizModel;
  assignmentId?: string | AssignmentModel;
  assignment: AssignmentModel;
};

export type SectionModel = {
  rowId?: string;
  _id?: string;
  title: string;
  desc: string;
  items: SectionItemModel[];
};

export type AddCourseModel = {
  title: string;
  subTitle: string;
  categoryId: string;
  subCategoryId: string;
};

export type UpdateCourseModel = {
  title: string;
  subTitle: string;
  desc: string;
  language: string;
  level: string;
  status: keyof typeof COURSE_STATUS;
  categoryId: string;
  subCategoryId: string;
  whatWillLearn: BaseItem[];
  prerequisites: BaseItem[];
  whoIsThisCourseFor: BaseItem[];
  thumbnailId: string;
  promotionalVideoId: string;
  price: {
    currency: string;
    amount: number;
  };
  welcomeMsg: string;
  congratulationsMsg: string;
  sections: SectionModel[];
};

export type AddUpdateCourseModelResp = GetCourseModel;

export type DeleteCourseModelResp = {
  message: string;
};

export type GetCourseModel = GetFeatureModel<CourseModel, 'course'>;

export type ListCourseModel = ListFeatureModel<CourseModel[], 'courses'>;
