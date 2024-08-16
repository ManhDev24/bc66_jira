import React, { useEffect, useRef, useState } from "react";
import "./indexAdd.scss";
import { Alert, Breadcrumb, Button, Input, Select } from "antd";
import { includes } from "lodash";
import Navbar from "../../../layout/Home/Navbar";
import { PATH } from "../../../routes/path";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Editor } from "@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor";
import { useMutation, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { projectApi } from "../../../apis/projects.api";
import { toast } from "react-toastify";
export interface FormValues {
  projectsName: string;
  projectsCategory: number;
  description: string;
}

const AddProject: React.FC = () => {
  const [valueSelect, setValueSelect] = useState<string | null>(null);

  const { Option } = Select;
  const queryClient = useQueryClient();
  const schema = yup.object({
    projectsName: yup.string().trim().required("Project name is required"),
    projectsCategory: yup
      .number()
      .required("Project category is required"),
    description: yup.string().required("Description is required"),
  });
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      projectsName: "",
      projectsCategory: 0,
      description: "",
    },
    resolver: yupResolver(schema),
    mode: "onBlur",
    criteriaMode: "all",
  });

  const { mutate: handleAddProject, isPending: isAdding } = useMutation({
    mutationFn: projectApi.addProject,
    onSuccess: () => {
      toast.success("User added successfully!");
      queryClient.refetchQueries({
        queryKey: ["list-project"],
        type: "active",
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
  
  const editorRef = useRef<any>(null);
  const description = watch("description");
//   const onSubmit = (data: FormValues) => {
//     console.log("Submitted Data:", data);
//     // Xử lý dữ liệu khi form được submit
//   };
    const onSubmit = (formValues: FormValues) => {
      
      let formData = new FormData()
      formData.append('projectsName', formValues.projectsName)
      formData.append('projectsCategory', formValues.projectsCategory)
      formData.append('description', formValues.description)

      handleAddProject(formData)
      
    }
  useEffect(() => {
    if (editorRef.current) {
      // Cập nhật nội dung nếu giá trị không phải là undefined hoặc null
      if (typeof description === "string") {
        editorRef.current.setContent(description);
      }
    }
  }, [description]);
  return (
    <Navbar>
      <div className="container pt_20">
        <Breadcrumb
          separator=">"
          items={[
            {
              title: "Projects",
              href: PATH.PROJECT,
            },
            {
              title: "New Project",
            },
          ]}
        />

        <div>
          <h5 className="py-3">New project</h5>
          <form onSubmit={handleSubmit(onSubmit)}>
            <label className="text-sm pt-2">
              <span className="font-bold">Project Names</span>
              <span className="text-red-600">*</span>
            </label>
            <Controller
              name="projectsName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  status={errors.projectsName ? "error" : ""}
                  size="large"
                  className="mt-1"
                  placeholder="Tài Khoản"
                />
              )}
            />
            {errors.projectsName && (
              <p className="text-xs text-red-600">
                {errors.projectsName.message}
              </p>
            )}

            <label className="text-sm py-2">
              <span className="font-bold">Project Category</span>
              <span className="text-red-600">*</span>
            </label>
            <Controller
              name="projectsCategory"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  style={{ width: "100%" }}
                  placeholder="Select a project category"
                  onChange={(value) => field.onChange(Number(value))}
                  value={field.value}

                >
                  <Option value="0">Dự án web</Option>
                  <Option value="1">Dự án phần mềm</Option>
                  <Option value="2">Dự án di động</Option>
                </Select>
              )}
            />

            <label className="text-sm py-2">
              <span className="font-bold">Descriptions</span>
              <span className="text-red-600">*</span>
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Editor
                  apiKey="vrdoer2sv642y76nwqxuds28hfp3zk5z00ohhlsi2t520aku"
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  value={field.value || ""} // Đảm bảo giá trị là chuỗi không null
                  onEditorChange={(content) => field.onChange(content)}
                  
                  init={{
                    plugins:
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                      { value: "First.Name", title: "First Name" },
                      { value: "Email", title: "Email" },
                    ],
                    ai_request: (request, respondWith) =>
                      respondWith.string(() =>
                        Promise.reject("See docs to implement AI Assistant")
                      ),
                  }}
                />
              )}
            />

            <Button size="large" type="default" className="mt-3">
              Cancel
            </Button>
            <Button
              htmlType="submit"
              size="large"
              type="primary"
              className="mx-3 mt-3"
            >
              Create
            </Button>
          </form>
        </div>
      </div>
    </Navbar>
  );
};

export default AddProject;
