import React, { useEffect, useState } from 'react';
import Form from '../components/form';
import InputField from "../components/inputField";
import Button from "../components/button";
import Table from "../components/table";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCategory,getCategory } from '../apiServices';
import { toast } from 'react-toastify';
import { ErrorMessage } from '@hookform/error-message';



const categoryFormValidationSchema = yup.object({
    name: yup.string().required("Name must be filled").max(50),
    description: yup.string().required("Description must be filled").max(200),
});

const customerTableHead = [
    "Id",
    "Name",
    "Description",
    "Created Day",
    "Updated Day",
  ];

function Categories() {
    const [data, setData] = useState(null);
    const [open, setOpen] = useState(false);

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
        resolver: yupResolver(categoryFormValidationSchema),
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
        const { status, data } = await createCategory(formData);
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

    const [post, setPost] = React.useState(null);

    const fetchData = async () => {
        try {
            const apiRes = await getCategory();
            return apiRes.data.data;
        } catch (error) {
            console.log("Fetch failed", error.message);
        }
    }

    React.useEffect( async () => {
       const getData = await fetchData();
       await setData(getData);
    }, []);
    
    // async function hello() { 
    //     const dataTest = await fetchData();
    //     console.log(dataTest.data.data);
    //     const getData = dataTest.data.data;
    //     return getData;
    // };

    // React.useEffect(() => {
    //     hello();
    //  }, []);
 
    
    
    
    const searchByNameExample = (searchParam) => {
        if (searchParam !== "") {
        const filtering = data.filter((item) => item.name.includes(searchParam));
        console.log(searchParam);
        console.log(filtering);
        setData(filtering);
        } else {
        setData(data);
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
            <div className="text-left">{item.id}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.name}</div>
        </td>
        <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.description}</div>
        </td>
        {/* <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.cr}</div>
        </td> */}
    
        </tr>
    );



    

        
    return (
        <>
            <div className="w-2/6 flex justify-center mx-auto my-20">
                <Table
                    search={searchByNameExample}
                    limit={10}
                    tableHead={customerTableHead}
                    tableData={data}
                    renderData={renderTableBody}
                    renderHead={renderTableHead}
                    tableTitle={"Test Table"}
                />
                <Form
                    title="Create Category"
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
        </>
    )
}

export default Categories;