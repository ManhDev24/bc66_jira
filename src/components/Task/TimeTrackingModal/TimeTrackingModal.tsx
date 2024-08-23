import { Button, Col, Form, Input, Modal, Row, Typography } from "antd";
import { useFormik } from "formik";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  getTaskDetailApi,
  updateTimeTrackingApi,
} from "../../../redux/slices/task_slices";
import { TimeTrackingIndicator } from "../TimeTrackingIndicator/TimeTrackingIndicator";

export const TimeTrackingModal = (props) => {
  const {
    visible,
    onCancel,
    taskId,
    originalEstimate,
    timeTrackingSpent,
    timeTrackingRemaining,
  } = props;
  const dispatch = useDispatch();
  const timeTrackingSpentRef = useRef(timeTrackingSpent);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      taskId,
      timeTrackingSpent: 0,
      timeTrackingRemaining,
    },
  });

  useEffect(() => {
    timeTrackingSpentRef.current = timeTrackingSpent;
  }, [timeTrackingSpent]);

  const handleSubmitTimeTracking = () => {
    const data = {
      taskId,
      timeTrackingSpent:
        timeTrackingSpentRef.current + +formik.values.timeTrackingSpent,
      timeTrackingRemaining: formik.values.timeTrackingRemaining,
    };

    if (!formik.dirty) {
      onCancel();
      return;
    }

    dispatch(
      updateTimeTrackingApi(data, () => {
        setTimeout(() => {
          dispatch(getTaskDetailApi(taskId));
          formik.resetForm();
          onCancel();
        }, 1000);
      })
    );
  };
  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      destroyOnClose={true}
      style={{ top: 80 }}
    >
      <Typography.Title level={4}>Time tracking</Typography.Title>

      <div className="mb-2">
        <TimeTrackingIndicator
          timeTrackingSpent={
            +timeTrackingSpentRef.current + +formik.values.timeTrackingSpent
          }
          timeTrackingRemaining={formik.values.timeTrackingRemaining}
          spentWidth={(
            ((+timeTrackingSpentRef.current +
              +formik.values.timeTrackingSpent) /
              originalEstimate) *
            100
          ).toFixed()}
          barHeight={8}
        />
      </div>

      <Typography.Text className="block mb-2">
        The original estimate for this issue was{" "}
        <span className="inline-block bg-gray-300 px-1 rounded mr-0.5">
          {originalEstimate}
        </span>
        m.
      </Typography.Text>

      <Form layout="vertical" onFinish={handleSubmitTimeTracking}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Time spent" colon={false}>
              <Input
                className="rounded"
                name="timeTrackingSpent"
                onChange={formik.handleChange}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Time remaining" colon={false}>
              <Input
                className="rounded"
                name="timeTrackingRemaining"
                value={formik.values.timeTrackingRemaining}
                onChange={formik.handleChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item className="mb-0 text-right">
          <Button htmlType="submit" className="bg-primary text-white me-2">
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};