import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Button from "../../components/button";
import Table from "../../components/table";
import {
  tokenRequestInterceptor,
  getAllUser,
  searchUserByUsername,
} from "../../apiServices";
import {getNewToken} from '../../store/actions/authenticateAction';
import Modal from "../../components/modal";
import RegisterPage from "./register";

const userTableHead = [
  "Fullname",
  "Username",
  "Email",
  "Role",
  "Address",
  "Department",
  "Action",
];


const UserPage = ({getNewTokenRequest, token}) =>{

    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);

    const loadUser = async () => {
      const loadAllDataOfUser = async () => {
        const {data, status} = await getAllUser(token)
        return {data, status}
      }
      const {status, data} = await tokenRequestInterceptor(loadAllDataOfUser, getNewTokenRequest);
     if(status === 200) {
        setUsers((prev) => data);
     }
    }

    useEffect(()=>{
        loadUser();
    },[token]);

    const hangleSearch = (keyword) => {
      if (keyword) {
        searchUserByUsername(keyword)
          .then((res) => {
            setUsers(res.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        loadUser();
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
            <Button type="danger" title="Delete" />
          </div>
        </td>
      </tr>
    );

    return (
      <div>
        <Table
          limit={20}
          tableHead={userTableHead}
          tableData={users}
          renderData={renderTableBody}
          renderHead={renderTableHead}
          tableTitle={"User Table"}
          search={hangleSearch}
          createButtonHandler={() => setOpen(true)}
        />
        <Modal open={open} setOpen={setOpen}>
          <RegisterPage loadUser={loadUser}/>
        </Modal>
      </div>
    );
  };

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

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);