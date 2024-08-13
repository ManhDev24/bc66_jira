import React, { useEffect, useState } from 'react'
import { Button, message, Pagination, Popconfirm, Table, Typography } from "antd";
import Title from 'antd/es/typography/Title';
import { Navigate, useNavigate } from 'react-router-dom';
import { AudioOutlined } from '@ant-design/icons';
import { Input, Space } from 'antd';
import type { GetProps, MenuProps } from 'antd';
import { useQueryClient } from '@tanstack/react-query';
import { PAGE_SIZE } from '../../constant';
import { useListProject } from '../../hooks/useListProject';
import { Project } from '../../interface/projectListInter';
import { forEach } from 'lodash';
const ProjectList: React.FC = () => {
  const navigate = useNavigate()
  type SearchProps = GetProps<typeof Input.Search>;

  const { Search } = Input;

  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1677ff',
      }}
    />
  );
  const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setCurrentPageSize] = useState(PAGE_SIZE)

 
  const { data, isLoading, error } = useListProject(currentPage,pageSize);
  console.log("data",data)
  const totalPages = data?.totalPages || 0;
  
  
  
  const columns = [
    {
      title: 'id',
      key:'id',
      dataIndex:'id',
      width: 200,
      
    },
    {
      title: 'Project Name',
      key: 'projectName',
      dataIndex:'projectName',
    },
    {
      title: 'Category Name',
      key: 'categoryName',
      dataIndex:'categoryName',
      
    },
    {
      title: 'Creator',
      key: 'creator',
      dataIndex:'creator',
      render: (creator: { name: any; }) => {
        // Kiểm tra xem creator có phải là một đối tượng không và trả về tên
        return creator ? creator.name || 'N/A' : 'N/A';
      },
    },
    {
      title: 'Member',
      key: 'members',
      dataIndex: 'members',
      render: (members: { name: any; }) => {
        // Kiểm tra xem creator có phải là một đối tượng không và trả về tên
        return members ? members.name || 'N/A' : 'N/A';
      },
    },

    {
      title: 'Action',
      key: 'action',
      render: (record: Project) => {
        return (
          <div className="flex">
            <Button type="primary" className="mr-2" onClick={() => {
              navigate(`/projects/${record.id}/edit`)
            }}>
              Setting
            </Button>
            <Popconfirm
              title="Delete the movie"
              description="Are you sure to delete this movie?"
              // onConfirm={() => handleDeleteMovieApi(record.maPhim.toString())}
              onCancel={() => { }}
              placement="bottom"
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger >
                Move To Trash
              </Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];
  const dataSource = data || [];
  const total = data?.totalCount || 0;
  if (!isLoading && error) {
    return <div>Something went wrong</div>;
  }
  // drop down
  
  
 
  return (
    <div className='container pb-6 pt_6'>
        <div className='mb-3 flex justify-between justify-center align-middle'>
          <Typography>
              <Title>Projects</Title>
          </Typography>
          <Button onClick={()=>{navigate(`projects/new`)}} className='flex justify-center items-center h-8 bg-blue-700 hover:bg-blue-600 focus:bg-blue-600 text-white hover:text-white font-medium py-1.5 px-3 rounded cursor-pointer'>
              Create project
          </Button>
        </div>
        <div>
          <Space direction="vertical"> 
              <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
          </Space>
        </div>
        <div>
        <Table rowKey="id" columns={columns} dataSource={dataSource} pagination={false} loading={isLoading} />
          <div className="flex justify-end mt-10">
            <Pagination
              defaultCurrent={currentPage}
              total={totalPages}
              onChange={(page: number, pSize: number) => {
                setCurrentPage(page)
                setCurrentPageSize(pageSize)
                if (pSize !== pageSize) {
                  setCurrentPageSize(pageSize)
                }
              }}
              showSizeChanger={false}
            />
          </div>
        </div>
    </div>
  )
}

export default ProjectList