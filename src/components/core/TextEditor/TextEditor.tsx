import { ActionIcon, Box, Flex, Text, TextProps } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { IconPhotoBolt } from '@tabler/icons-react';
import { Image } from '@tiptap/extension-image';
import { EditorEvents, generateHTML, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { FILE_TYPE_THUMBNAIL } from '~/helpers/constants';
import { getStaticContentUrl } from '~/helpers/utils';
import FileUploader from '../FileUploader';
type TextEditorProps = {
  label?: string;
  labelProps?: TextProps;
  description?: string;
  descriptionProps?: TextProps;
  error?: string;
  errorProps?: TextProps;
  value: string;
  onChange: (_html: string) => void;

  withTypography?: boolean;
  withHeading?: boolean;
  withImage?: boolean;
  withLink?: boolean;
  withList?: boolean;
};

export default function TextEditor({
  value,
  onChange,
  withHeading,
  withImage,
  withLink,
  withTypography,
  withList,
  labelProps,
  label,
  error,
  errorProps = { ta: 'left', c: 'red', size: 'xs' },
  description,
  descriptionProps = { c: 'dimmed', size: 'sm' },
}: TextEditorProps) {
  const extensions = [StarterKit, Link, Image.configure({ inline: true })];
  const editor = useEditor({
    extensions,
    onUpdate: ({ editor }) => {
      onChange(generateHTML(editor.getJSON(), extensions));
    },
    content: value,
  });

  const _onChange = (ev: EditorEvents['update']) => {
    onChange(generateHTML(ev.editor.getJSON(), extensions));
  };

  const onImagePlace = () => {
    modals.open({
      title: 'Upload Image',
      size: 'xl',
      children: (
        <FileUploader
          fileType={FILE_TYPE_THUMBNAIL}
          multiple={false}
          onDone={(file) => {
            editor?.commands.setImage({
              src: getStaticContentUrl(file[0]?.path),
            });
            modals.closeAll();
          }}
        />
      ),
    });
  };

  useEffect(() => {
    if (editor?.on) {
      editor?.on('update', _onChange);
    }

    return () => {
      editor?.off('update', _onChange);
    };
  }, [editor]);

  useEffect(() => {
    if (value && editor?.getHTML() !== value) {
      editor?.commands.setContent(value);
    }
  }, [value]);

  return (
    <Box>
      {label && <Text {...labelProps}>{label}</Text>}
      {description && <Text {...descriptionProps}>{description}</Text>}
      <RichTextEditor
        autoFocus
        style={{ borderColor: error && 'red' }}
        mt="0"
        editor={editor}
      >
        <RichTextEditor.Toolbar sticky stickyOffset={60}>
          {withTypography && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.ClearFormatting />
              <RichTextEditor.Code />
            </RichTextEditor.ControlsGroup>
          )}
          {withHeading && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>
          )}
          {withList && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>
          )}
          {withLink && (
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>
          )}
          {withImage && (
            <Flex align="center">
              <ActionIcon
                size="sm"
                variant="outline"
                color="gray"
                onClick={onImagePlace}
              >
                <IconPhotoBolt size="15" />
              </ActionIcon>
            </Flex>
          )}
        </RichTextEditor.Toolbar>

        <RichTextEditor.Content />
      </RichTextEditor>
      {error && <Text {...errorProps}>{error}</Text>}
    </Box>
  );
}
