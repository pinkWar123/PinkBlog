import { useCallback, useRef, useState } from "react";
import ReactQuill, { QuillOptions } from "react-quill";
import { uploadSingleFile } from "../../services/uploadApi";

export const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike", "blockquote", "link"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  ["emoji"],
  ["clean"],
];

export interface TextEditorProps {
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  theme?: string;
  placeholder?: string;
  toolbarOptions?: any;
}

const TextEditor: React.FC<TextEditorProps> = ({
  text,
  setText,
  theme = "snow",
  placeholder = "Write something...",
  toolbarOptions,
}) => {
  const reactQuillRef = useRef<ReactQuill>(null);
  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      if (input !== null && input.files !== null) {
        const file = input.files[0];
        // console.log(file);
        console.log(file.arrayBuffer);
        const res = await uploadSingleFile(file, "post", null);
        const quill = reactQuillRef.current;
        if (quill) {
          const range = quill.getEditorSelection();
          range &&
            quill
              .getEditor()
              .insertEmbed(range.index, "image", res?.data.data?.url);
        }
      }
    };
  }, []);
  console.log(text);
  return (
    <ReactQuill
      theme={theme}
      value={text}
      onChange={setText}
      ref={reactQuillRef}
      modules={{
        toolbar: {
          container: toolbarOptions
            ? toolbarOptions
            : [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike", "blockquote", "link"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                ["emoji"],
                ["clean"],
              ],
          handlers: { image: imageHandler },
        },
        "emoji-toolbar": true,
        "emoji-textarea": false,
        "emoji-shortname": true,
      }}
      placeholder={placeholder}
      style={{ marginTop: "30px", height: "60vh", maxWidth: "100%" }}
    />
  );
};

export default TextEditor;
