import React, { useCallback, useEffect, useState } from "react";
import Form from "../components/form";
import InputField from "../components/inputField";
import Button from "../components/button";
import Table from "../components/table";
import Modal from "../components/modal";
import { connect } from "react-redux";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  createCategory,
  getCategory,
  searchCategoryByName,
  updateCategory,
  tokenRequestInterceptor,
  findCategoryByID,
} from "../apiServices";
import { PencilAltIcon, BackspaceIcon, XCircleIcon,
  PlusCircleIcon } from "@heroicons/react/solid";

import { toast } from "react-toastify";
import ErrorMessageCustom from "../components/errorMessage";
import { ErrorMessage } from "@hookform/error-message";
import { getNewToken } from "../store/actions/authenticateAction";

const categoryFormValidationSchema = yup.object({
  name: yup.string().required("Name must be filled").max(50),
  description: yup.string().required("Description must be filled").max(200),
});

const customerTableHead = [
  "Id",
  "Name",
  "Description",
  "Created At",
  "Updated At",
  "Actions",
];

function Categories({ getNewTokenRequest, token }) {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editCategory, setEditCategory] = useState({});

  const fetchData = useCallback(async () => {
    const loadAllDataOfCategory = async () => {
      const { data, status } = await getCategory(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfCategory,
      getNewTokenRequest
    );
    if (status === 200) {
      setCategories((prev) => data.data);
    }
  }, [token, getNewTokenRequest]);

  console.log(categories);
  useEffect(() => {
    fetchData();
    document.title = "Categories";
  }, [fetchData]);

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
    resolver: yupResolver(categoryFormValidationSchema),
  });

  useEffect(() => {
    register("name");
    register("description");
  }, [register]);

  const onChange = (e) => {
    setValue(e.target.name, e.target.value);
    setError(e.target.value, null);
  };

  const toggle = (e) => {
    e.preventDefault();
    setOpen((prev) => !prev);
  };

  const onSubmit = async (formdata) => {
    const createDataofCategory = async () => {
      const { status, data } = await createCategory(formdata, token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      createDataofCategory,
      getNewTokenRequest
    );
    if (status === 201) {
      toast.success("Create success");
      reset({ name: "", description: "" });
      setOpen((prev) => !prev);
      fetchData();
    } else {
      toast.error(data.message);
    }
  };

  const update = async (e) => {
    e.preventDefault();
    const updateCate = async () => {
      const { data, status } = await updateCategory(
        editCategory,
        editCategory._id,
        token
      );
      console.log(data);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      updateCate,
      getNewTokenRequest
    );
    console.log(data);

    if (status === 200) {
      toast.success(data.message);
      setEditCategory((prev) => data);
      fetchData();
      setEditOpen((prev) => !prev);
    }
  };

  const editHandler = (e, _id) => {
    e.preventDefault();
    console.log(_id);
    const getSingleCategory = async () => {
      const loadAllDataOfCategory = async () => {
        const { data, status } = await findCategoryByID(token, _id);
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        loadAllDataOfCategory,
        getNewTokenRequest
      );

      if (status === 200) {
        setEditCategory((prev) => data.data);
      }
    };
    getSingleCategory();
    setEditOpen((prev) => !prev);
  };

  const onEditChange = (e) => {
    setEditCategory((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSearch = (keyword) => {
    if (keyword) {
      searchCategoryByName(keyword)
        .then((res) => {
          setCategories(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      fetchData();
    }
  };

  const renderTableHead = (item, index) => (
    <th key={index} class="p-2 whitespace-nowrap">
      <div
        className={`font-semibold ${
          item.toLowerCase() === "actions" ? "text-center" : "text-left"
        }`}
      >
        {item}
      </div>
    </th>
  );

  const renderTableBody = (item, index) => (
    <tr key={index}>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{index + 1}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.name}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.description}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.createdAt.slice(0, 10)}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.updatedAt.slice(0, 10)}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left flex justify-center gap-3 w-fit">
          <Button
            icon={PencilAltIcon}
            type="primary"
            title="Edit"
            onClick={(e) => editHandler(e, item._id)}
          />
          <Button icon={BackspaceIcon} type="danger" title="Delete" />
        </div>
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full">
        <Table
          limit={10}
          tableHead={customerTableHead}
          tableData={categories}
          renderData={renderTableBody}
          renderHead={renderTableHead}
          tableTitle={"List Category"}
          createButtonHandler={() => setOpen(true)}
          search={handleSearch}
        />

        <Modal open={editOpen} setOpen={setEditOpen}>
          <div className="w-screen sm:max-w-lg">
            <Form title="Update Category">
              <InputField
                type="text"
                placeholder="Description"
                name="description"
                value={editCategory?.description}
                onChange={onEditChange}
              />
              <div className="w-3/5 flex flex-wrap justify-between items-center">
                <Button
                  onClick={update}
                  role="submit"
                  icon={PencilAltIcon}
                  type="primary"
                  title="Update"
                />
                <Button icon={XCircleIcon} type="danger" title="Cancel" onClick={editHandler} />
              </div>
            </Form>
          </div>
        </Modal>

        <Modal open={open} setOpen={setOpen}>
          <div className="w-screen sm:max-w-lg">
            <Form title="Create Category">
              <InputField
                type="text"
                placeholder="Name"
                name="name"
                value={getValues("name")}
                onChange={onChange}
              />
              <ErrorMessage
                name="name"
                errors={errors}
                render={({ message }) => (
                  <ErrorMessageCustom message={message} />
                )}
              />
              <InputField
                type="text"
                placeholder="Description"
                name="description"
                value={getValues("description")}
                onChange={onChange}
              />
              <ErrorMessage
                name="description"
                errors={errors}
                render={({ message }) => (
                  <ErrorMessageCustom message={message} />
                )}
              />
              <div className="w-3/5 flex flex-wrap justify-between items-center">
                <Button
                  onClick={handleSubmit(onSubmit)}
                  role="submit"
                  type="primary"
                  title="Create"
                  icon={PlusCircleIcon}
                />
                <Button icon={XCircleIcon} type="danger" title="Cancel" onClick={toggle} />
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.authenticateReducer.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Categories);
