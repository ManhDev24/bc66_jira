import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Button,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Table,
  Tooltip,
  Typography,
} from "antd";
import Title from "antd/es/typography/Title";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { AudioOutlined, SearchOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import type { GetProps, MenuProps } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { PAGE_SIZE } from "../../constant";
import { useListProject } from "../../hooks/useListProject";
import { Project } from "../../interface/projectListInter";
import { projectApi } from "../../apis/projects.api";
import {
  deleteProjectApi,
  getAllProject,
  getAllProjectCategoryAction,
} from "../../redux/slices/project_slices";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import fetcher from "../../apis/fetcher";
import { getTaskId } from "../../redux/slices/task_slices";
import { useMediaQuery } from "usehooks-ts";
// import { forEach } from 'lodash';
interface Project {
  id: number;
  name: string;
  // Thêm các thuộc tính khác
}

interface DataListProjectItem {
  items: Project[];
  totalCount: number; // Tổng số phần tử
}
const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  type SearchProps = GetProps<typeof Input.Search>;
  const [filteredProject, setFilteredProject] = useState([]);
  const { projectList } = useSelector((state: any) => state.projectReducer);
  const [totalItems, setTotalItems] = useState(0);
  const projectRef = useRef([]);
  const searchRef = useRef(null);

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setCurrentPageSize] = useState(PAGE_SIZE);

  const dispatch = useDispatch();
  const { data, isLoading, error } = useListProject(currentPage, pageSize);
  const totalPages = data?.totalPages || 0;
  const [dataSource, setDataSource] = useState([]);
  const showConfirmDeleteProjectModal = ({
    projectName,
    id: projectId,
  }: any) => {
    return () => {
      Modal.confirm({
        title: `Are you sure to delete\n${projectName}?`,
        okText: "Delete",
        zIndex: 1050,
        centered: true,
        onOk: () => {
          handleDeleteProject(projectId);
        },
        cancelText: "Cancel",
      });
    };
  };
  const handleDeleteProject = (projectId: any) => {
    dispatch(deleteProjectApi(projectId));
    showProjectDeletedSuccessfullyModal();
  };
  const showProjectDeletedSuccessfullyModal = () => {
    dispatch(getAllProject());
    Swal.fire({
      title: "Project deleted successfully",
      icon: "success",
      showConfirmButton: false,
    });
  };

  const columns = [
    {
      title: "id",
      key: "id",
      dataIndex: "id",
      width: 200,
      responsive: ["xs", "sm", "md"],
    },
    {
      title: "Project Name",
      key: "projectName",
      dataIndex: "projectName",
      sorter: (a, b) => a.projectName.length - b.projectName.length,
      sortDirections: ["descend", "ascend"],
      responsive: ["xs", "sm", "md"],
      render: (projectName: any, record: any) => {
        return (
          <Link
            className="text-decoration-none"
            to={`/projects/${record.id}/board`}
            onClick={() => {
              dispatch(
                getTaskId({ id: record.id, projectName: record.projectName })
              );
            }}
          >
            {projectName}
          </Link>
        );
      },
    },
    {
      title: "Category Name",
      key: "categoryName",
      dataIndex: "categoryName",
      sorter: (a, b) => a.categoryName.length - b.categoryName.length,
      sortDirections: ["descend", "ascend"],
      responsive: ["xs", "sm", "md"],
    },
    {
      title: "Creator",
      key: "creator",
      dataIndex: "creator",
      sorter: (a, b) => a.creator.length - b.creator.length,
      sortDirections: ["descend", "ascend"],
      responsive: ["xs", "sm", "md"],
      render: (creator: { name: any }) => {
        // Kiểm tra xem creator có phải là một đối tượng không và trả về tên
        return creator ? creator.name || "N/A" : "N/A";
      },
    },
    {
      title: "Member",
      key: "members",
      dataIndex: "members",
      responsive: ["xs", "sm", "md"],
      render: (members: { name: any }) => {
        // Kiểm tra xem creator có phải là một đối tượng không và trả về tên
        return (
          <Avatar.Group
            maxCount={2}
            maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
          >
            {members.map((member: any) => (
              <Tooltip title={member.name} key={member.userId}>
                <Avatar src={member.avatar} />
              </Tooltip>
            ))}
          </Avatar.Group>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      responsive: ["xs", "sm", "md"],
      render: (record: Project) => {
        return (
          <div className="flex">
            <Button
              type="primary"
              className="mr-2"
              onClick={() => {
                navigate(`/projects/${record.id}/edit`);
              }}
            >
              Setting
            </Button>
            <Button
              type="primary"
              danger
              onClick={showConfirmDeleteProjectModal(record)}
            >
              Move To Trash
            </Button>
          </div>
        );
      },
    },
  ];

  if (!isLoading && error) {
    return <div>Something went wrong</div>;
  }
  useEffect(() => {
    // Giả sử bạn lấy dữ liệu dự án từ API hoặc một nguồn khác
    const fetchProjects = async () => {
      const projects = await projectApi.getAllProject(currentPage); // Thay thế bằng cách lấy dữ liệu của bạn
      projectRef.current = projects;
      console.log(projectRef.current);
    };

    fetchProjects();
  }, []);
  const handleSearchProject = (e) => {
    const value = (searchRef.current?.input?.value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    console.log("Giá trị tìm kiếm:", value);

    const clonedProjects = [...projectRef.current];
    let foundProject = [];

    clonedProjects.forEach((project) => {
      const name = project.projectName || "";

      if (
        typeof name === "string" &&
        name
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(value)
      ) {
        foundProject.push(project);
      }
    });
    console.log("Dự án đã tìm thấy:", foundProject);
    setFilteredProject([...foundProject]);
    console.log("Dự án hiện tại:", projectRef.current);
  };

  useEffect(() => {
    const dataSource = filteredProject.length > 0 ? filteredProject : data;
    setDataSource(dataSource);
  }, [filteredProject, data]);
  // drop down
  const isWebDevice = useMediaQuery("(max-width:760px)");
  const deviceColumns = [
    {
      title: "Project Details",
      render: (record: data) => {
        const projectNameData = record.projectName;
        const categoryNameData = record.categoryName;
        const creatorData = record.creator;
        const membersData = record.members;
        const projectIdData = record.id;
        return (
          <div>
            <ul className="text-decoration-none list-unstyled">
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Project Name:</strong>{" "}
                  </p>
                </div>
                <div className="col-6">
                  <a
                    onClick={() => {
                      navigate(`/projects/${projectIdData}/board`);
                    }}
                    className="text-blue-700 hover:text-blue-700 focus:text-blue-700 text-decoration-none"
                  >
                    {projectNameData}
                  </a>
                </div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Category Name:</strong>{" "}
                  </p>
                </div>
                <div className="col-6">{categoryNameData}</div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Members:</strong>{" "}
                  </p>
                </div>
                <div className="col-6">
                  <Avatar.Group
                    maxCount={2}
                    maxStyle={{ color: "#f56a00", backgroundColor: "#fde3cf" }}
                  >
                    {membersData.map((member: any) => (
                      <Tooltip title={member.name} key={member.userId}>
                        <Avatar src={member.avatar} />
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                </div>
              </li>
              <li className="row flex-wrap">
                <div className="col-6">
                  <p className="ant-typography">
                    <strong>Action:</strong>{" "}
                  </p>
                </div>
                <div className="col-6">
                  <div className="flex">
                    <Button
                      type="primary"
                      className="mr-2"
                      onClick={() => {
                        navigate(`/projects/${projectIdData}/edit`);
                      }}
                    >
                     <span role="img" aria-label="edit" className="anticon anticon-edit"><svg viewBox="64 64 896 896" focusable="false" data-icon="edit" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z"></path></svg></span>
                    </Button>
                    <Button
                      type="primary"
                      danger
                      onClick={showConfirmDeleteProjectModal(record)}
                    >
                      <span role="img" aria-label="delete" className="anticon anticon-delete"><svg viewBox="64 64 896 896" focusable="false" data-icon="delete" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"></path></svg></span>
                    </Button>
                  </div>

                </div>
              </li>
            </ul>
          </div>
        );
      },
    },
  ];
  return (
    <div className="container pb-6 pt_6">
      <div className="mb-3 flex justify-between justify-center align-middle">
        <Typography>
          <Title>Projects</Title>
        </Typography>
        <Button
          onClick={() => {
            navigate(`new`);
          }}
          className="flex justify-center items-center h-8 bg-blue-700 hover:bg-blue-600 focus:bg-blue-600 text-white hover:text-white font-medium py-1.5 px-3 rounded cursor-pointer"
        >
          Create project
        </Button>
      </div>
      <div>
        <Input
          allowClear
          suffix={<SearchOutlined />}
          className="w-48 rounded"
          onChange={handleSearchProject}
          ref={searchRef}
        />
      </div>
      <div>
        <Table
          rowKey="id"
          columns={isWebDevice ? deviceColumns : columns}
          dataSource={dataSource}
          pagination={true}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default ProjectList;
