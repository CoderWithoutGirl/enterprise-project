import React, {useState, useEffect} from 'react';
import Button from "../components/button";
import Form from "../components/form";
import InputField from "../components/inputField";
import Table from "../components/table";
import { getAllUser, searchUserByUsername } from "../apiServices/user";

const userTableHead = [
    "Fullname",
    "Username",
    "Email",
    "Role",
    "Address",
    "Department",
    "Action",
  ];


const UserPage = () =>{

    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState("");

    const loadUser = async () => {
      const {data} = await getAllUser();
      setUsers(prev => data);
      console.log(data);
  }

    useEffect(()=>{
        loadUser();
    },[]);

    useEffect(()=>{
      if(keyword.length === 0 ){
        loadUser();
      }
  },[keyword]);
   

    const hangleSearch = (e) => {
      e.preventDefault();
      searchUserByUsername({username:keyword}).then((res)=>{
          setUsers(res.data);
      }).catch((err)=>{
        console.log(err);
      });
    }

    const renderTableHead = (item, index) => (
        <th key={index} class="p-2 whitespace-nowrap">
          <div className="font-semibold text-left">{item}</div>
        </th>
      );
    
      const renderTableBody = (item, index) => (
        <tr key={index}>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.fullname}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.username}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.email}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.roles}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.address}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left">{item.department}</div>
          </td>
          <td className="p-2 whitespace-nowrap">
            <div className="text-left flex justify-around">
              <Button type="warning" title="Edit" />
              <Button type="danger" title="Delete"  />
            </div>
          </td>
        </tr>
    );

    return (
        <div>
          <div className="w-1/5 ml-5 my-10">
              <form>
                <div class="flex items-center">
                  <InputField type="text" className="mr-5 border-1 rounded-lg py-3" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Insert Username" />
                  <Button  type="primary" title="Search" onClick={hangleSearch} />
                </div>
              </form>
            </div>
           <Table
            limit={20}
            tableHead={userTableHead}
            tableData={users}
            renderData={renderTableBody}
            renderHead={renderTableHead}
            tableTitle={"User Table"}
            />
        </div>
    );
}

export default UserPage;