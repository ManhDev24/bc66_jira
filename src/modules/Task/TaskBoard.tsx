import { BugOutlined, CheckOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Breadcrumb,
  Col,
  List,
  Modal,
  Row,
  Select,
  Tooltip,
  Typography,
} from "antd";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import AddMemberModal from "../../components/AddMemberModal/AddMemberModal";
import { EditTaskModal } from "../../components/Task/EditTaskModal/EditTaskModal";
import { TaskItem } from "../../components/Task/TaskItem/TaskItem";
import { TaskListTitle } from "../../components/Task/TaskListTitle/TaskListTitle";
import {
  getProjectDetailApi,
  setProjectDetailNullAction,
} from "../../redux/slices/project_slices";
import {
  createTaskApi,
  getAllTaskTypesApi,
  setTaskErrorAction,
  updateTaskStatusApi,
} from "../../redux/slices/task_slices";

import "./index.scss";
import Navbar from "../../layout/Home/Navbar";
import { getAllUserApi } from "../../redux/slices/user_slice";
import axios from "axios";
import { BASE_URL } from "../../constant/urlConfig";
import fetcher from "../../apis/fetcher";
import { ProjectData } from "../../interface/projectListInter";


const ProjectManagement: React.FC = () => {
  const params = useParams();
  const projectId = parseInt(params.id);
  const dispatch = useDispatch();
  const { projectDetail, projectError, projectMembers } = useSelector(
    (state) => state.projectReducer
  );

  const { userList } = useSelector((state) => state.userReducer);
  const { taskTypes, taskError } = useSelector((state) => state.taskReducer);
  const [clonedProjectDetail, setClonedProjectDetail] = useState(null);
  const [showNewTaskTextarea, setShowNewTaskTextarea] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showChatMemberModal, setShowChatModalMember] = useState(false);
  const newTaskRef = useRef(null);

  const formik = useFormik({
    initialValues: {
      listUserAsign: [],
      taskName: "",
      description: "",
      statusId: "1",
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: projectId,
      typeId: 1,
      priorityId: 2,
    },
  });

  useEffect(() => {
    dispatch(getProjectDetailApi(projectId));
    dispatch(getAllTaskTypesApi());
    return () => {
      dispatch(setProjectDetailNullAction(null));
      dispatch(setTaskErrorAction(null));
    };
  }, [dispatch, projectId]);

  useEffect(() => {
    setClonedProjectDetail({ ...projectDetail });
  }, [projectDetail]);

  useEffect(() => {
    if (taskError === "Task already exists!") {
      formik.setErrors({
        taskName: taskError,
        ...formik.errors,
      });
    }

    if (taskError === "User is unthorization!") {
      Modal.warning({
        title: taskError,
        content: "You are not the owner of this project",
        okText: "OK",
        zIndex: 1050,
        style: { top: 80 },
        maskClosable: true,
        afterClose: () => {
          dispatch(setTaskErrorAction(null));
          formik.resetForm();
        },
      });
    }
    // eslint-disable-next-line
  }, [taskError]);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    const clonedProject = { ...projectDetail };

    if (!destination) {
      return;
    }

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const draggedItem = {
      ...clonedProject.lstTask[source.droppableId - 1].lstTaskDeTail[
        source.index
      ],
    };

    setClonedProjectDetail(clonedProject);

    dispatch(
      updateTaskStatusApi(
        {
          taskId: draggableId,
          statusId: destination.droppableId,
        },
        () => dispatch(getProjectDetailApi(projectId))
      )
    );
  };

  const handleKeyDownOnNewTaskTextarea = (e) => {
    // keyCode = 27 <=> press ESC button
    if (e.keyCode === 27) {
      setShowNewTaskTextarea(false);
    }

    // keyCode = 13 <=> press ENTER button
    if (e.keyCode === 13) {
      e.preventDefault();

      if (!formik.values.taskName.trim().length) {
        return;
      }

      dispatch(
        createTaskApi(formik.values, () => {
          formik.resetForm();
          dispatch(getProjectDetailApi(projectId));
        })
      );
    }
  };

  const handleBlurNewTaskTextarea = () => {
    setShowNewTaskTextarea(false);
  };

  const handleTaskTypeClick = () => {
    setShowNewTaskTextarea(true);
  };

  const handleTaskTypeDropdownVisibleChange = (open) => {
    if (!open) {
      newTaskRef.current.focus();
    }
  };

  const handleClickTaskItem = (taskItem) => () => {
    setSelectedTask(taskItem);
    setShowEditTaskModal(true);
  };

  const handleCancelEditTask = () => {
    setSelectedTask(null);
    setShowEditTaskModal(false);
  };

  const handleCancelUpdateMembers = () => {
    setShowAddMembersModal(false);
  };

  const handleFetchProject = () => {
    dispatch(getProjectDetailApi(projectId));
  };

  const openModal = () => {
    setShowAddMembersModal(true);
  };

  const closeModal = () => {
    setShowAddMembersModal(false);
  };
  useEffect(() => {}, [showAddMembersModal]);

  const handleCancelChatMemberModal = () => {
    setShowChatModalMember(false);
  };
  const openModalChat = () => {
    setShowChatModalMember(true);
  };
  const closeModalChat = () => {
    setShowChatModalMember(false);
  };
  return (
    <div className="p-3 container ">
      <Navbar></Navbar>
      <div className="pt-10">
        <Breadcrumb className="mb-4">
          <Breadcrumb.Item>
            <Link to="/projects">Projects</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{clonedProjectDetail?.projectName}</Breadcrumb.Item>
        </Breadcrumb>
        <div className="flex">
          <div className="w-1/4">
            <h3 className="typography">Board</h3>
          </div>
          <div className="w-3/4">
            <span className="ant-avatar ant-avatar-circle ant-avatar-image mr-1">
              {!!projectDetail?.members.length && (
                <Typography.Text strong className="mr-4">
                  Members{" "}
                </Typography.Text>
              )}
              {projectDetail?.members.map((member) => {
                return (
                  <Tooltip
                    key={member.userId}
                    title={member.name}
                    placement="top"
                  >
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      className="mr-1"
                    />
                  </Tooltip>
                );
              })}
            </span>
            <button
              type="button"
              className="ant-btn ant-btn-circle_plus ant-btn_plus ant-btn-icon-only hover:border-blue-600 focus:border-blue-600 hover:text-blue-600 focus:text-blue-600"
              ant-click-animating-without-extra-node="false"
              onClick={openModal}
            >
              <span
                role="img"
                aria-label="plus"
                className="anticon anticon-plus translate-plus"
              >
                <svg
                  viewBox="64 64 896 896"
                  focusable="false"
                  data-icon="plus"
                  width="1em"
                  height="1em"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <defs>
                    <style dangerouslySetInnerHTML={{ __html: "" }} />
                  </defs>
                  <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z" />
                  <path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z" />
                </svg>
              </span>
            </button>
            
          </div>
        </div>

        <Row gutter={16}>
          <DragDropContext onDragEnd={handleDragEnd}>
            {clonedProjectDetail?.lstTask?.map((listTaskItem) => {
              return (
                <Col
                  xs={{ span: 24 }}
                  sm={{ span: 12 }}
                  lg={{ span: 6 }}
                  key={listTaskItem.statusId}
                  className="mb-4"
                >
                  <div
                    style={{
                      backgroundColor: "#f4f5f7",
                      padding: "8px",
                      borderRadius: "6px",
                    }}
                  >
                    <div style={{ visibility: "hidden" }}>AAAAAA</div>
                    <TaskListTitle title={listTaskItem.statusName} />
                    <hr />
                    <Droppable droppableId={listTaskItem.statusId}>
                      {(provided) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {listTaskItem.lstTaskDeTail.map(
                              (listTaskDetailItem, index) => {
                                return (
                                  <TaskItem
                                    key={listTaskDetailItem.taskId}
                                    listTaskDetailItem={listTaskDetailItem}
                                    index={index}
                                    onClick={handleClickTaskItem(
                                      listTaskDetailItem
                                    )}
                                  />
                                );
                              }
                            )}

                            {provided.placeholder}

                            {listTaskItem.statusName === "BACKLOG" && (
                              <div>
                                {!showNewTaskTextarea && (
                                  <button
                                    onClick={() => setShowNewTaskTextarea(true)}
                                    className="btn btn-primary d-flex align-items-center mt-2"
                                  >
                                    <PlusOutlined className="mr-1" />
                                    <span className="ms-2">Create</span>
                                  </button>
                                )}
                                {showNewTaskTextarea && (
                                  <>
                                    <div
                                      className={`bg-white border-2 mt-1 rounded${
                                        formik.errors.taskName
                                          ? " border-red-500 focus:border-red-500"
                                          : " border-blue-400 focus:border-blue-400"
                                      }`}
                                    >
                                      <textarea
                                        rows="2"
                                        maxLength="255"
                                        placeholder="What needs to be done?"
                                        className="w-full pt-2 px-2 outline-none resize-none"
                                        onKeyDown={
                                          handleKeyDownOnNewTaskTextarea
                                        }
                                        autoFocus
                                        name="taskName"
                                        value={formik.values.taskName}
                                        onChange={formik.handleChange}
                                        onBlur={handleBlurNewTaskTextarea}
                                        ref={newTaskRef}
                                      ></textarea>

                                      <Select
                                        name="typeId"
                                        value={formik.values.typeId}
                                        onChange={(value) =>
                                          formik.setFieldValue("typeId", value)
                                        }
                                        onClick={handleTaskTypeClick}
                                        onDropdownVisibleChange={
                                          handleTaskTypeDropdownVisibleChange
                                        }
                                        defaultValue={1}
                                        bordered={false}
                                        className="mb-1"
                                        optionLabelProp="label"
                                        dropdownMatchSelectWidth={false}
                                        style={{ marginTop: "-8px" }}
                                      >
                                        {taskTypes.map((type) => {
                                          return (
                                            <Select.Option
                                              key={type.id}
                                              value={type.id}
                                              label={
                                                <div className="h-full flex items-center">
                                                  <Tooltip
                                                    title={
                                                      type.taskType
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                      type.taskType.slice(1)
                                                    }
                                                    placement="bottom"
                                                  >
                                                    {type.id === 1 && (
                                                      <BugOutlined
                                                        style={{
                                                          color: "red",
                                                        }}
                                                      />
                                                    )}
                                                    {type.id === 2 && (
                                                      <CheckOutlined
                                                        style={{
                                                          color: "#4b92ff",
                                                        }}
                                                      />
                                                    )}
                                                  </Tooltip>
                                                </div>
                                              }
                                            >
                                              <div className="flex justify-start items-center">
                                                {type.id === 1 && (
                                                  <BugOutlined
                                                    style={{ color: "red" }}
                                                    className="me-2"
                                                  />
                                                )}
                                                {type.id === 2 && (
                                                  <CheckOutlined
                                                    style={{ color: "#4b92ff" }}
                                                    className="me-2"
                                                  />
                                                )}
                                                <span>
                                                  {type.taskType
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    type.taskType.slice(1)}
                                                </span>
                                              </div>
                                            </Select.Option>
                                          );
                                        })}
                                      </Select>
                                    </div>
                                    {formik.errors.taskName && (
                                      <div className="text-red-500">
                                        {formik.errors.taskName}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      }}
                    </Droppable>
                  </div>
                </Col>
              );
            })}
          </DragDropContext>
        </Row>

        {selectedTask && (
          <EditTaskModal
            visible={showEditTaskModal}
            onCancel={handleCancelEditTask}
            task={selectedTask}
          />
        )}

        {projectDetail && (
          <AddMemberModal
            visible={showAddMembersModal}
            onCancel={handleCancelUpdateMembers}
            project={projectDetail}
            onFetchProject={handleFetchProject}
            showFooter={false}
          />
        )}

        
      </div>
    </div>
  );
};

export default ProjectManagement;
