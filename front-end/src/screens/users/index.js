import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Button from "../../components/button";
import Table from "../../components/table";
import {
  tokenRequestInterceptor,
  getAllUser,
  searchUserByUsername,
  getSingleUser,
  uploadExcelCreateUser,
  confirmUserExcel,
  cancelUserExcel,
} from "../../apiServices";
import { getNewToken } from "../../store/actions/authenticateAction";
import Modal from "../../components/modal";
import RegisterPage from "./register";
import DetailPage from "./detail";
import { UploadIcon } from "@heroicons/react/solid";
import SpreadSheet from "react-spreadsheet";
import { toast } from "react-toastify";

const userTableHead = [
  "Fullname",
  "Username",
  "Email",
  "Role",
  "Address",
  "Department",
  "Action",
];

const UserPage = ({ getNewTokenRequest, token }) => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [openImport, setOpenImport] = useState(false);
  const [file, setFile] = useState({});
  const [data, setData] = useState([]);
  const [filename, setFilename] = useState("");

const UserPage = ({ getNewTokenRequest, token }) => {

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [valueAssign, setValueAssign] = useState({});

  const loadUser = async () => {
    const loadAllDataOfUser = async () => {
      const { data, status } = await getAllUser(token)
      return { data, status }
    }
    const { status, data } = await tokenRequestInterceptor(loadAllDataOfUser, getNewTokenRequest);
    if (status === 200) {
      setUsers((prev) => data);
    }
  }

  useEffect(() => {
    loadUser();
  }, [token]);

  const hangleSearch = (keyword) => {
    if (keyword) {
      const search = async () => {
        const loadAllDataOfSearchUser = async () => {
          const { data, status } = await searchUserByUsername(keyword, token);
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

  const detailHandler = (e, id) => {
    e.preventDefault();
    console.log(id);
    const loadSingleUser = async () => {
      const loadSingleUser = async () => {
        const { data, status } = await getSingleUser(token, id)
        console.log(data);
        return { data, status }
      }
      const { status, data } = await tokenRequestInterceptor(loadSingleUser, getNewTokenRequest);

      if (status === 200) {
        setUser((prev) => data);
      }
    }
    loadSingleUser();
    setOpenDetail(prev => !prev);
  }

  const editHandler = (e, id) => {
    e.preventDefault();
    console.log(id);
    const loadSingleUser = async () => {
      const loadSingleUser = async () => {
        const { data, status } = await getSingleUser(token, id)
        return { data, status }
      }
      const { status, data } = await tokenRequestInterceptor(loadSingleUser, getNewTokenRequest);
      console.log(data);
      if (status === 200) {
        // setUser((prev) => data);
        setValueAssign((prev) => data);
      }
    }
    loadSingleUser();
    setEditOpen(prev => !prev)
  }


  const assign = async (e) => {
    e.preventDefault();
    const assignStaffRequest = async () => {
      const { data, status } = await assignStaff({ role: roles.QA_COORDINATOR, department: valueAssign.department }, valueAssign.id, token);
      console.log(data);
      return { data, status }
    }

    const { status, data } = await tokenRequestInterceptor(assignStaffRequest, getNewTokenRequest);
    console.log(data)


    if (status === 200) {
      toast.success(data.message)
      setValueAssign((prev) => ({role: "", department: ""}));
      setEditOpen(prev => !prev)
      loadUser();
    }
  }
  };


  const uploadFile = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const handleUpload = async () => {
    const uploadExcelUser = async () => {
      const formData = new FormData();
      formData.append("file", file);
      const { data, status } = await uploadExcelCreateUser(formData, token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      uploadExcelUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setData(data.data);
    }
  };

  const handleCancel = async (e) => {
    const cancelCreateExcelUser = async () => {
      const { data, status } = await cancelUserExcel(filename, token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      cancelCreateExcelUser,
      getNewTokenRequest
    );
    if (status === 200) {
      toast.error("Cancel User Successfully");
      setOpenImport(false);
      setData([]);
      setFilename("");
    }
  };

  const handleCreateUser = async () => {
    const confirmCreateExcelUser = async () => {
      const { data, status } = await confirmUserExcel(filename, token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      confirmCreateExcelUser,
      getNewTokenRequest
    );
    if (status === 200) {
      toast.success("Create User Successfully");
      setOpenImport(false);
      setData([]);
      setFilename("");
    }
  };

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
        <div className="text-left">{item.role}</div>
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
          <Button type="secondary" title="Assign" onClick={(e) => editHandler(e, item.id)} />
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
        <RegisterPage loadUser={loadUser} />
      </Modal>
      <Modal open={openDetail} setOpen={setOpenDetail}>
        <DetailPage user={user} />
      </Modal>
      <Modal open={editOpen} setOpen={setEditOpen}>
        <div className="w-full">
          <Form
            title="Assign QA COORDINATOR"
          >
            <Assign user={valueAssign} role={roles.QA_COORDINATOR} handleSubmit={assign} setOpen={setEditOpen} />
          </Form>
        </div>
      </Modal>
      <Modal open={openImport} setOpen={setOpenImport}>
        <div className="flex justify-center mt-8">
          {data.length ? (
            <div className="lg:w-10">
              <SpreadSheet data={data} />
              <div className="flex justify-center p-2 space-x-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-white bg-red-500 rounded shadow-xl"
                >
                  Cannel
                </button>
                <button
                  onClick={handleCreateUser}
                  className="px-4 py-2 text-white bg-green-500 rounded shadow-xl"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <div className=" lg:w-1/2">
              {filename ? (
                <h2>{filename}</h2>
              ) : (
                <div className="m-10">
                  <label className="inline-block mb-2 text-gray-500">
                    Upload Excel File (.xlsx)
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col w-full h-32 border-4 border-dashed hover:bg-gray-100 hover:border-gray-300">
                      <div class="flex flex-col items-center justify-center pt-7">
                        <UploadIcon
                          width="100"
                          height="100"
                          className="text-gray-400"
                        />
                        <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                          Select a file
                        </p>
                      </div>
                      <input
                        type="file"
                        className="opacity-0"
                        onChange={uploadFile}
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-center p-2 space-x-4">
                <button
                  onClick={handleUpload}
                  className="px-4 py-2 text-white bg-green-500 rounded shadow-xl"
                >
                  Upload
                </button>
              </div>
            </div>
          )}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(UserPage);
