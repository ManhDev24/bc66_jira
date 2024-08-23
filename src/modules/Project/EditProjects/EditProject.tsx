import "./indexEdit.scss";
import Navbar from "../../../layout/Home/Navbar";
import { useFormik } from "formik";
import * as yup from "yup";
import React, { useEffect, useState } from "react";
import {
  getAllProjectCategoryApi,
  getProjectDetailApi,
  updateProjectApi,
} from "../../../redux/slices/project_slices";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Input, Select, Typography, Modal, Breadcrumb } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import TinyTextArea from "../../../components/TinyTextArea/TinyTextArea";
import Swal from "sweetalert2";

const EditProject = () => {
  const params = useParams();
  const projectId = parseInt(params.id);
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const { projectDetail, projectCategories, projectError } = useSelector(
    (state) => state.projectReducer
  );
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      projectName: "",
      description: "",
      categoryId: 0,
    },
    validationSchema: yup.object().shape({
      projectName: yup.string().required("Project name is required"),
      categoryId: yup
        .number()
        .required("Project category is required")
        .min(1, "Project category is required")
        .max(3, "Project category is required"),
    }),
  });
  useEffect(() => {
    dispatch(getAllProjectCategoryApi());
    dispatch(getProjectDetailApi(projectId));
  }, [dispatch, projectId]);
  useEffect(() => {
    formik.setValues({
      ...projectDetail,
      creator: projectDetail?.creator.id,
      categoryId: projectDetail?.projectCategory.id,
    });
    // eslint-disable-next-line
  }, [projectDetail]);
  const handleUpdateProject = () => {
    // formik.setTouched({
    //   projectName: true,
    //   categoryId: true,
    // });

    // if (!formik.dirty) return;

    // if (!formik.isValid) return;

    dispatch(updateProjectApi(formik.values));
    dispatch(getProjectDetailApi(projectId));
    Swal.fire({
      title: "Project updated successfully",
      icon: "success",
      confirmButtonText: "OK",
      
    });
    navigator(`/projects`);
    // dispatch(
    //   updateProject(formik.values, () => {
    //     dispatch(fetchProjectDetail(projectId));
    //     Swal.fire({
    //       title: "Project updated successfully",
    //       icon: "success",
    //       showConfirmButton: false,
    //     });
    //   })
    // );
  };

  // check if the project no longers exist
  if (projectError && projectError === "Project is not found") {
    return <PageNotFound />;
  }
  return (
    <div>
      <Navbar></Navbar>
      <div style={{ maxWidth: 980 }} className="container my-4">
      <Breadcrumb className="mb-4 pt-9">
        <Breadcrumb.Item>
          <Link to="/projects">Projects</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link to={`/projects/${projectId}/board`}>
            {projectDetail?.projectName}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Project settings</Breadcrumb.Item>
      </Breadcrumb>
        <div className="mb-4">
          <Typography.Title level={3}>New project</Typography.Title>
        </div>

        <Form layout="vertical" onFinish={handleUpdateProject}>
            <Form.Item
            label={
                <Typography.Text strong>
                Project ID <span className="text-red-700">*</span>
                </Typography.Text>
            }
            >
            <Input disabled value={formik.values?.id} />
            </Form.Item>
          <Form.Item
            label={
              <Typography.Text strong>
                Project name <span className="text-red-700">*</span>
              </Typography.Text>
            }
            help={formik.touched.projectName && formik.errors.projectName}
            validateStatus={
              formik.touched.projectName && !!formik.errors.projectName
                ? "error"
                : ""
            }
          >
            <Input
              name="projectName"
              value={formik.values.projectName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Form.Item>

          <Form.Item
            label={
              <Typography.Text strong>
                Project category <span className="text-red-700">*</span>
              </Typography.Text>
            }
            help={formik.touched.categoryId && formik.errors.categoryId}
            validateStatus={
              formik.touched.categoryId && !!formik.errors.categoryId
                ? "error"
                : ""
            }
          >
            <Select
              className="w-full"
              placeholder="Select a project category"
              name="categoryId"
              value={formik.values.categoryId}
              onChange={(value) => formik.setFieldValue("categoryId", value)}
            >
              <Select.Option value={0}>Select a project category</Select.Option>
              {projectCategories.map(({ id, projectCategoryName }) => {
                return (
                  <Select.Option key={id} value={id}>
                    {projectCategoryName}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            label={<Typography.Text strong>Descriptions</Typography.Text>}
            style={{ minHeight: 230 }}
          >
            <TinyTextArea
              value={formik.values.description}
              name={"description"}
              setFieldValue={formik.setFieldValue}
            />
          </Form.Item>

          <div className="flex">
            <Button style={{ marginRight: "1%" }}>
              <Link to="/projects" style={{ textDecoration: "none" }}>
                Cancel
              </Link>
            </Button>
            <Button  htmlType="submit" type="primary">
              Update
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditProject;
