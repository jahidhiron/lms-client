import { Box, Button, CloseButton, Group, Tabs } from '@mantine/core';
import { IconFilePlus } from '@tabler/icons-react';
import { ReactNode, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import DropzoneContainer from '~/components/core/DropzoneContainer';
import LibraryFileListing from '~/components/core/LibraryFileListing';
import { LectureModel } from '~/features/lecture/lecture.model';
import { useLectureMutations } from '~/features/lecture/use-lecture';
import { FILE_TYPE_DOCUMENT } from '~/helpers/constants';
import { errorResolver } from '~/helpers/utils';
import useTranslation from '~/hooks/use-translation';
import ExternalResourcesLinkForm from '../ExternalResourcesLinkForm';
import ResourcesListPreview from '../ResourcesListPreview';

type AddResourcesSectionProps = {
  lecture?: LectureModel;
};

type ViewStateType = 'idle' | 'preview' | 'upload';

export default function AddResourcesSection({
  lecture,
}: AddResourcesSectionProps) {
  const [viewState, setViewState] = useState<ViewStateType>(
    (lecture?.resources?.length as number) > 0 ? 'preview' : 'idle'
  );
  const { updateLecture } = useLectureMutations();
  const { t: commonT } = useTranslation('common');

  const renderView = useMemo(
    () =>
      ({
        idle: (
          <Button
            leftSection={<IconFilePlus size="20" />}
            color="grape"
            size="xs"
            variant="outline"
            onClick={() => {
              setViewState('upload');
            }}
          >
            Add Resources
          </Button>
        ),
        preview: (
          <ResourcesListPreview
            resources={lecture?.resources}
            onAdd={() => {
              setViewState('upload');
            }}
            onRemove={(_id) => {
              toast.promise(
                updateLecture(lecture?._id!, {
                  desc: lecture?.desc!,
                  preview: lecture?.preview || false,
                  resources:
                    lecture?.resources?.filter((r) => r._id != _id) || [],
                  title: lecture?.title,
                  videoId: lecture?.videoId as string,
                }),
                {
                  success: (data) => {
                    setViewState('preview');
                    return data.message;
                  },
                  error: errorResolver(),
                  loading: commonT('common.loading.update', {
                    feature: commonT('common.words.lecture'),
                  }),
                }
              );
            }}
          />
        ),
        upload: (
          <Box w="100%">
            <Group w="100%" mb={0} justify="flex-end">
              <CloseButton
                onClick={() => {
                  if ((lecture?.resources?.length as number) > 0) {
                    setViewState('preview');
                    return;
                  }
                  setViewState('idle');
                }}
              />
            </Group>
            <Tabs defaultValue="file">
              <Tabs.List>
                <Tabs.Tab value="file">Downloadable Resource</Tabs.Tab>
                <Tabs.Tab value="library">Add From Library</Tabs.Tab>
                <Tabs.Tab value="links">External Links</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="file">
                <Box py="sm">
                  <DropzoneContainer
                    fileType={FILE_TYPE_DOCUMENT}
                    onDone={(files) => {
                      toast.promise(
                        updateLecture(lecture?._id!, {
                          desc: lecture?.desc!,
                          preview: lecture?.preview || false,
                          resources: [
                            ...(lecture?.resources || []),
                            ...files.map((file) => ({
                              title: file.name,
                              fileId: file._id,
                            })),
                          ],
                          title: lecture?.title,
                          videoId: lecture?.videoId as string,
                        }),
                        {
                          success: (data) => {
                            setViewState('preview');
                            return data.message;
                          },
                          error: errorResolver(),
                          loading: commonT('common.loading.update', {
                            feature: commonT('common.words.lecture'),
                          }),
                        }
                      );
                    }}
                  />
                </Box>
              </Tabs.Panel>
              <Tabs.Panel value="library">
                <LibraryFileListing
                  multiple
                  type={FILE_TYPE_DOCUMENT}
                  onSelect={(files) => {
                    toast.promise(
                      updateLecture(lecture?._id!, {
                        desc: lecture?.desc!,
                        preview: lecture?.preview || false,
                        resources: [
                          ...(lecture?.resources || []),
                          ...files.map((file) => ({
                            title: file.name,
                            fileId: file._id,
                          })),
                        ],
                        title: lecture?.title,
                        videoId: lecture?.videoId as string,
                      }),
                      {
                        success: (data) => {
                          setViewState('preview');
                          return data.message;
                        },
                        error: errorResolver(),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.lecture'),
                        }),
                      }
                    );
                  }}
                />
              </Tabs.Panel>
              <Tabs.Panel value="links">
                <ExternalResourcesLinkForm
                  onCancel={() => {
                    if ((lecture?.resources?.length as number) > 0) {
                      setViewState('preview');
                      return;
                    }
                    setViewState('idle');
                  }}
                  onSave={(title, url) => {
                    toast.promise(
                      updateLecture(lecture?._id!, {
                        desc: lecture?.desc!,
                        preview: lecture?.preview || false,
                        resources: [
                          ...(lecture?.resources || []),
                          { title, link: url },
                        ],
                        title: lecture?.title,
                        videoId: lecture?.videoId as string,
                      }),
                      {
                        success: (data) => {
                          setViewState('preview');
                          return data.message;
                        },
                        error: errorResolver(),
                        loading: commonT('common.loading.update', {
                          feature: commonT('common.words.lecture'),
                        }),
                      }
                    );
                  }}
                />
              </Tabs.Panel>
            </Tabs>
          </Box>
        ),
      }) as Record<ViewStateType, ReactNode>,
    [lecture]
  );

  return <>{renderView[viewState]}</>;
}
