'use client'

import React, { useRef, useMemo } from "react";
import dynamic from "next/dynamic";

const importJodit = () => import("jodit-react");

const JoditEditor = dynamic(importJodit, {
  ssr: false,
});

type Props = {
  content: string,
  setContent: React.Dispatch<React.SetStateAction<string>>,
  label?: string
}

const Jodit = ({ content, setContent, label }: Props) => {
  const editor = useRef(null);

  const config = useMemo(
    () => ({
      readonly: false,
      height: "500px",
      width: "100%",
      removeButtons: ["image", "file", "media"],
      toolbarAdaptive: true,
      toolbarSticky: true,
      style: {
        padding: '0 2rem',
      },
    }),
    []
  );

  return (
    <div>
      <label>{label}</label>
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        // onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
        onChange={(newContent) => setContent(newContent)}
      />
    </div>
  );
};
export default Jodit;
