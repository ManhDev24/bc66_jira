import { useFormik } from 'formik'
import * as yup from 'yup'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createProjectAuthorizeApi, getAllProject, getAllProjectCategoryApi, setProjectDetailNullAction } from '../../../redux/slices/project_slices'
import AddMemberModal from '../../../components/AddMemberModal/AddMemberModal'
import { Button, Form, Input, Select, Typography, Modal } from 'antd'
import { Link } from 'react-router-dom'
import TinyTextArea from '../../../components/TinyTextArea/TinyTextArea'
import Navbar from '../../../layout/Home/Navbar'
import { toast } from 'react-toastify'
import { useMutation } from '@tanstack/react-query'
import { projectApi } from '../../../apis/projects.api'
import { forEach } from 'lodash'
import { useListProject } from '../../../hooks/useListProject'
import { useListProjectName } from '../../../hooks/useListProjectsName'

import { PAGE_SIZE } from '../../../constant'
interface Project {
  id: number
  name: string
  // Thêm các thuộc tính khác
}
const ProjectNew = () => {
  const dispatch = useDispatch()
  const { projectCategories, projectError, projectDetail } = useSelector((state: any) => state.projectReducer)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setCurrentPageSize] = useState(PAGE_SIZE)
  const [showAddMembersModal, setShowAddMembersModal] = useState(false)
  const { data } = useListProjectName(currentPage, pageSize)
  const [nameProject, setNameProject] = useState([])

  // var projectNameList = [];
  // Object.entries(projectListData).forEach(([key, value]) => {
  //   projectNameList.push(value.projectName);
  // });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      projectName: '',
      description: '',
      categoryId: 0,
    },
    validationSchema: yup.object().shape({
      projectName: yup.string().required('Project name is required'),
      categoryId: yup.number().required('Project category is required').min(1, 'Project category is required').max(3, 'Project category is required'),
    }),
  })

  useEffect(() => {
    dispatch(getAllProjectCategoryApi())
  }, [dispatch])

  useEffect(() => {
    if (projectError === 'Project name already exists') {
      formik.setErrors({
        projectName: projectError,
        ...formik.errors,
      })
    }
    // eslint-disable-next-line
  }, [projectError])
  const openModal = () => {
    setShowAddMembersModal(true)
  }

  const closeModal = () => {
    setShowAddMembersModal(false)
  }

  const handleSubmit = () => {
    // projectNameList.forEach((project, index) => {
    //   if(project === formik.values.projectName)
    //   {
    //     const errorMessage =  'Project của bạn đã bị trùng tên ';
    //     toast.error(errorMessage)
    //   }
    // });
    const isDuplicate = Object.values(data).some((value) => value.projectName === formik.values.projectName)
    if (isDuplicate) {
      toast('Tên dự án của bạn đã bị trùng, dự án tạo không thành công')
    } else {
      dispatch(
        createProjectAuthorizeApi(formik.values, () => {
          formik.resetForm()
          setShowAddMembersModal(true)
        })
      ),
        toast.success('Tạo dự án thành công')
    }
  }

  // useEffect(() => {
  //   // Giả sử bạn lấy dữ liệu dự án từ API hoặc một nguồn khác
  //   const fetchProjects = async () => {
  //     const projects = await projectApi.getAllProjectList(); // Thay thế bằng cách lấy dữ liệu của bạn
  //     setProjectListData(projects);
  //   };

  //   fetchProjects();
  // }, []);
  const handleCancel = () => {
    dispatch(setProjectDetailNullAction(null))
    setShowAddMembersModal(false)
  }

  useEffect(() => {}, [showAddMembersModal])
  useEffect(() => {}, [nameProject])
  return (
    <div>
      <Navbar></Navbar>
      <div style={{ maxWidth: 980 }} className="container my-4">
        <div className="mb-4">
          <Typography.Title level={3}>New project</Typography.Title>
        </div>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label={
              <Typography.Text strong>
                Project name <span className="text-red-700">*</span>
              </Typography.Text>
            }
            help={formik.touched.projectName && formik.errors.projectName}
            validateStatus={formik.touched.projectName && !!formik.errors.projectName ? 'error' : ''}
          >
            <Input name="projectName" value={formik.values.projectName} onChange={formik.handleChange} onBlur={formik.handleBlur} />
          </Form.Item>

          <Form.Item
            label={
              <Typography.Text strong>
                Project category <span className="text-red-700">*</span>
              </Typography.Text>
            }
            help={formik.touched.categoryId && formik.errors.categoryId}
            validateStatus={formik.touched.categoryId && !!formik.errors.categoryId ? 'error' : ''}
          >
            <Select className="w-full" placeholder="Select a project category" name="categoryId" value={formik.values.categoryId} onChange={(value) => formik.setFieldValue('categoryId', value)}>
              <Select.Option value={0}>Select a project category</Select.Option>
              {projectCategories.map(({ id, projectCategoryName }) => {
                return (
                  <Select.Option key={id} value={id}>
                    {projectCategoryName}
                  </Select.Option>
                )
              })}
            </Select>
          </Form.Item>

          <Form.Item label={<Typography.Text strong>Descriptions</Typography.Text>} style={{ minHeight: 230 }}>
            <TinyTextArea value={formik.values.description} name={'description'} setFieldValue={formik.setFieldValue} />
          </Form.Item>

          <div className="flex">
            <Button style={{ marginRight: '1%' }}>
              <Link to="/projects" style={{ textDecoration: 'none' }}>
                Cancel
              </Link>
            </Button>
            <Button onClick={openModal} htmlType="submit" type="primary">
              Create
            </Button>
          </div>
        </Form>

        {projectDetail ? <AddMemberModal visible={showAddMembersModal} onCancel={handleCancel} project={projectDetail} /> : null}
      </div>
    </div>
  )
}

export default ProjectNew
