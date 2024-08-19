import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { Skeleton } from "antd";

const TinyMCEEditor = ({ name, value, onEditorChange }) => {
  const [isInitializing, setIsInitializing] = useState(true);

  const handleOnInit = () => {
    setIsInitializing(false);
  };

  return (
    <>
      {isInitializing && (
        <div className="absolute top-0 left-0 w-full h-full">
          <Skeleton active paragraph={{ rows: 5 }} />
        </div>
      )}
      <Editor
        apiKey="h3j54i7u548oxjwek3y2g3rqib7ddfux5grwecbjcwk5w46h"
        init={{
          height: 200,
          menubar: false,
          plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table paste code help wordcount",
          ],
          toolbar:
            "formatselect | " +
            "bold italic underline forecolor strikethrough superscript subscript | alignleft aligncenter | " +
            "link | " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style:
            "body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue'; font-size:14px }",
        }}
        name={name}
        value={value}
        onEditorChange={onEditorChange}
        onInit={handleOnInit}
      />
    </>
  );
};

export default TinyMCEEditor;