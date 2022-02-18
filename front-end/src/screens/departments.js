import React, { useEffect } from 'react';
import Form from '../components/form';
import InputField from "../components/inputField";
import Button from "../components/button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createDepartment } from '../apiServices';
import { toast } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';


const departmentFormValidationSchema = yup.object({
    name: yup.string().required("Name must be filled").max(50),
    description: yup.string().required("Description must be filled").max(200),
});

function Departments() {

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
                {/* <form className="mt-8 space-y-6" action="#" method="POST">
                        <div className="rounded-md shadow-sm -space-y-px">
                            <div>
                                <label htmlFor="name" className="sr-only">
                                    Name
                                </label>
                                <input
                                    {...register("name")}
                                    type="text"
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="sr-only">
                                    Description
                                </label>
                                <input
                                    {...register("description")}
                                    type="text"
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    placeholder="Description"
                                />
                            </div>
                        </div>
                        <div>
                            <button
                                onClick={handleSubmit(onSubmit)}
                                type="submit"
                                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Create
                            </button>
                        </div>
                    </form> */}
            </div>
        </>
    )
}

export default Departments