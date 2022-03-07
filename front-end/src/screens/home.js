import { useCallback, useEffect, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import IdeaItem from "../components/IdeaItem";
import { filters } from "../constants/filter";
import { getAllIdeaWithFilter } from "../apiServices/index";

const HomePage = () => {
  const [pages, setPages] = useState(1);
  const [currPage, setCurrPage] = useState(1);
  const [ideas, setIdeas] = useState([]);
  const [filterOption, setFilterOption] = useState(filters.ALPHABET);

  const getAllIdeas = useCallback(async () => {
    const { data, status } = await getAllIdeaWithFilter(filterOption, currPage);
    if (status === 200) {
      setIdeas(data.data);
      setPages(data.pages);
    }
  }, [filterOption, currPage]);


  useEffect(() => {
    getAllIdeas();
  }, [getAllIdeas]);

  document.title = "Home";
  return (
    <div className="container max-w-xl md:max-w-screen-lg mx-auto">
      <div className="mx-auto my-10">
        <h3 className="font-black text-gray-600 text-3xl">
          Your next favorite thing
        </h3>
        <ul className="px-5 py-2">
          {ideas.map((item, index) => (
            <IdeaItem
              title={item.title}
              description={item.description}
              key={index}
              category={item.category.name}
              commentCount={item.comments.length}
              like={item.reactions.filter(reaction => reaction.actionType === 'Like').length}
            />
          ))}
        </ul>
        <div className="w-full overflow-x-auto flex justify-center p-5">
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            {pages >= 1 &&
              [...Array(pages).keys()].map((page, index) => (
                <button
                  key={index}
                  aria-current="page"
                  className={`z-10 bg-indigo-50 ${
                    currPage ===( page + 1) && "border-indigo-500 text-indigo-600"
                  } inline-flex items-center px-4 py-2 border-2 text-sm font-medium`}
                >
                  {page + 1}
                </button>
              ))
            }
            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
