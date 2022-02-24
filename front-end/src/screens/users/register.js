import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { register as registerApi } from "../../apiServices/index";
import { toast } from "react-toastify";
import Form from "../../components/form";
import InputField from "../../components/inputField";
import Button from "../../components/button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const registerFormValidationSchema = yup.object({
  fullname: yup.string().required("Fullname must be filled"),
  username: yup
    .string()
    .email("Username be a valid email")
    .max(255)
    .required("Username is required"),
  password: yup
    .string()
    .required("No password provided.")
    .min(8, "Password is too short - should be 8 chars minimum.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  age: yup
    .number()
    .required("Please supply your age")
    .min(1, "You must be at least 1 years")
    .max(100, "You must be at most 100 years"),
  address: yup.string().required("Address must be filled").max(500),
  dateOfBirth: yup.date().required("Date of Birth is required"),
  gender: yup.string().required("Gender must be filled"),
});

const RegisterPage = ({ loadUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    getValues,
    reset,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(registerFormValidationSchema),
  });

  useEffect(() => {
    register("username");
    register("password");
    register("confirmPassword");
    register("address");
    register("age");
    register("dateOfBirth");
    register("gender");
    register("fullname");
  }, [register]);

  const onChange = (e) => {
    setValue(e.target.name, e.target.value);
    setError(e.target.value, null);
  };

  const onSubmit = async (formData) => {
    const { status, data } = await registerApi(formData);
    if (status === 400) {
      toast.error(data.message);
    } else if (status === 201) {
      toast.success(data.message);
      reset({
        name: "",
        password: "",
        confirmPassword: "",
        address: "",
        age: "",
        dateOfBirth: "",
        gender: "",
      });
      loadUser();
    } else {
      toast.warning(data.message);
    }
  };

  return (
    <>
      <div className="w-full">
        <Form title="Create Account">
          <InputField
            type="text"
            placeholder="Fullname"
            name="fullname"
            value={getValues("fullname")}
            onChange={onChange}
          />
          {errors.fullname?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                {errors.fullname?.message}
              </span>
            </div>
          )}
          <InputField
            type="text"
            placeholder="Username"
            name="username"
            value={getValues("username")}
            onChange={onChange}
          />
          {errors.username?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                {errors.username?.message}
              </span>
            </div>
          )}
          <InputField
            type="password"
            placeholder="password"
            name="password"
            value={getValues("password")}
            onChange={onChange}
          />
          {errors.password?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                {errors.password?.message}
              </span>
            </div>
          )}
          <InputField
            type="password"
            placeholder="confirmPassword"
            name="confirmPassword"
            value={getValues("confirmPassword")}
            onChange={onChange}
          />
          {errors.confirmPassword?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                {errors.confirmPassword?.message}
              </span>
            </div>
          )}
          <InputField
            type="text"
            placeholder="Address"
            name="address"
            value={getValues("address")}
            onChange={onChange}
          />
          {errors.address?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{errors.address?.message}</span>
            </div>
          )}
          <InputField
            type="number"
            min="1"
            max="100"
            placeholder="Age"
            name="age"
            value={getValues("age")}
            onChange={onChange}
          />
          {errors.age?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{errors.age?.message}</span>
            </div>
          )}
          <InputField
            type="text"
            placeholder="Date Of Birth"
            name="dateOfBirth"
            value={getValues("dateOfBirth")}
            onChange={onChange}
          />
          {errors.dateOfBirth?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">
                {errors.dateOfBirth?.message}
              </span>
            </div>
          )}
          <InputField
            type="text"
            placeholder="Gender"
            name="gender"
            value={getValues("gender")}
            onChange={onChange}
          />
          {errors.gender?.message && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <span className="block sm:inline">{errors.gender?.message}</span>
            </div>
          )}

          <Button
            onClick={handleSubmit(onSubmit)}
            role="submit"
            type="primary"
            title="Create"
          />
        </Form>
      </div>
    </>
  );
};

export default RegisterPage;
