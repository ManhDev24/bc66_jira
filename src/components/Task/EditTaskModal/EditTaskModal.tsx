import { BugOutlined, CaretDownOutlined, CheckOutlined, CloseOutlined, DeleteOutlined, DownOutlined, ExclamationCircleOutlined, MinusOutlined, UpOutlined } from '@ant-design/icons'
import { Avatar, Button, Col, Collapse, Form, Input, Modal, Row, Select, Tag, Tooltip, Typography } from 'antd'
import { useFormik } from 'formik'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getProjectDetailApi } from '../../../redux/slices/project_slices'
import {
  getAllTaskTypesApi,
  getTaskDetailApi,
  removeTaskApi,
  setTaskErrorAction,
  updateDescriptionApi,
  updateEstimateApi,
  updatePriorityApi,
  updateTaskApi,
  updateTaskStatusApi,
} from '../../../redux/slices/task_slices'
import CommentItem from '../../Comment/CommentItem/CommentItem'
import NewComment from '../../Comment/NewComment/NewComment'
import TinyMCEEditor from '../../TinyMCEEditor/TinyMCEEditor'
import parse from 'html-react-parser'
import { TimeTrackingModal } from '../TimeTrackingModal/TimeTrackingModal'
import { TimeTrackingIndicator } from '../TimeTrackingIndicator/TimeTrackingIndicator'

