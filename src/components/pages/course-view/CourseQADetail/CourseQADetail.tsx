import {
  Avatar,
  Button,
  Group,
  Skeleton,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';
import { Dispatch, SetStateAction, useState } from 'react';
import toast from 'react-hot-toast';
import TextEditor from '~/components/core/TextEditor';
import useAuth from '~/features/auth/use-auth';
import {
  CourseQADetailView,
  CourseQAView,
  QACommentModel,
} from '~/features/qa/qa.model';
import { useQA, useQAMutations } from '~/features/qa/useQa';
import { errorResolver } from '~/helpers/utils';
import CourseQAItem from '../CourseQAItem';

type CourseQADetailProps = {
  qaId: string | undefined;
  setViewState: Dispatch<SetStateAction<CourseQAView>>;
};

export default function CourseQADetail({
  qaId,
  setViewState,
}: CourseQADetailProps) {
  const [courseDetailView, setCourseDetailView] =
    useState<CourseQADetailView>('detail');

  const [replyView, setReplyView] = useState<boolean>(true);
  const [desc, setDesc] = useState<string>('');
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDesc, setEditDesc] = useState<string>('');
  const [replyEditDesc, setReplayEditDesc] = useState<string>('');
  const [replyId, setReplyId] = useState<string>('');

  const { session } = useAuth();

  const { t: commonT } = useTranslation('common');
  const { qa, isLoading } = useQA({ id: qaId! });
  const {
    addQAReplyVote,
    addReplyQA,
    updateQA,
    updateQAReply,
    addQAVote,
    deleteQA,
    deleteQAReply,
  } = useQAMutations();

  return (
    <Stack w="100%">
      {isLoading ? (
        <Stack w="100%">
          <Skeleton w="100%" h={200} />
          <Skeleton w="100%" h={200} />
          <Skeleton w="100%" h={200} />
          <Skeleton w="100%" h={200} />
        </Stack>
      ) : courseDetailView === 'detail' ? (
        <>
          <CourseQAItem
            key={qa?._id}
            title={qa?.title || ''}
            authorAvatar={qa?.updatedBy?.avatar || null}
            updatedAt={qa?.updatedAt}
            lectureNo={qa?.lectureNo}
            totalVote={qa?.votes?.length || 0}
            onVotePress={() => {
              toast.promise(addQAVote(qa?._id!), {
                success: (data) => data.message,
                error: errorResolver(),
                loading: commonT('common.loading.update', {
                  feature: commonT('common.words.course'),
                }),
              });
            }}
            onEdit={() => {
              setCourseDetailView('edit');
            }}
            onDelete={() => {
              toast.promise(deleteQA(qa?._id!), {
                success: (data) => {
                  setViewState('list');
                  return data.message;
                },
                error: errorResolver(),
                loading: commonT('common.loading.delete', {
                  feature: commonT('common.words.course'),
                }),
              });
            }}
            isVoted={qa?.votes?.includes(session?._id)!}
            description={qa?.desc!}
            commentCount={qa?.comments?.length || 0}
            authorName={qa?.updatedBy?.name!}
          />
          <Stack>
            <Group justify="space-between">
              <Title order={3}>
                {qa?.comments.length === 0 ? null : qa?.comments.length}{' '}
                {qa?.comments.length === 0
                  ? null
                  : qa?.comments.length! > 0
                  ? 'replies'
                  : 'reply'}
              </Title>

              {/* <Title order={3}>Follow replies</Title> */}
            </Group>
            {qa?.comments.map((comment: QACommentModel) => (
              <>
                <CourseQAItem
                  key={comment._id}
                  titleUrl="#"
                  commentCount={0}
                  title={comment?.updatedBy?.name}
                  authorAvatar={comment?.updatedBy?.avatar}
                  updatedAt={comment?.updatedAt}
                  totalVote={comment?.votes?.length || 0}
                  onVotePress={() => {
                    toast.promise(addQAReplyVote(qa?._id, comment?._id), {
                      success: (data) => data.message,
                      error: errorResolver(),
                      loading: commonT('common.loading.update', {
                        feature: commonT('common.words.course'),
                      }),
                    });
                  }}
                  isVoted={comment?.votes?.includes(session?._id)}
                  description={comment?.desc}
                />
                {/* <Group justify="space-between">
                  <Group>
                    <Avatar radius="xl">
                      {qa?.updatedBy?.name &&
                        qa?.updatedBy?.name[0]?.toUpperCase()}
                    </Avatar>
                    <Anchor>{comment.updatedBy.name}</Anchor>
                    {comment.updatedBy.role === 2 && <Text>- Instructor</Text>}
                  </Group>
                  <Group>
                    <Group>
                      {comment.votes.length}
                      <ActionIcon
                        size="md"
                        onClick={() => {
                          addQAReplyVote(qa._id!, comment?._id),
                            {
                              error: errorResolver(),
                              loading: commonT('common.loading.create', {
                                feature: commonT('common.words.course'),
                              }),
                            };
                        }}
                      >
                        <IconArrowUp size="15" />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Group>
                <Group>
                  <Text>{comment.updatedAt}</Text>
                </Group>
                <Group justify="space-between">
                  <Group>
                    <TypographyStylesProvider p="0" m="0" c="black">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: comment?.desc || '',
                        }}
                      />
                    </TypographyStylesProvider>
                    {comment.updatedBy._id === session?._id && (
                      <>
                        <ActionIcon
                          onClick={() => {
                            setCourseDetailView('reply-edit');
                            setReplyId(comment._id);
                            setReplayEditDesc(comment.desc);
                          }}
                        >
                          <IconEdit />
                        </ActionIcon>
                        <ActionIcon
                          onClick={() => {
                            toast.promise(deleteQAReply(qa._id, comment._id), {
                              success: (data) => {
                                return data.message;
                              },
                              error: errorResolver(),
                              loading: commonT('common.loading.create', {
                                feature: commonT('common.words.course'),
                              }),
                            });
                          }}
                        >
                          <IconHttpDelete />
                        </ActionIcon>
                      </>
                    )}
                  </Group>
                </Group> */}
              </>
            ))}
          </Stack>
        </>
      ) : courseDetailView === 'edit' ? (
        <Stack>
          <TextInput
            value={editTitle}
            onChange={(event) => setEditTitle(event.target.value)}
          />
          <TextEditor
            onChange={(value) => setEditDesc(value)}
            value={editDesc}
            withHeading
            withLink
            withTypography
          />
          <Button onClick={() => setCourseDetailView('detail')}>Cancel</Button>
          <Button
            onClick={() => {
              toast.promise(
                updateQA(qa?._id!, { title: editTitle, desc: editDesc }),
                {
                  success: (data) => {
                    return data.message;
                  },
                  error: errorResolver(),
                  loading: commonT('common.loading.create', {
                    feature: commonT('common.words.course'),
                  }),
                }
              );
              setCourseDetailView('detail');
            }}
          >
            Save
          </Button>
        </Stack>
      ) : courseDetailView === 'reply-edit' ? (
        <Stack>
          <TextEditor
            onChange={(value) => setReplayEditDesc(value)}
            value={replyEditDesc}
            withHeading
            withLink
            withTypography
          />
          <Button onClick={() => setCourseDetailView('detail')}>Cancel</Button>
          <Button
            onClick={() => {
              toast.promise(
                updateQAReply(qa?._id!, { desc: replyEditDesc, replyId }),
                {
                  success: (data) => {
                    return data.message;
                  },
                  error: errorResolver(),
                  loading: commonT('common.loading.create', {
                    feature: commonT('common.words.course'),
                  }),
                }
              );
              setCourseDetailView('detail');
            }}
          >
            Save
          </Button>
        </Stack>
      ) : null}
      <Stack>
        {replyView ? (
          <Group>
            <Avatar radius="xl">JA</Avatar>
            <Button onClick={() => setReplyView(!replyView)}>Add Reply</Button>
          </Group>
        ) : (
          <Group>
            <Avatar radius="xl">JA</Avatar>
            <TextEditor
              onChange={(value) => setDesc(value)}
              value={desc}
              withHeading
              withLink
              withTypography
            />
            <Button
              onClick={() => {
                toast.promise(addReplyQA(qa?._id!, { desc }), {
                  success: (data) => {
                    return data.message;
                  },
                  error: errorResolver(),
                  loading: commonT('common.loading.create', {
                    feature: commonT('common.words.course'),
                  }),
                });

                setReplyView(!replyView);
                setDesc('');
              }}
            >
              Add Answer
            </Button>
          </Group>
        )}
      </Stack>
    </Stack>
  );
}
