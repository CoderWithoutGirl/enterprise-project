import React, { useState, useEffect } from 'react';
import Form from '../components/form';
import InputField from "../components/inputField";
import Button from "../components/button";
import Table from "../components/table";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createDepartment, getAllDepartment } from '../apiServices';
import { toast } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';

const userTableHead = [
    "Name",
    "Description",
  ];


const departmentFormValidationSchema = yup.object({
    name: yup.string().required("Name must be filled").max(50),
    description: yup.string().required("Description must be filled").max(200),
});

function Departments() {

    const [departments, setDepartments] = useState([]);

    const loadDepartment = async () => {
        const { data } = await getAllDepartment();
        setDepartments(prev => data);
        console.log(data);
    }

    useEffect(() => {
        loadDepartment();
    }, []);

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


    const onSubmit = async (formData) => {
        console.log(formData);
        const { status, data } = await createDepartment(formData);
        if (status === 400) {
            toast.error(data.message)
        }
        else if (status === 201) {
            toast.success(data.message)
            reset({ name: "", description: "" })
        }
        else {
            toast.warning(data.message);
        }
    };

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
        </tr>
    );


    return (
        <>
            <div className="w-2/6 flex justify-center mx-auto my-20">
                <Form
                    title="Create Department"
                // action="#" 
                // method="POST"
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
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        role="submit"
                        type="primary"
                        title="Create"
                    />
                </Form>
            </div>
            <div>
                <Table
                    limit={20}
                    tableHead={userTableHead}
                    tableData={departments}
                    renderData={renderTableBody}
                    renderHead={renderTableHead}
                    tableTitle={"Deaprtment Table"}
                    // search={hangleSearch}
                />
            </div>
        </>
    )
}

export default Departments