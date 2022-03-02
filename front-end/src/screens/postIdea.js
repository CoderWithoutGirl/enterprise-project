import React, { useState, useEffect } from "react";
import {CKEditor} from '@ckeditor/ckeditor5-react'
import ClassicEditor from 'ckeditor5-custom-build/build/ckeditor';
import '../customLibStyle/ckeditor.css';

const PostIdea = () => {
  const [data, setData] = useState("<h2>Hello</h2>");

  const dataChangeHandler = (event, editor) => {
    const dataInEditor = editor.getData();
    console.log(dataInEditor);
    setData(dataInEditor);
  };

  return (
    <div className="pt-2">
      <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="p-6 bg-white border-b border-gray-200">
            <form method="POST" action="action.php">
              <div className="mb-4">
                <label className="text-xl text-gray-600">
                  Title <span className="text-red-500">*</span>
                </label>
                <br />
                <input
                  type="text"
                  className="border-2 border-gray-300 p-2 w-full"
                  name="title"
                  id="title"
                  value=""
                  required
                />
              </div>

              <div className="mb-4">
                <label className="text-xl text-gray-600">Description</label>
                <br />
                <input
                  type="text"
                  className="border-2 border-gray-300 p-2 w-full"
                  name="description"
                  id="description"
                  placeholder="(Optional)"
                />
              </div>

              <div className="mb-8 text-base">
                <label className="text-xl text-gray-600">Content</label>
                <br />
                <CKEditor editor={ClassicEditor} data={data} />
              </div>

              <div className="flex p-1">
                <button
                  className="p-3 bg-blue-500 text-white hover:bg-blue-400"
                  required
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostIdea;
