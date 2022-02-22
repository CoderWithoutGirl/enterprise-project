import React, { useState, useEffect } from 'react';
import Form from '../components/form';
import InputField from "../components/inputField";
import Button from "../components/button";
import Table from "../components/table";
import Modal from "../components/modal";
import { connect } from 'react-redux';
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {
    createDepartment,
    getAllDepartment,
    tokenRequestInterceptor,
    updateDepartment,
    findDepartmentByID,
    searchDepartByName
} from '../apiServices';
import { toast } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';
import { getNewToken } from '../store/actions/authenticateAction'

const userTableHead = [
    "Name",
    "Description",
    "Action"
];


const departmentFormValidationSchema = yup.object({
    name: yup.string().required("Name must be filled").max(50),
    description: yup.string().required("Description must be filled").max(200),
});

function Departments({ getNewTokenRequest, token }) {

    const [departments, setDepartments] = useState([]);
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [editDepartment, setEditDepartment] = useState({});

    const loadDepartment = async () => {
        const loadAllDataOfDepartment = async () => {
            const { data, status } = await getAllDepartment(token);
            return { data, status }
        }
        const { status, data } = await tokenRequestInterceptor(loadAllDataOfDepartment, getNewTokenRequest);
        if (status === 200) {
            setDepartments((prev) => data);
        }
    }

    useEffect(() => {
        loadDepartment();
    }, [token]);

    const hangleSearch =  async (name) => {
        const loadAllDataOfDepartment = async () => {
            const { data, status } = await searchDepartByName(name, token);
            return { data, status }
        }
        const { status, data } = await tokenRequestInterceptor(loadAllDataOfDepartment, getNewTokenRequest);
        console.log(data)
        if (status === 200) {
            setDepartments((prev) => data);
        }
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        setError,
        getValues,
        reset
    } = useForm({
        mode: 'onChange',
        resolver: yupResolver(departmentFormValidationSchema),
    });

    useEffect(() => {
        register("name")
        register("description")
    }, [register])

    const onChange = (e) => {
        setValue(e.target.name, e.target.value)
        setError(e.target.value, null);
    }
    const toggle = (e) => {
        e.preventDefault();
        setOpen(prev => !prev)
    }

    const onSubmit = async (formdata) => {
        const createDataofDepartment = async () => {
            const { status, data } = await createDepartment(formdata, token);
            return { data, status }
        }
        const { status, data } = await tokenRequestInterceptor(createDataofDepartment, getNewTokenRequest);
        if (status === 201) {
            toast.success("Create success")
            reset({ name: "", description: "" })
            setOpen(prev => !prev)
            loadDepartment();
        }
        else {
            toast.error(data.message)
        }
    };

    const update = async (e) => {
        e.preventDefault();
        const updateDepart = async () => {
            const { data, status } = await updateDepartment(editDepartment, editDepartment._id, token);
            console.log(data);
            return { data, status }
        }
        const { status, data } = await tokenRequestInterceptor(updateDepart, getNewTokenRequest);
        console.log(data)

        if (status === 200) {
            toast.success(data.message)
            setEditDepartment((prev) => data);
            loadDepartment();
            setEditOpen(prev => !prev);
        }
        // else {
        //     toast.error(data.message);
        // }
    }

    const editHandler = (e, _id) => {
        e.preventDefault();
        const getSingleDepartment = async () => {
            const loadAllDataOfDepartment = async () => {
                const { data, status } = await findDepartmentByID(token, _id);
                return { data, status }
            }
            const { status, data } = await tokenRequestInterceptor(loadAllDataOfDepartment, getNewTokenRequest);

            if (status === 200) {
                setEditDepartment((prev) => data.data);
            }
        }
        getSingleDepartment();
        setEditOpen(prev => !prev)
    }

    const onEditChange = (e) => {
        setEditDepartment(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const renderTableHead = (item, index) => (
        <th key={index} class="p-2 whitespace-nowrap">
            <div className="font-semibold text-left">{item}</div>
        </th>
    );

    const renderTableBody = (item, index) => (
        <tr key={index}>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{item.name}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="text-left">{item.description}</div>
            </td>
            <td className="p-2 whitespace-nowrap">
                <div className="flex justify-start">
                    <Button
                        type="warning"
                        title="Edit"
                        onClick={e => editHandler(e, item._id)}
                    />
                    <Button
                        type="danger"
                        title="Delete"
                    />
                </div>
            </td>
        </tr>
    );


    return (
        <div className="w-full my-20">
            <Table
                limit={20}
                tableHead={userTableHead}
                tableData={departments}
                renderData={renderTableBody}
                renderHead={renderTableHead}
                tableTitle={"Deaprtment Table"}
                createButtonHandler={() => setOpen(true)}
                search={hangleSearch}
            />

            <Modal open={editOpen} setOpen={setEditOpen}>
                <div className="w-full">
                    <Form
                        title="Update Department"
                    >
                        <InputField
                            type="text"
                            placeholder="Description"
                            name="description"
                            value={editDepartment?.description}
                            onChange={onEditChange}
                            // value={getValues('description')}
                            // onChange={onChange}

                        />
                        <div className="w-3/5 flex flex-wrap justify-between items-center">
                            <Button
                                // onClick={update}
                                onClick={update}
                                role="submit"
                                type="primary"
                                title="Update"
                            />
                            <Button
                                type="danger"
                                title="Cancel"
                                onClick={editHandler}
                                // onClick={handleSubmit(editHandler)}
                            />
                        </div>
                    </Form>
                </div>
            </Modal>

            <Modal open={open} setOpen={setOpen}>
                <div className="w-full">
                    <Form
                        title="Create Department"
                    >
                        <InputField
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={getValues('name')}
                            onChange={onChange}
                        />
                        <ErrorMessage
                            errors={errors}
                            name="name"
                            render={({ message }) => <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                role="alert"
                            >
                                <span className="block sm:inline">
                                    {message}
                                </span>
                            </div>}
                        />
                        <InputField
                            type="text"
                            placeholder="Description"
                            name="description"
                            value={getValues('description')}
                            onChange={onChange}
                        />
                        <ErrorMessage
                            errors={errors}
                            name="description"
                            render={({ message }) => <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                                role="alert"
                            >
                                <span className="block sm:inline">
                                    {message}
                                </span>
                            </div>}
                        />
                        <div className="w-3/5 flex flex-wrap justify-between items-center">
                            <Button
                                onClick={handleSubmit(onSubmit)}
                                role="submit"
                                type="primary"
                                title="Create"
                            />
                            <Button
                                type="danger"
                                title="Cancel"
                                onClick={toggle}
                            />
                        </div>

                    </Form>
                </div>
            </Modal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        token: state.authenticateReducer.token
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getNewTokenRequest: () => dispatch(getNewToken())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Departments);