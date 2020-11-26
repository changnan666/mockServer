import React, { useEffect, useRef } from "react";

type IProps = {
  value: string;
  onChange: (v: string) => void;
};

// @ts-ignore
let editor: any;
const App = ({ onChange, value }: IProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // @ts-ignore
    editor = monaco.editor.create(editorRef.current!, {
      value,
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
  }, [onChange, value]);

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (editor) {
        editor.layout();
      }
    });
  }, []);

  return <div className="editor" ref={editorRef} />;
};

export default App;
