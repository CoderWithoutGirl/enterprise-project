import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import Button from "../../components/button";
import Table from "../../components/table";
import {
  tokenRequestInterceptor,
  getAllUser,
  searchUserByUsername,
  getSingleUser
} from "../../apiServices";
import {getNewToken} from '../../store/actions/authenticateAction';
import Modal from "../../components/modal";
import RegisterPage from "./register";
import DetailPage from "./detail";

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
    const [user, setUser] = useState({});
    const [open, setOpen] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);

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
        const search = async () => {
          const loadAllDataOfSearchUser = async () => {
            const {data, status} = await searchUserByUsername(keyword,token)
            return {data, status}
          }
          const {status, data} = await tokenRequestInterceptor(loadAllDataOfSearchUser, getNewTokenRequest);
         if(status === 200) {
            setUsers((prev) => data);
         }
        }
        search();
      } else {
        loadUser();
      }
    };

    const detailHandler = (e, id)=>{
      e.preventDefault();
      console.log(id);
      const loadSingleUser = async () =>{
        const loadSingleUser = async () => {
          const {data, status} = await getSingleUser(token,id)
          console.log(data);
          return {data, status}
        }
        const {status, data} = await tokenRequestInterceptor(loadSingleUser, getNewTokenRequest);
  
        if(status === 200) {
            setUser((prev) => data);
        }
      }
      loadSingleUser();
      setOpenDetail(prev => !prev);
    }

    const renderTableHead = (item, index) => (
      <th key={index} className="p-2 whitespace-nowrap">
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
            <Button type="warning" title="Detail" onClick={(e) => detailHandler(e, item.id)} />
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
        <Modal open={openDetail} setOpen={setOpenDetail}>
          <DetailPage user={user} />
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