import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CourseModel } from '../course/course.model';
import { UserModel } from '../user/user.model';

export type GetEnrollmentProps = GetFeatureProps;

export type ListEnrollmentsProps = ListFeaturesProps;

export type CompleteLectureModel = {
  lectureId: string;
  completeAt: string;
  _id: string;
};

export type EnrollmentModel = {
  _id: string;
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  course: CourseModel;
  complete: CompleteLectureModel[];
};

export type AddUpdateEnrollmentModel = {
  courseId: string;
};

export type AddUpdateEnrollmentModelResp = {
  message: string;
  enrollment: GetEnrollmentModel;
};

export type DeleteEnrollmentModelResp = {
  message: string;
};

export type GetEnrollmentModel = GetFeatureModel<EnrollmentModel, 'enrollment'>;

export type ListEnrollmentModel = ListFeatureModel<
  EnrollmentModel[],
  'enrollments'
>;
