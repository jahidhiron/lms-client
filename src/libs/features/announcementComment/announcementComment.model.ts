import { GetFeatureProps, ListFeaturesProps } from '~/helpers/shared-model';

export type GetAnnouncementCommentProps = GetFeatureProps;

export type ListAnnouncementCommentsProps = ListFeaturesProps;

export type AddAnnouncementCommentModel = {
  title: string;
};

export type UpdateAnnouncementCommentModel = {
  commentId: string;
  title: string;
};

export type AddUpdateAnnouncementCommentModelResp = {
  message: string;
};

export type DeleteAnnouncementCommentModelResp = {
  message: string;
};
