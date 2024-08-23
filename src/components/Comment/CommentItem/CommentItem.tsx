import { Comment } from "@ant-design/compatible";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Modal, Tag, Typography } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  deleteCommentApi,
  setCommentErrorAction,
  updateCommentApi,
} from "../../../redux/slices/comment_slices";
import { getTaskDetailApi } from "../../../redux/slices/task_slices";
import TinyMCEEditor from "../../TinyMCEEditor/TinyMCEEditor";
import parse from "html-react-parser";

export const CommentItem = ({ taskId, comment }) => {
  const { avatar, commentContent: contentComment, id, name } = comment;
  const dispatch = useDispatch();
  const { commentError } = useSelector((state) => state.commentReducer);
  const [showEditCommentInput, setShowEditCommentInput] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false);

  const formik = useFormik({
    initialValues: {
      id,
      contentComment,
    },
  });

  useEffect(() => {
    if (commentError === "403 Forbidden !") {
      Modal.warning({
        title: "Opps! Something went wrong",
        content: "You are not authorized",
        okText: "OK",
        zIndex: 1050,
        style: { top: 80 },
        maskClosable: true,
        afterClose: () => {
          dispatch(setCommentErrorAction(null));
        },
      });
    }
  }, [commentError, dispatch]);

  const actions = [
    <Button
      type="link"
      key="edit-comment"
      className="px-0 mr-2"
      onClick={() => setShowEditCommentInput(true)}
    >
      <Tag className="bg-info text-white">Edit</Tag>
    </Button>,
    <Button
      type="link"
      key="delete-comment"
      className="px-0"
      onClick={() => setShowDeleteCommentModal(true)}
    >
      <Tag className="bg-danger text-white">Delete</Tag>
    </Button>,
  ];

  const handleCancelEditComment = () => {
    formik.resetForm();
    setShowEditCommentInput(false);
  };

  const handleUpdateComment = () => {
    // hide input field and prevent submiting form when there is no change
    if (!formik.dirty) {
      setShowEditCommentInput(false);
      return;
    }

    // prevent update comment with blank
    if (!formik.values.contentComment.length) return;

    dispatch(
      updateCommentApi(formik.values, () => {
        dispatch(
          getTaskDetailApi(taskId, () => setShowEditCommentInput(false))
        );
      })
    );
  };

  const handleDeleteComment = () => {
    dispatch(deleteCommentApi(id, () => dispatch(getTaskDetailApi(taskId))));
  };
  return (
    <div>
      <Comment
        actions={!showEditCommentInput && actions}
        author={<Typography.Text strong>{name}</Typography.Text>}
        avatar={<Avatar src={avatar} alt={name} />}
        content={
          <>
            {!showEditCommentInput && (
              <div className="custom-html-parser">{parse(contentComment)}</div>
            )}

            {showEditCommentInput && (
              <Form onFinish={handleUpdateComment}>
                <Form.Item style={{ minHeight: 200 }}>
                  <TinyMCEEditor
                    name="contentComment"
                    value={formik.values.contentComment}
                    onEditorChange={(newValue) =>
                      formik.setFieldValue("contentComment", newValue)
                    }
                  />
                </Form.Item>

                <Form.Item className="mb-0">
                  <Button
                    htmlType="submit"
                    className="bg-primary text-white me-2"
                  >
                    Save
                  </Button>
                  <Button onClick={handleCancelEditComment}>Cancel</Button>
                </Form.Item>
              </Form>
            )}
          </>
        }
      />

      {/* onfirm delete comment modal */}
      <Modal
        open={showDeleteCommentModal}
        onCancel={() => setShowDeleteCommentModal(false)}
        footer={null}
        closable={false}
        width={400}
        style={{ top: 80 }}
      >
        <Typography.Title level={4}>
          <div className="d-flex align-items-center">
            <ExclamationCircleOutlined
              style={{ color: "#de350b", fill: "#ffffff" }}
              className="me-1"
            />
            <span> Delete this comment?</span>
          </div>
        </Typography.Title>

        <Typography.Text>Once you delete, it's gone for good.</Typography.Text>

        <Form className="mt-4" onFinish={handleDeleteComment}>
          <Form.Item className="mb-0 text-right">
            <Button htmlType="submit" className="bg-danger text-white me-2">
              Delete
            </Button>
            <Button onClick={() => setShowDeleteCommentModal(false)}>
              Cancel
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
export default CommentItem