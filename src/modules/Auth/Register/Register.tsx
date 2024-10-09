import { Button, Col, Form, Input, Row, Spin, Typography } from "antd";
import * as yup from "yup";

import { PATH } from "../../../routes/path";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { UserRegisterRequest } from "../../../interface/user.interface";
import { userAPI } from "../../../apis/user.api";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  LoadingOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
interface FormValue {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
}

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email is invalid")
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email is invalid")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  name: yup.string().required("Name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      phoneNumber: "",
    },
    resolver: yupResolver(validationSchema),
    criteriaMode: "all",
    mode: "onBlur",
  });

  const { mutate: handleRegister, isPending } = useMutation({
    mutationFn: (payload: UserRegisterRequest) => userAPI.register(payload),
    onSuccess: () => {
      toast.success("Register successfull");
      navigate(PATH.LOGIN);
    },
    onError: (error: any) => {
      console.log("error: ", error);
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });
  const onSubmit = (value: FormValue) => {
    handleRegister(value);
  };
  if (isPending) {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    );
  }
  return (
    <div className="w-[400px]">
      <div className="my-4 text-center">
        <Typography className="font-bold text-3xl">Register</Typography>
      </div>
      <Form
        className="mt-4"
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
      >
        <Row gutter={[48, 10]}>
          <Col span={24}>
            <label className="text-xs text-[#6A7280]">*Email</label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  size="large"
                  className="mt-1"
                  placeholder="Enter your email address..."
                  status={errors.email ? "error" : ""}
                />
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </Col>
          <Col span={24}>
            <label className="text-xs text-[#6A7280]">*Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  size="large"
                  className="mt-1"
                  placeholder="Enter your full name..."
                  status={errors.name ? "error" : ""}
                />
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name.message}</p>
            )}
          </Col>
          <Col span={24}>
            <label className="text-xs text-[#6A7280]">*Password</label>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  type="password"
                  size="large"
                  className="mt-1"
                  placeholder="Password is required..."
                  status={errors.password ? "error" : ""}
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              )}
            />
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </Col>
          <Col span={24}>
            <label className="text-xs text-[#6A7280]">Phone Number</label>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  size="large"
                  className="mt-1"
                  placeholder="Enter your phone number..."
                  status={errors.phoneNumber ? "error" : ""}
                />
              )}
            />
            {errors.phoneNumber && (
              <p className="text-xs text-red-600">
                {errors.phoneNumber.message}
              </p>
            )}
          </Col>

          <Col span={24} className="mt-2">
            <Button type="primary" htmlType="submit" size="large" block>
              Đăng Ký
            </Button>
          </Col>
        </Row>
      </Form>
      <Typography className="mt-8 text-center">
        Have an account ?{" "}
        <a href={PATH.LOGIN}>
          <span className="text-blue-700 font-medium cursor-pointer">
            Login
          </span>
        </a>
      </Typography>
      <ToastContainer />
    </div>
  );
};

export default Register;
