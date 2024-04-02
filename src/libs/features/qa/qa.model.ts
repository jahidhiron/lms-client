import {
  GetFeatureModel,
  GetFeatureProps,
  ListFeatureModel,
  ListFeaturesProps,
} from '~/helpers/shared-model';
import { CourseModel } from '../course/course.model';
import { UserModel } from '../user/user.model';
import { LectureModel } from '../lecture/lecture.model';

export type CourseQAView = 'detail' | 'list' | 'new';

export type CourseQADetailView = 'detail' | 'edit' | 'reply-edit';

export type GetQAProps = GetFeatureProps;

export type ListQAsProps = ListFeaturesProps & {
  courseId?: string;
  lectureId?: string;
};

export type QACommentModel = {
  _id: string;
  desc: string;
  updatedBy: UserModel;
  createdAt: string;
  updatedAt: string;
  votes: string[];
};

export type QaModel = {
  _id: string;
  title: string;
  desc: string;
  votes: string[];
  updatedBy: UserModel;
  comments: QACommentModel[];
  createdAt: string;
  updatedAt: string;
  lecture: LectureModel;
  course: CourseModel;
  courseId: string;
  lectureId: string;
  lectureNo: number;
};

export type AddReplyQAModel = {
  desc: string;
};

export type AddQAModel = {
  title: string;
  desc: string;
  courseId: string;
  lectureId: string;
};

export type UpdateQAModel = {
  title: string;
  desc: string;
};

export type UpdateQAReplyModel = {
  desc: string;
  replyId: string;
};

export type AddUpdateQAModelResp = {
  message: string;
  data: { qa: GetQAModel };
};

export type AddQAVoteModel = {};
export type AddQAVoteModelResp = {
  message: string;
  data: { qa: GetQAModel };
};

export type AddQAReplyVoteModel = { replyId: string };
export type AddQAReplyVoteModelResp = {
  message: string;
  data: { qa: GetQAModel };
};

export type DeleteQAModelResp = {
  message: string;
};

export type GetQAModel = GetFeatureModel<QaModel, 'qa'>;

export type ListQAModel = ListFeatureModel<QaModel, 'qas'>;
