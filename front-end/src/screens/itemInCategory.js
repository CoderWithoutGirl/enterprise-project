import React, { useCallback, useEffect, useState } from "react";
import { connect } from "react-redux";
import Table from "../components/table";
import { getNewToken } from "../store/actions/authenticateAction";
import { useParams } from "react-router-dom";
import {
  getSingleCategory,
  tokenRequestInterceptor,
} from "../apiServices";

const ideaTableHead = [
  "Title",
  "Author",
  "Created At",
  "View Count",
  "Number Of Comments",
  "Number Of Reactions",
  "Support Document",
];

const ItemInCategoryPage = ({ getNewTokenRequest, token }) => {

  const { category } = useParams();
  const [allIdeas, setAllIdeas] = useState([])

  document.title = `List Ideas In ${category} Department`;

  const loadIdeas = useCallback(async () => {
    const loadAllDataOfUser = async () => {
      const { data, status } = await getSingleCategory(category, "" ,token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfUser,
      getNewTokenRequest
    );
    if (status === 200) {
      setAllIdeas((prev) => data.data.ideas);
    }
  }, [token, getNewTokenRequest, category]);

  useEffect(() => {
    loadIdeas();
  }, [loadIdeas]);

  const hangleSearch = (keyword) => {
    if (keyword) {
      const search = async () => {
        const loadDataSearchSingleCate = async () => {
          const { data, status } = await getSingleCategory(
            category,
            keyword,
            token
          );
          return { data, status };
        };
        const { status, data } = await tokenRequestInterceptor(
          loadDataSearchSingleCate,
          getNewTokenRequest
        );
        if (status === 200) {
          setAllIdeas((prev) => data.data.ideas);
        }
      };
      search();
    } else {
      loadIdeas();
    }
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
        <div className="text-left">{item.title}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.user.fullname}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.createdAt}</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item.viewCount} Views</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item?.comments.length} Comments</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        <div className="text-left">{item?.reactions.length} Reactions</div>
      </td>
      <td className="p-2 whitespace-nowrap">
        {item?.documentLink && (
          <a
            className="bg-blue-400 text-white rounded-md px-3 py-1"
            target="_blank"
            rel="noreferrer"
            href={item?.documentLink || "#"}
          >
            Download
          </a>
        )}
      </td>
    </tr>
  );

  return (
    <div>
      <Table
        limit={20}
        tableHead={ideaTableHead}
        tableData={allIdeas}
        renderData={renderTableBody}
        renderHead={renderTableHead}
        tableTitle={`Category: ${category}`}
        search={hangleSearch}
      />
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ItemInCategoryPage);
