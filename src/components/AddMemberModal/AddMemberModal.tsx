import {
  Avatar,
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Row,
  Typography,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../../main";
import {
  assignUserToProjectApi,
  getUsersByProjectIdApi,
  removeUserFromProjectApi,
  setProjectErrorNullAction,
} from "../../redux/slices/project_slices";
import { getAllUserApi } from "../../redux/slices/user_slice";


const AddMemberModal = (props) => {
  const { showFooter = true } = props;
  //const [projectId, setProjectId] = useState(props.project.id);
  const projectIdValueMemo = props.project.id;
  const projectId = useMemo(() => projectIdValueMemo, [projectIdValueMemo]);

  const dispatch = useDispatch();
  const { projectMembers, projectError } = useSelector(
    (state) => state.projectReducer
  );
  const { userList } = useSelector((state) => state.userReducer);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const usersRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    dispatch(getUsersByProjectIdApi(projectId));
    dispatch(getAllUserApi());
  }, [dispatch, projectId]);

  useEffect(() => {
    const clonedUsers = [...userList];

    // remove members from user list
    for (const member of projectMembers) {
      const index = clonedUsers.findIndex((item) => {
        return item.userId === member.userId;
      });

      clonedUsers.splice(index, 1);
    }

    usersRef.current = [...clonedUsers];

    if (!searchRef.current) {
      setFilteredUsers([...clonedUsers]);
    } else {
      handleSearchUsers();
    }
  }, [projectMembers, userList]);

  useEffect(() => {
    if (projectError === "User is unthorization!") {
      Modal.warning({
        title: projectError,
        content: "You are not the owner of this project",
        okText: "OK",
        zIndex: 1050,
        style: { top: 80 },
        maskClosable: true,
        afterClose: () => {
          dispatch(setProjectErrorNullAction(null));
        },
      });
    }
  }, [projectError, dispatch]);

  const addMemberToProject = (userId) => () => {
    const data = { projectId, userId };
    console.log(data);
    dispatch(
      assignUserToProjectApi(data, () => {
        dispatch(getUsersByProjectIdApi(props.project.id));
        if (props.onFetchProject) {
          props.onFetchProject();
        }
      })
    );
  };

  const removeMemberFromProject = (userId) => () => {
    const data = { projectId, userId };
    console.log(data);
    dispatch(
      removeUserFromProjectApi(data, () => {
        dispatch(getUsersByProjectIdApi(projectId));
        if (props.onFetchProject) {
          props.onFetchProject();
        }
      })
    );
  };

  const handleGoToProjectsButtonClick = () => {
    props.onCancel();
    history.push("/projects");
  };

  const handleSearchUsers = (e) => {
    const value = searchRef.current.input.value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

    const clonedUsers = [...usersRef.current];

    let foundUsers = [];

    for (const i in clonedUsers) {
      if (
        clonedUsers[i].name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(value)
      ) {
        foundUsers.push(clonedUsers[i]);
      }
    }

    setFilteredUsers([...foundUsers]);
  };

  return (
    <>
      <Modal
        title={
          <Typography.Title level={4} className="pl-6">
            Add members to project{" "}
            <span className="text-blue-700">{props.project.projectName}</span>
          </Typography.Title>
        }
        open={props.visible}
        centered
        width={980}
        onCancel={props.onCancel}
        maskClosable={false}
        destroyOnClose={true}
        footer={
          showFooter
            ? [
                <Button
                  key="projects"
                  onClick={handleGoToProjectsButtonClick}
                  type="primary"
                >
                  Go to projects
                </Button>,
                <Button
                  key="newProject"
                  onClick={props.onCancel}
                  type="primary"
                >
                  Create new project
                </Button>,
              ]
            : null
        }
      >
        <Row gutter={36}>
          <Col span={24}>
            <Form>
              <Form.Item
                label={<Typography.Text strong>Search users</Typography.Text>}
                colon={false}
                className="ps-6 pe-6"
                labelCol={{ span: 6 }}
                labelAlign="left"
              >
                <Input
                  allowClear
                  suffix={<SearchOutlined />}
                  className="w-48 rounded"
                  onChange={handleSearchUsers}
                  ref={searchRef}
                />
              </Form.Item>
            </Form>
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }}>
            <Typography.Title level={5} className="pl-6">
              Not yet added
            </Typography.Title>
            <List
              className="mb-6"
              style={{
                height: 350,
                overflow: "auto",
                padding: "8px 24px",
              }}
              itemLayout="horizontal"
              dataSource={filteredUsers}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href="https://ant.design">{item.name}</a>}
                    description={
                      <div className="text-xs">User ID: {item.userId}</div>
                    }
                  />
                  <div>
                    <Button
                      onClick={addMemberToProject(item.userId)}
                      type="primary"
                    >
                      Add
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          </Col>
          <Col xs={{ span: 24 }} sm={{ span: 12 }}>
            <Typography.Title level={5} className="pl-6">
              Already in project
            </Typography.Title>
            <List
              className="mb-6"
              style={{
                height: 350,
                overflow: "auto",
                padding: "8px 24px",
              }}
              itemLayout="horizontal"
              dataSource={projectMembers}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={<a href="https://ant.design">{item.name}</a>}
                    description={
                      <div className="text-xs">User ID: {item.userId}</div>
                    }
                  />
                  <div>
                    <Button
                      onClick={removeMemberFromProject(item.userId)}
                      danger
                    >
                      Remove
                    </Button>
                  </div>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default memo(AddMemberModal);