export const EditTaskModal = (props) => {
  const { projectId, taskId } = props.task
  const dispatch = useDispatch()
  const { projectDetail } = useSelector((state) => state.projectReducer)
  const { taskTypes, taskError, taskDetail } = useSelector((state) => state.taskReducer)
  const prevValues = useRef(null)
  const taskNameInputRef = useRef(null)
  const estimateInputRef = useRef(null)
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false)
  const [showTaskNameInput, setShowTaskNameInput] = useState(false)
  const [showDescription, setShowDescription] = useState(false)
  const [showEstimateInput, setShowEstimateInput] = useState(false)
  const [showTimeTrackingModal, setShowTimeTrackingModal] = useState(false)

  const formik = useFormik({
    initialValues: {
      taskName: '',
      listUserAsign: [],
      originalEstimate: 0,
    },
  })

  useEffect(() => {
    dispatch(getAllTaskTypesApi())
  }, [dispatch])

  useEffect(() => {
    dispatch(getTaskDetailApi(taskId))
  }, [dispatch, taskId])

  useEffect(() => {
    if (taskError === 'user is not assign!') {
      Modal.warning({
        title: 'Opps! Something went wrong',
        content: 'You are not an assignee',
        okText: 'OK',
        zIndex: 1050,
        style: { top: 80 },
        maskClosable: true,
        afterClose: () => {
          dispatch(setTaskErrorAction(null))
        },
      })
    }
  }, [taskError, dispatch])

  useEffect(() => {
    formik.setValues({
      ...taskDetail,
      listUserAsign: taskDetail ? [...taskDetail.assigness.map((assignee) => assignee.id)] : [],
    })
    // eslint-disable-next-line
  }, [taskDetail])

  const handleChangeType = (value) => {
    formik.setFieldValue('typeId', value)

    const data = {
      ...formik.values,
      typeId: value,
    }

    dispatch(
      updateTaskApi(data, () => {
        // update Edit task modal
        dispatch(getTaskDetailApi(taskId))

        // update Manage tasks page
        dispatch(getProjectDetailApi(projectId))
      })
    )
  }

  const handleDeleteTask = () => {
    dispatch(
      removeTaskApi(taskId, () =>
        dispatch(
          getProjectDetailApi(projectId, () => {
            setShowDeleteTaskModal(false)
            props.onCancel()
          })
        )
      )
    )
  }

  const handleClickTaskNameLabel = async () => {
    prevValues.current = { ...formik.values }

    // use async / await to show input field before focusing
    await setShowTaskNameInput(true)
    await taskNameInputRef.current.focus()
  }

  const handleKeyDownTaskNameInput = (e) => {
    // ESC button
    if (e.keyCode === 27) {
      handleCancelEditTaskName()
      setShowTaskNameInput(false)
    }

    // Enter button
    if (e.keyCode === 13) {
      // prevent breakline
      e.preventDefault()
      handleSubmitTaskName()
    }
  }

  const handleCancelEditTaskName = () => {
    formik.setFieldValue('taskName', prevValues.current.taskName)
    setShowTaskNameInput(false)
  }

  const handleSubmitTaskName = () => {
    setShowTaskNameInput(false)

    // check if taskName no changed
    if (formik.values.taskName === prevValues.current.taskName) {
      return
    }

    // call api here

    const updatedData = {
      listUserAsign: formik.values.listUserAsign,
      taskId: formik.values.taskId,
      taskName: formik.values.taskName,
      description: formik.values.description,
      statusId: formik.values.statusId,
      originalEstimate: formik.values.originalEstimate,
      timeTrackingSpent: formik.values.timeTrackingSpent,
      timeTrackingRemaining: formik.values.timeTrackingRemaining,
      projectId: formik.values.projectId,
      typeId: formik.values.typeId,
      priorityId: formik.values.priorityId,
    }
    dispatch(
      updateTaskApi(updatedData, () => {
        // update Edit task modal
        dispatch(getTaskDetailApi(taskId))

        // update Manage tasks page
        dispatch(getProjectDetailApi(projectId))
      })
    )
    // replacement for api calling action (lỗi backend: không update được taskName)
    // Modal.warning({
    //   title: "Opps! This feature is under construction",
    //   content: "We're sorry for this inconvenience",
    //   okText: "OK",
    //   zIndex: 1050,
    //   style: { top: 80 },
    //   onOk: () => {
    //     formik.setFieldValue("taskName", prevValues.current.taskName);
    //   },
    // });
  }

  const handleClickDescriptionLabel = () => {
    prevValues.current = { ...formik.values }
    setShowDescription(true)
  }

  const handleCancelEditDescription = () => {
    formik.setFieldValue('description', prevValues.current.description)
    setShowDescription(false)
  }

  const handleSubmitDescription = async () => {
    // check if description no changed
    if (formik.values.description === prevValues.current.description) {
      return
    }

    const data = {
      taskId,
      description: formik.values.description,
    }

    dispatch(
      updateDescriptionApi(data, () => {
        dispatch(getTaskDetailApi(taskId))
        setShowDescription(false)
      })
    )
  }

  const handleChangePriorityId = (value) => {
    const data = {
      taskId,
      priorityId: value,
    }

    dispatch(
      updatePriorityApi(data, () => {
        // update Edit task modal
        dispatch(getTaskDetailApi(taskId))

        // update Manage tasks page
        dispatch(getProjectDetailApi(projectId))
      })
    )
  }

  const handleChangeAssignees = (value) => {
    const data = {
      ...formik.values,
      listUserAsign: value,
    }

    dispatch(
      updateTaskApi(data, () => {
        // update Edit task modal
        dispatch(getTaskDetailApi(taskId))

        // update Manage tasks page
        dispatch(getProjectDetailApi(projectId))
      })
    )
  }

  const handleChangeStatus = (value) => {
    // reflect selected item in UI
    formik.setFieldValue('statusId', value.toString())

    const data = {
      taskId,
      statusId: value.toString(),
    }

    dispatch(
      updateTaskStatusApi(data, () => {
        // update Edit task modal
        dispatch(getTaskDetailApi(taskId))

        // update Manage tasks page
        dispatch(getProjectDetailApi(projectId))
      })
    )
  }

  const handleClickEstimateValue = async () => {
    prevValues.current = { ...formik.values }
    await setShowEstimateInput(true)
    await estimateInputRef.current.focus()
  }

  const handleCancelEditEstimate = () => {
    formik.setFieldValue('originalEstimate', prevValues.current.originalEstimate)
    setShowEstimateInput(false)
  }

  const handleKeyDownEstimateValue = (e) => {
    // ESC button
    if (e.keyCode === 27) {
      handleCancelEditEstimate()
    }
  }

  const handleSubmitEstimate = () => {
    const data = {
      taskId,
      originalEstimate: formik.values.originalEstimate,
    }

    dispatch(
      updateEstimateApi(data, () => {
        // update Edit task modal
        dispatch(getTaskDetailApi(taskId))
        setShowEstimateInput(false)
      })
    )
  }

  const handleCancelEditTimeTracking = () => {
    setShowTimeTrackingModal(false)
  }

  return (
    <>
      <Modal open={props.visible} onCancel={props.onCancel} width={980} maskClosable={false} closable={false} footer={null} keyboard={false}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <Select name="typeId" value={formik.values.typeId} onChange={handleChangeType} bordered={false} showArrow={false} dropdownMatchSelectWidth={false} style={{ marginLeft: '-8px' }}>
              {taskTypes.map((type) => {
                return (
                  <Select.Option
                    key={type.id}
                    value={type.id}
                    label={
                      <div className="d-flex align-items-center">
                        <Tooltip title={type.taskType.charAt(0).toUpperCase() + type.taskType.slice(1)} placement="bottom">
                          {type.id === 1 && (
                            <BugOutlined
                              style={{
                                color: 'red',
                              }}
                            />
                          )}
                          {type.id === 2 && (
                            <CheckOutlined
                              style={{
                                color: '#4b92ff',
                              }}
                            />
                          )}
                        </Tooltip>
                      </div>
                    }
                  >
                    <div
                      className="d-flex justify-content-start align-items-center"
                      style={{
                        background: '#e5e7eb',
                        padding: '0 10px',
                        borderRadius: '6px',
                      }}
                    >
                      {type.id === 1 && (
                        <BugOutlined
                          style={{
                            color: 'red',
                          }}
                          className="me-2"
                        />
                      )}
                      {type.id === 2 && (
                        <CheckOutlined
                          style={{
                            color: '#4b92ff',
                          }}
                          className="me-2"
                        />
                      )}
                      <span>{type.taskType.charAt(0).toUpperCase() + type.taskType.slice(1)}</span>
                    </div>
                  </Select.Option>
                )
              })}
            </Select>
          </div>

          <div>
            <Button htmlType="button" icon={<DeleteOutlined />} className="border-0 p-0 shadow-none hover:shadow rounded" onClick={() => setShowDeleteTaskModal(true)} />
            <Button htmlType="button" icon={<CloseOutlined />} className="border-0 p-0 shadow-none hover:shadow rounded" onClick={props.onCancel} />
          </div>
        </div>

        <Row gutter={32} className="mt-3">
          <Col xs={24} md={14} className="overflow-x-hidden overscroll-y-auto mb-4 md:mb-0" style={{ maxHeight: '60vh' }}>
            <div className="task-name-container relative">
              <Typography.Title
                level={4}
                className={`p-1 rounded hover:bg-gray-200 duration-300 border border-transparent hover:border-gray-200${!showTaskNameInput ? ' d-block' : ' d-none'}`}
                onClick={handleClickTaskNameLabel}
              >
                {formik.values.taskName}
              </Typography.Title>
              <Form className={showTaskNameInput ? 'd-block' : 'd-none'} onFinish={handleSubmitTaskName}>
                <Form.Item>
                  <Input.TextArea
                    ref={taskNameInputRef}
                    name="taskName"
                    value={formik.values.taskName}
                    onChange={formik.handleChange}
                    onKeyDown={handleKeyDownTaskNameInput}
                    className="text-xl font-semibold p-1 rounded resize-none"
                    style={{ lineHeight: 1.4 }}
                  />
                </Form.Item>

                <div
                  className={`absolute bottom-0 right-0 pt-1${showTaskNameInput ? ' d-block' : ' d-none'}`}
                  style={{
                    transform: 'translateX(88%)',
                  }}
                >
                  <Button
                    htmlType="submit"
                    icon={<CheckOutlined className="text-xs" />}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 hover:text-black focus:text-black border-0 shadow mr-1 p-0"
                  />
                  <Button
                    htmlType="button"
                    icon={<CloseOutlined className="text-xs" />}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 hover:text-black focus:text-black border-0 shadow p-0"
                    onClick={handleCancelEditTaskName}
                  />
                </div>
              </Form>
            </div>

            <div className="description-container mb-6">
              <Typography.Text strong className="pl-1">
                Description
              </Typography.Text>

              {!showDescription && (
                <div className="p-1 hover:bg-gray-200 duration-300 rounded custom-html-parser" onClick={handleClickDescriptionLabel}>
                  {formik.values.description === '' && <Typography.Text type="secondary">Add a description...</Typography.Text>}
                  {formik.values.description && parse(formik.values.description)}
                </div>
              )}

              {showDescription && (
                <Form className="pl-1">
                  <Form.Item style={{ minHeight: 200 }}>
                    <TinyMCEEditor name="description" value={formik.values.description} onEditorChange={(newValue) => formik.setFieldValue('description', newValue)} />
                  </Form.Item>

                  <Form.Item>
                    <Button className="bg-primary text-white me-2" onClick={handleSubmitDescription}>
                      Save
                    </Button>
                    <Button
                      className="hover:bg-gray-200 text-gray-700 hover:text-gray-700 font-semibold border-transparent hover:border-gray-200 rounded shadow-none"
                      onClick={handleCancelEditDescription}
                    >
                      Cancel
                    </Button>
                  </Form.Item>
                </Form>
              )}
            </div>

            <div className="activities ml-1">
              <Typography.Text strong>Comments</Typography.Text>

              <NewComment taskId={taskId} />

              <div className="comment-list">
                {taskDetail?.lstComment
                  .map((comment) => {
                    return <CommentItem key={comment.id} taskId={taskId} comment={comment} />
                  })
                  .reverse()}
              </div>
            </div>
          </Col>

          <Col xs={24} md={10}>
            <Form>
              <Form.Item className="mb-2 w-min">
                <Select
                  value={formik.values.statusId}
                  dropdownMatchSelectWidth={false}
                  bordered={false}
                  optionLabelProp="label"
                  onChange={handleChangeStatus}
                  className="bg-gray-200 hover:bg-gray-300 rounded"
                >
                  <Select.Option value="1" label="Back Log">
                    BACKLOG
                  </Select.Option>
                  <Select.Option value="2" label="Selected For Development">
                    SELECTED FOR DEVELOPMENT
                  </Select.Option>
                  <Select.Option value="3" label="In Progress">
                    IN PROGRESS
                  </Select.Option>
                  <Select.Option value="4" label="Done">
                    DONE
                  </Select.Option>
                </Select>
              </Form.Item>
            </Form>

            <Collapse defaultActiveKey={['1']} expandIconPosition="right" className="mb-2">
              <Collapse.Panel header={<Typography.Text strong>Details</Typography.Text>} key="1">
                <Form layout="horizontal">
                  <Form.Item label={<Typography.Text strong>Assignees</Typography.Text>} colon={false} labelCol={{ span: 8 }} labelAlign="left">
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="Choose assignees..."
                      value={formik.values.listUserAsign}
                      onChange={handleChangeAssignees}
                      bordered={false}
                      className="hover:bg-gray-200 rounded"
                      tagRender={(props) => {
                        const onPreventMouseDown = (event) => {
                          event.preventDefault()
                          event.stopPropagation()
                        }

                        return (
                          <Tag closable onMouseDown={onPreventMouseDown} onClose={props.onClose} className="flex items-center py-1 my-0.5 rounded">
                            {props.label}
                          </Tag>
                        )
                      }}
                    >
                      {projectDetail.members.map((member) => {
                        return (
                          <Select.Option key={member.userId} value={member.userId}>
                            <div className="flex justify-start items-center">
                              <Avatar size="small" className="mr-1" src={member.avatar} />
                              <Typography.Text>{member.name}</Typography.Text>
                            </div>
                          </Select.Option>
                        )
                      })}
                    </Select>
                  </Form.Item>
                </Form>
                <Form layout="horizontal">
                  <Form.Item label={<Typography.Text strong>Priority</Typography.Text>} colon={false} labelCol={{ span: 8 }} labelAlign="left">
                    <Select
                      name="priorityId"
                      value={formik.values.priorityId}
                      onChange={handleChangePriorityId}
                      showArrow={false}
                      bordered={false}
                      style={{
                        backgroundColor: '#e5e7eb',
                        borderRadius: '8px',
                      }}
                    >
                      <Select.Option value={1}>
                        <div className="d-flex justify-content-start align-items-center">
                          <UpOutlined className="text-danger me-2" />
                          <span>High</span>
                        </div>
                      </Select.Option>
                      <Select.Option value={2}>
                        <div className="d-flex justify-content-start align-items-center">
                          <MinusOutlined className="text-warning me-2" />
                          <span>Medium</span>
                        </div>
                      </Select.Option>
                      <Select.Option value={3}>
                        <div className="d-flex justify-content-start align-items-center">
                          <DownOutlined className="text-info me-2" />
                          <span>Low</span>
                        </div>
                      </Select.Option>
                      <Select.Option value={4}>
                        <div className="d-flex justify-content-start align-items-center">
                          <CaretDownOutlined className="text-secondary me-2" />
                          <span>Lowest</span>
                        </div>
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Form>

                <Form layout="horizontal" onFinish={handleSubmitEstimate}>
                  <Form.Item label={<Typography.Text strong>Estimate</Typography.Text>} colon={false} labelCol={{ span: 8 }} labelAlign="left" className="relative">
                    <div
                      className={`${!showEstimateInput ? 'd-block' : 'd-none'} p-1 rounded hover:bg-gray-200 duration-300 border border-transparent hover:border-gray-200`}
                      onClick={handleClickEstimateValue}
                    >
                      <Typography.Text className="bg-gray-300 px-1 rounded">{formik.values.originalEstimate}m</Typography.Text>
                    </div>
                    <Input
                      name="originalEstimate"
                      value={formik.values.originalEstimate}
                      onChange={formik.handleChange}
                      onKeyDown={handleKeyDownEstimateValue}
                      className={`${showEstimateInput ? 'd-block' : 'd-none'} rounded px-2`}
                      ref={estimateInputRef}
                    />
                    <div className={`absolute bottom-0 right-0 pt-1${showEstimateInput ? ' d-block' : ' d-none'}`} style={{ transform: 'translateX(70%)', zIndex: 1 }}>
                      <Button
                        htmlType="submit"
                        icon={<CheckOutlined className="text-xs" />}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 hover:text-black focus:text-black border-0 shadow mr-1 p-0"
                      />
                      <Button
                        htmlType="button"
                        icon={<CloseOutlined className="text-xs" />}
                        className="w-8 h-8 bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 hover:text-black focus:text-black border-0 shadow p-0"
                        onClick={handleCancelEditEstimate}
                      />
                    </div>
                  </Form.Item>
                </Form>

                <Row>
                  <Col span={8}>
                    <Typography.Text strong>Time tracking</Typography.Text>
                  </Col>
                  <Col span={16} className="p-1 rounded hover:bg-gray-200 duration-300 border border-transparent hover:border-gray-200" onClick={() => setShowTimeTrackingModal(true)}>
                    <TimeTrackingIndicator
                      timeTrackingSpent={taskDetail?.timeTrackingSpent}
                      timeTrackingRemaining={taskDetail?.timeTrackingRemaining}
                      spentWidth={((taskDetail?.timeTrackingSpent / taskDetail?.originalEstimate) * 100).toFixed()}
                    />
                  </Col>
                </Row>
              </Collapse.Panel>
            </Collapse>
          </Col>
        </Row>
      </Modal>

      <Modal open={showDeleteTaskModal} onCancel={() => setShowDeleteTaskModal(false)} footer={null} closable={false} width={400} style={{ top: 80 }}>
        <Typography.Title level={4}>
          <div className="d-flex align-items-center">
            <ExclamationCircleOutlined style={{ color: '#de350b', fill: '#ffffff' }} className="me-1" />
            <span> Delete this task?</span>
          </div>
        </Typography.Title>

        <Typography.Text>You're about to permanently delete this issue, its comments and attachments, and all of its data.</Typography.Text>
        <Typography.Text>If you're not sure, you can resolve or close this issue instead.</Typography.Text>

        <Form className="mt-4" onFinish={handleDeleteTask}>
          <Form.Item className="mb-0 text-right">
            <Button htmlType="submit" className="text-white bg-danger me-2">
              Delete
            </Button>
            <Button onClick={() => setShowDeleteTaskModal(false)}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {taskDetail && (
        <TimeTrackingModal
          visible={showTimeTrackingModal}
          onCancel={handleCancelEditTimeTracking}
          taskId={taskDetail.taskId}
          originalEstimate={taskDetail.originalEstimate}
          timeTrackingSpent={taskDetail.timeTrackingSpent}
          timeTrackingRemaining={taskDetail.timeTrackingRemaining}
        />
      )}
    </>
  )
}
