import React from 'react';
import Form from '../components/form';
import InputField from "../components/inputField";
import Button from "../components/button";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createDepartment } from '../apiServices';

const loginFormValidationSchema = yup.object({
    name: yup.string().required("Username must be filled"),
    description: yup.string().required("Password must be filled"),
});

function Departments() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(loginFormValidationSchema),
    });


    const onSubmit = async (formData) => {
        // console.log(formData);
        // const { status } = await createDepartment(formData)
        // if(status === 201) {
        // }
        console.log(formData);
        // const body = {
        //     "name": "Security2",
        //     "description": "Managemt accademic"
        // }
        await createDepartment(formData);

    };


    return (
        <>
            <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                            Create Departments
                        </h2>
                    </div>
                    <form className="mt-8 space-y-6" action="#" method="POST">
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
                    </form>
                </div>
            </div>
        </>
    )
}

export default Departments