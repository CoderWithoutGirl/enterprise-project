import React, {useCallback, useEffect, useState} from "react";
import { connect } from "react-redux";
import Button from "../../components/button";
import Table from "../../components/table";
import { getNewToken } from "../../store/actions/authenticateAction";
import {useParams} from 'react-router-dom'
import { toast } from "react-toastify";
import { getUserByDepartment, tokenRequestInterceptor,getSingleUser, assignStaff, deleteUser, reactiveUser } from "../../apiServices";
import { roles } from "../../constants/role";
import Modal from "../../components/modal";
import Form from "../../components/form";
import Assign from './Assign'
import {
  IdentificationIcon,
  BackspaceIcon,
  PencilAltIcon,
  RefreshIcon
} from "@heroicons/react/solid";
import Detail from '../users/detail';


const userTableHead = [
  "Fullname",
  "Username",
  "Email",
  "Role",
  "Address",
  "Department",
  "Actions",
];

const UserInDepartmentPage = ({ getNewTokenRequest, token }) => {

  const [users, setUsers] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [valueAssign, setValueAssign] = useState({});
    const [openDetail, setOpenDetail] = useState(false);
    const [user, setUser] = useState({});

  const {department} = useParams();

  document.title=`List User of ${department} Department`;

  const loadUser = useCallback(async () => {
    const loadAllDataOfUser = async () => {
      const { data, status } = await getUserByDepartment(token, department);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setUsers((prev) => data);
    }
  }, [token, getNewTokenRequest, department]);

  const hangleSearch = (keyword) => {
    if (keyword) {
      const search = async () => {
        const loadAllDataOfSearchUser = async () => {
          const { data, status } = await getUserByDepartment(token, department, keyword);
          return { data, status };
        };
        const { status, data } = await tokenRequestInterceptor(
          loadAllDataOfSearchUser,
          getNewTokenRequest
        );
        if (status === 200) {
          setUsers((prev) => data);
        }
      };
      search();
    } else {
      loadUser();
    }
  };

  useEffect(() => {loadUser()} , [loadUser]);

   const editHandler = (e, id) => {
     e.preventDefault();
     console.log(id);
     const loadSingleUser = async () => {
       const loadSingleUser = async () => {
         const { data, status } = await getSingleUser(token, id);
         return { data, status };
       };
       const { status, data } = await tokenRequestInterceptor(
         loadSingleUser,
         getNewTokenRequest
       );
       console.log(data);
       if (status === 200) {
         // setUser((prev) => data);
         setValueAssign((prev) => data);
       }
     };
     loadSingleUser();
     setEditOpen((prev) => !prev);
   };

   const activeAccountHandler = async (e, id) => {
     e.preventDefault();
     const activeUser = async () => {
       const reactiveUserAccount = async () => {
         const { data, status } = await reactiveUser(token, id);
         return { data, status };
       };
       const { status } = await tokenRequestInterceptor(
         reactiveUserAccount,
         getNewTokenRequest
       );

       if (status === 200) {
         toast.error("Deleted User Successfully");
         loadUser();
       }
     };
     activeUser();
   };

  const assign = async (e) => {
    e.preventDefault();
    const assignStaffRequest = async () => {
      const { data, status } = await assignStaff(
        { role: roles.QA_COORDINATOR, department: valueAssign.department },
        valueAssign.id,
        token
      );
      console.log(data);
      return { data, status };
    };

    const { status, data } = await tokenRequestInterceptor(
      assignStaffRequest,
      getNewTokenRequest
    );
    if (status === 200) {
      toast.success(data.message);
      setValueAssign((prev) => ({ role: "", department: "" }));
      setEditOpen((prev) => !prev);
      loadUser();
    }
    else {
       toast.error(data.message);
    }
  };

  const detailHandler = (e, id) => {
    e.preventDefault();
    console.log(id);
    const loadSingleUser = async () => {
      const loadSingleUser = async () => {
        const { data, status } = await getSingleUser(token, id);
        console.log(data);
        return { data, status };
      };
      const { status, data } = await tokenRequestInterceptor(
        loadSingleUser,
        getNewTokenRequest
      );

      if (status === 200) {
        setUser((prev) => data);
      }
    };
    loadSingleUser();
    setOpenDetail((prev) => !prev);
  };

  const deleteHandler = (e, id) => {
    e.preventDefault();
    const dectiveUser = async () => {
      const deletedUser = async () => {
        const { data, status } = await deleteUser(token, id);
        return { data, status };
      };
      const { status } = await tokenRequestInterceptor(
        deletedUser,
        getNewTokenRequest
      );

      if (status === 200) {
        toast.error("Deleted User Successfully");
        loadUser();
      }
    };
    dectiveUser();
  };


  const renderTableHead = (item, index) => (
    <th key={index} className="p-2 whitespace-nowrap">
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
        <div className="text-left">{item.fullname}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.username}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.email}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.role}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.address}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.department}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="flex gap-3">
          <Button
            icon={PencilAltIcon}
            type="secondary"
            title="Assign"
            onClick={(e) => editHandler(e, item.id)}
          />
          <Button
            onClick={(e) => detailHandler(e, item.id)}
            icon={IdentificationIcon}
            type="warning"
            title="Detail"
          />
          {item.deleted ? (
            <Button
              onClick={(e) => activeAccountHandler(e, item.id)}
              icon={RefreshIcon}
              type="success"
              title="Reactive"
            />
          ) : (
            <Button
              onClick={(e) => deleteHandler(e, item.id)}
              icon={BackspaceIcon}
              type="danger"
              title="Deactive"
            />
          )}
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
      />
      <Modal open={editOpen} setOpen={setEditOpen}>
        <div className="w-full">
          <Form title="Assign QA COORDINATOR">
            <Assign
              user={valueAssign}
              role={roles.QA_COORDINATOR}
              handleSubmit={assign}
              setOpen={setEditOpen}
            />
          </Form>
        </div>
      </Modal>
      <Modal open={openDetail} setOpen={setOpenDetail}>
        <Detail user={user} />
      </Modal>
    </div>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(UserInDepartmentPage);
