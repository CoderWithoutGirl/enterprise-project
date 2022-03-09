import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import IdeaItem from "../components/IdeaItem";
import { filters } from "../constants/filter";
import { getAllIdeaWithFilter } from "../apiServices/index";
import {connect} from 'react-redux'

const HomePage = ({authenticateReducer}) => {
  const [pages, setPages] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [ideas, setIdeas] = useState([]);
  const [filterOption, setFilterOption] = useState(filters.ALPHABET);
  const {token} = authenticateReducer;

  const getAllIdeas = useCallback(async () => {
    const { data, status } = await getAllIdeaWithFilter(
      filterOption,
      currPage,
      token
    );
    if (status === 200) {
      setIdeas(data.data);
      setPages(data.pages);
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      })
    }
  }, [filterOption, currPage]);

  const nextPage = () => {
    setCurrPage(prev => prev + 1)
  }

  const prevPage = () => {
    setCurrPage(prev => prev - 1)
  }

  useEffect(() => {
    getAllIdeas();
  }, [getAllIdeas]);

  document.title = "Home";
  return (
    <div className="container max-w-xl md:max-w-screen-lg mx-auto">
      <div className="mx-auto">
        <h3 className="font-black text-gray-600 text-3xl">
          Your next favorite thing
        </h3>
        <ul className="px-5 py-2">
          {ideas.map((item, index) => (
            <IdeaItem
              title={item.title}
              description={item.description}
              key={index}
              id={item._id}
              category={item.category.name}
              commentCount={item.comments.length}
              like={
                item.reactions.filter(
                  (reaction) => reaction.actionType === "Like"
                ).length
              }
            />
          ))}
        </ul>
        <div className="w-full overflow-x-auto flex justify-center p-5">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              onClick={prevPage}
              disabled={currPage === 1}
              className={`${
                currPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
              } relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pages >= 1 &&
              [...Array(pages).keys()].map((page, index) => (
                <button
                  key={index}
                  onClick={() => setCurrPage(page + 1)}
                  aria-current="page"
                  className={`z-10 bg-indigo-50 ${
                    currPage === page + 1 && "border-indigo-500 text-indigo-600"
                  } inline-flex items-center px-4 py-2 border-2 text-sm font-medium`}
                >
                  {page + 1}
                </button>
              ))}
            <button
              onClick={nextPage}
              disabled={currPage === pages}
              className={`${
                currPage === pages ? "cursor-not-allowed" : "cursor-pointer"
              } relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50`}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

export default connect(mapStateToProps)(HomePage);
