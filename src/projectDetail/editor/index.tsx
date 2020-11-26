import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

type IProps = {
  onChange: (v: string) => void;
};

// @ts-ignore
let editor: any;
export default forwardRef(({ onChange }: IProps, ref) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useImperativeHandle(
    ref,
    () => {
      return {
        setValue: (v: string) => {
          editor.setValue(v || "");
        },
      };
    },
    []
  );

  useEffect(() => {
    // @ts-ignore
    editor = monaco.editor.create(editorRef.current!, {
      value: "",
      fontSize: 14,
      tabSize: 2,
      theme: "vs-dark",
      language: "json",
    });

    editor.onDidChangeModelContent(() => {
      const v = editor.getValue();
      onChange(v);
    });

    return () => {
      // @ts-ignore
      editor.dispose();
      editor = null;
    };
  }, [onChange]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (editor) {
        editor.layout();
      }
    });
  }, []);

  return <div className="editor" ref={editorRef} />;
});
