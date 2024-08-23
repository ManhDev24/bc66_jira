import React, { useState } from "react";
import { Comment } from "@ant-design/compatible";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import { insertCommentApi } from "../../../redux/slices/comment_slices";
import { getTaskDetailApi } from "../../../redux/slices/task_slices";
import { Avatar, Button, Form } from "antd";
import TinyMCEEditor from "../../TinyMCEEditor/TinyMCEEditor";
export const NewComment = ({ taskId }) => {
  const dispatch = useDispatch();
  const { userLogin } = useSelector((state) => state.userReducer);
  const [showNewCommentInput, setShowNewCommentInput] = useState(false);

  const formik = useFormik({
    initialValues: {
      taskId,
      contentComment: "",
    },
  });

  const handleSubmit = () => {
    if (!formik.dirty) return;

    dispatch(
      insertCommentApi(formik.values, () => {
        setTimeout(() => {
          formik.resetForm();
          dispatch(getTaskDetailApi(taskId));
          setShowNewCommentInput(false);
        }, 400);
      })
    );
  };
  return (
    <Comment
      avatar={<Avatar src={userLogin?.avatar} alt={userLogin?.name} />}
      content={
        <>
          {!showNewCommentInput && (
            <div
              className="p-2 border hover:border-gray-300 duration-300 rounded cursor-text"
              onClick={() => setShowNewCommentInput(true)}
            >
              Add a comment...
            </div>
          )}

          {showNewCommentInput && (
            <Form onFinish={handleSubmit}>
              <Form.Item style={{ minHeight: 200 }}>
                <TinyMCEEditor
                  name="contentComment"
                  value={formik.values.contentComment}
                  onEditorChange={(newValue) =>
                    formik.setFieldValue("contentComment", newValue)
                  }
                />
              </Form.Item>

              <Form.Item>
                <Button
                  htmlType="submit"
                  className="bg-primary text-white me-2"
                >
                  Save
                </Button>
                <Button
                  className="hover:bg-gray-200 text-gray-700 hover:text-gray-700 font-semibold border-transparent hover:border-gray-200 rounded shadow-none"
                  onClick={() => setShowNewCommentInput(false)}
                >
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )}
        </>
      }
    />
  );
};

export default NewComment