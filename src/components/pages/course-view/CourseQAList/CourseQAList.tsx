import { Dispatch, SetStateAction } from 'react';
import toast from 'react-hot-toast';
import useAuth from '~/features/auth/use-auth';
import { CourseQAView, QaModel } from '~/features/qa/qa.model';
import { useQAMutations } from '~/features/qa/useQa';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import CourseQAItem from '../CourseQAItem';

type CourseQAListProps = {
  setViewState: Dispatch<SetStateAction<CourseQAView>>;
  setQaId: Dispatch<SetStateAction<string | undefined>>;
  qas: QaModel[];
};

export default function CourseQAList({
  setViewState,
  setQaId,
  qas,
}: CourseQAListProps) {
  const { session } = useAuth();
  const { t: commonT } = useTranslation('common');
  const { addQAVote } = useQAMutations();

  return (
    <>
      {qas.map((qa) => (
        <CourseQAItem
          key={qa._id}
          title={qa?.title}
          authorAvatar={qa?.updatedBy?.avatar}
          updatedAt={qa?.updatedAt}
          onPress={() => {
            if (setViewState && setQaId) {
              setViewState('detail');
              setQaId(qa?._id);
            }
          }}
          lectureNo={qa?.lectureNo}
          totalVote={qa?.votes?.length || 0}
          onVotePress={() => {
            toast.promise(addQAVote(qa?._id), {
              success: (data) => data.message,
              error: errorResolver(),
              loading: commonT('common.loading.update', {
                feature: commonT('common.words.course'),
              }),
            });

            // onClick={(ev) => {
            //   ev.stopPropagation();
            //   if (voteType === 'reply' && reply) {
            //     toast.promise(addQAReplyVote(qa?._id, reply?._id), {
            //       success: (data) => data.message,
            //       error: errorResolver(),
            //       loading: commonT('common.loading.update', {
            //         feature: commonT('common.words.course'),
            //       }),
            //     });
            //   } else {
            //   }
            // }}
          }}
          isVoted={qa?.votes?.includes(session?._id)}
          description={qa?.desc}
          commentCount={qa?.comments?.length || 0}
          authorName={qa?.updatedBy?.name}
        />
      ))}
    </>
  );
}
