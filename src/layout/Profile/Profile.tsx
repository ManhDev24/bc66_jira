import { Avatar, Button, Col, Input, Row } from "antd";
import Navbar from "../Home/Navbar";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../../apis/user.api";
import { toast } from "react-toastify";
import { setLocalStorage } from "../../utils";
import { setUser } from "../../redux/slices/user_slice";

interface FormValues {
  userId: string;
  password: string;
  confirmPass: string;
  email: string;
  name: string;
  phoneNumber: string;
}

const validationSchema = yup.object().shape({
  email: yup.string().email("Email is invalid").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .matches(
      /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Password must contain at least one special character"
    ),
  confirmPass: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Password confirmation is required"),
  name: yup.string().required("Name is required"),
  phoneNumber: yup.string().required("Phone number is required"),
});

const Profile = () => {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading: isGetUserInfo,
    isError: isGetUserError,
    error: getUserError,
  } = useQuery({
    queryKey: ["detail-user", user?.id], // Include user ID in the query key
    queryFn: () => userAPI.getDetailuserById(user?.id as any),
    enabled: !!user?.id,
  });

  const {
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      userId: "",
      email: "",
      password: "",
      confirmPass: "",
      name: "",
      phoneNumber: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    if (userData && userData.length > 0) {
      const user = userData[0];
      setValue("userId", user.userId || "");
      setValue("name", user.name || "");
      setValue("email", user.email || "");
      setValue("phoneNumber", user.phoneNumber || "");
    } else {
      reset();
    }
  }, [userData, setValue, reset]);

  const generateAvatarUrl = (name: string) => {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`;
  };

  const { mutate: handleEditUser } = useMutation({
    mutationFn: (payload: FormValues) => userAPI.editUser(payload as any),
    onSuccess: (_, variables) => {
      toast.success("Profile updated successfully!");
      const updatedUser = {
        ...user,
        ...variables,
        avatar: variables.name
          ? generateAvatarUrl(variables.name)
          : user.avatar,
      };
      dispatch(setUser(updatedUser));
      setLocalStorage("user", updatedUser);
    },
    onError: (error: any) => {
      const errorMessage = error?.message || "An unexpected error occurred";
      toast.error(errorMessage);
    },
  });

  const onCancel = () => {
    reset({
      userId: user?.id || "",
      email: user?.email || "",
      name: user?.name || "",
      phoneNumber: user?.phoneNumber || "",
      password: "",
      confirmPass: "",
    });
  };

  const onSubmit = (data: FormValues) => {
    const { confirmPass, userId, ...rest } = data;
    const formData = { id: userId, ...rest };
    handleEditUser(formData as any);
  };

  return (
    <div>
      <Navbar />
      <div className="container py-6 mt-[64px] flex justify-center">
        <div className="mx-auto" style={{ maxWidth: "980px" }}>
          <Row>
            <Col span={12}>
              <div className="ml-[140px]">
                <Avatar className="w-[240px] h-[240px]" src={user?.avatar} />
              </div>
            </Col>
            <Col span={12}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Row gutter={[48, 10]}>
                  <Col span={24}>
                    <label className="text-sm pt-2">
                      <span className="text-red-600 ">* </span>
                      <h6 className="bold inline-block">ID</h6>
                    </label>
                    <Controller
                      name="userId"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          readOnly
                          size="large"
                          className="mt-1"
                          status={errors.userId ? "error" : ""}
                        />
                      )}
                    />
                    {errors.userId && (
                      <span className="text-red-600">
                        {errors.userId.message}
                      </span>
                    )}
                  </Col>
                  <Col span={24}>
                    <label className="text-sm pt-2">
                      <span className="text-red-600 ">* </span>
                      <h6 className="bold inline-block">Name</h6>
                    </label>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="large"
                          className="mt-1"
                          status={errors.name ? "error" : ""}
                        />
                      )}
                    />
                    {errors.name && (
                      <span className="text-red-600">
                        {errors.name.message}
                      </span>
                    )}
                  </Col>
                  <Col span={24}>
                    <label className="text-sm pt-2">
                      <span className="text-red-600 ">* </span>
                      <h6 className="bold inline-block">Email</h6>
                    </label>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="large"
                          className="mt-1"
                          status={errors.email ? "error" : ""}
                        />
                      )}
                    />
                    {errors.email && (
                      <span className="text-red-600">
                        {errors.email.message}
                      </span>
                    )}
                  </Col>
                  <Col span={24}>
                    <label className="text-sm pt-2">
                      <span className="text-red-600 ">* </span>
                      <h6 className="bold inline-block">Phone Number</h6>
                    </label>
                    <Controller
                      name="phoneNumber"
                      control={control}
                      render={({ field }) => (
                        <Input
                          {...field}
                          size="large"
                          className="mt-1"
                          status={errors.phoneNumber ? "error" : ""}
                        />
                      )}
                    />
                    {errors.phoneNumber && (
                      <span className="text-red-600">
                        {errors.phoneNumber.message}
                      </span>
                    )}
                  </Col>
                  <Col span={24}>
                    <label className="text-sm pt-2">
                      <span className="text-red-600 ">* </span>
                      <h6 className="bold inline-block">Password</h6>
                    </label>
                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <Input.Password
                          {...field}
                          size="large"
                          className="mt-1"
                          status={errors.password ? "error" : ""}
                        />
                      )}
                    />
                    {errors.password && (
                      <span className="text-red-600">
                        {errors.password.message}
                      </span>
                    )}
                  </Col>
                  <Col span={24}>
                    <label className="text-sm pt-2">
                      <span className="text-red-600 ">* </span>
                      <h6 className="bold inline-block">Confirm Password</h6>
                    </label>
                    <Controller
                      name="confirmPass"
                      control={control}
                      render={({ field }) => (
                        <Input.Password
                          {...field}
                          size="large"
                          className="mt-1"
                          status={errors.confirmPass ? "error" : ""}
                        />
                      )}
                    />
                    {errors.confirmPass && (
                      <span className="text-red-600">
                        {errors.confirmPass.message}
                      </span>
                    )}
                  </Col>
                  <Col className="flex justify-end" span={24}>
                    <div className="mr-4">
                      <Button htmlType="submit" type="primary">
                        Update
                      </Button>
                    </div>
                    <div>
                      <Button onClick={onCancel}>Cancel</Button>
                    </div>
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export default Profile;
