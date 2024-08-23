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
// import { forEach } from 'lodash';
const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  type SearchProps = GetProps<typeof Input.Search>;
  const [filteredProject, setFilteredProject] = useState([]);
  const { projectList } = useSelector((state: any) => state.projectReducer);
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
    },
    {
      title: "Project Name",
      key: "projectName",
      dataIndex: "projectName",
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
    },
    {
      title: "Creator",
      key: "creator",
      dataIndex: "creator",
      render: (creator: { name: any }) => {
        // Kiểm tra xem creator có phải là một đối tượng không và trả về tên
        return creator ? creator.name || "N/A" : "N/A";
      },
    },
    {
      title: "Member",
      key: "members",
      dataIndex: "members",
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
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          loading={isLoading}
        />
        <div className="flex justify-end mt-10">
          <Pagination
            defaultCurrent={currentPage}
            total={totalPages}
            onChange={(page: number, pSize: number) => {
              setCurrentPage(page);
              setCurrentPageSize(pageSize);
              if (pSize !== pageSize) {
                setCurrentPageSize(pageSize);
              }
            }}
            showSizeChanger={false}
          />
        </div>
      </div>
    </div>
  );
};

export default ProjectList;
