import React, { useCallback, useEffect, useRef, useState } from "react";
import {useForm} from 'react-hook-form';
import {connect} from 'react-redux'
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "ckeditor5-custom-build/build/ckeditor";
import "../customLibStyle/ckeditor.css";
import {tokenRequestInterceptor, getCategory, createIdea, uploadSupportDocument, uploadEditorContent} from '../apiServices/index'
import {getNewToken} from '../store/actions/authenticateAction'
import Form from "../components/form";
import Button from "../components/button";
import InputField from "../components/inputField";
import TextArea from "../components/text-area";
import SelectOption from "../components/SelectOption";
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import {
  DocumentAddIcon,
  SwitchHorizontalIcon,
  DocumentIcon,
  XIcon,
} from "@heroicons/react/solid";
import FileUpload from "../components/fileUpload";
import { ErrorMessage } from "@hookform/error-message";
import ErrorMessageCustom from "../components/errorMessage";
import {toast} from 'react-toastify'
import TermAndCondition from '../components/submission';

const ideaSubmitValidateSchema = yup.object().shape({
  title: yup.string().required("Title cannot be empty"),
  description: yup.string().required("Description cannot be empty"),
})

const PostIdea = ({ authenticateReducer, getNewTokenRequest }) => {
  const [switchUpload, setSwitchUpload] = useState(true);
  const [file, setFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [agree, setAgree] = useState(false);
  const [termOpen, setTermOpen] = useState(false);
  const [editorData, setEditorData] = useState();
  const {formState: {errors}, handleSubmit, register, getValues, setValue, reset} = useForm({
    resolver: yupResolver(ideaSubmitValidateSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      category: '',
    }
  })
  const { token } = authenticateReducer;

  const getAllCategory = useCallback(async () => {
    const loadAllDataOfCategory = async () => {
      const { data, status } = await getCategory(token);
      return { data, status };
    };
    const { status, data } = await tokenRequestInterceptor(
      loadAllDataOfCategory,
      getNewTokenRequest
    );
    if (status === 200) {
      setCategories((prev) => data);
      setValue("category", data[0].name);
    }
  }, [token, getNewTokenRequest]);

  useEffect(() => {
    getAllCategory()
  }, [getAllCategory])


  const handleSwitch = (e) => {
    e.preventDefault();
    if (!switchUpload) {
      document.querySelector(".ck-toolbar").remove();
    }
    setSwitchUpload(!switchUpload);
  };

  const handleUpload = (e) => {
    console.log(e.target.files[0]);
    setFile(e.target.files[0]);
  };

  const createFile = async () => {
    const blob = new Blob([editorData], {type: 'text/markdown'});
    const file = new File([blob], `content.md`, {type: 'text/markdown'})
    let formData = new FormData();
    formData.append("editor-content", file);
    const {data, status} = await uploadEditorContent(formData, token);
    if(status === 201) {
      return data.documentLink;
    }
  }

  const submitIdeaHandler = async (formData) => {
    let documentLink;
    if(file) {
      const documentUpload = new FormData();
      documentUpload.append('document', file);
      const {data, status} = await uploadSupportDocument(documentUpload, token);
      if(status === 201) {
        documentLink = data.documentLink;
      }
    }
    if(editorData) {
      documentLink = await createFile();
    }
    let ideaSubmitBody = { ...formData, documentLink };
    console.log(ideaSubmitBody);
    const uploadIdea = await createIdea(ideaSubmitBody, token);
    if (uploadIdea.status === 201) {
      toast.success(uploadIdea.data.message);
      reset();
      setValue("category", categories[0].name);
      setFile(null);
      setEditorData("");
      setAgree(false);
    }
  }

  const removeFile = (e) => {
    setFile(null);
  };

  return (
    <div className="w-screen md:max-w-4xl mx-auto my-20">
      <TermAndCondition open={termOpen} setOpen={setTermOpen} />
      <Form title="Contribute Idea">
        <div className="w-full flex justify-end">
          <Button
            type={switchUpload ? `primary` : `success`}
            onClick={handleSwitch}
            title={`${switchUpload ? "Editor" : "Upload Document"}`}
            icon={SwitchHorizontalIcon}
            disabled={file ? true : false}
          />
        </div>
        <InputField
          {...register("title")}
          type="text"
          placeholder="Idea Title"
        />
        <ErrorMessage
          name="title"
          errors={errors}
          render={({ message }) => <ErrorMessageCustom message={message} />}
        />
        <div className="w-full h-fit flex-col items-start">
          <label htmlFor="category-dropdown">Category:</label>
          <div className="h-3"></div>
          <SelectOption
            id="category-dropdown"
            {...register("category")}
            defaultValue={getValues("category")}
            listData={categories}
          />
        </div>
        <TextArea
          {...register("description")}
          rows={5}
          placeholder="Idea Description"
        />
        <ErrorMessage
          name="description"
          errors={errors}
          render={({ message }) => <ErrorMessageCustom message={message} />}
        />

        {switchUpload ? (
          <div className="w-full flex flex-col justify-start align-top">
            <span className="text-lg">Upload Document:</span>
            {file ? (
              <div className="flex justify-start items-center bg-gray-400 w-fit p-2 rounded-md">
                <DocumentIcon className="h-7 w-7 text-gray-200" />
                <span className="text-lg font-bold ">{file.name}</span>
                <XIcon
                  className="h-5 w-5 text-white cursor-pointer"
                  onClick={removeFile}
                />
              </div>
            ) : (
              <FileUpload
                onChange={handleUpload}
                accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              />
            )}
          </div>
        ) : (
          <div className="ck-editor">
            <CKEditor
              editor={ClassicEditor}
              data={editorData}
              onReady={(editor) => {
                editor.ui
                  .getEditableElement()
                  .parentElement.insertBefore(
                    editor.ui.view.toolbar.element,
                    editor.ui.getEditableElement()
                  );
              }}
              onChange={(event, editor) => setEditorData((editor.getData()))}
            />
          </div>
        )}
        <div className="w-full flex justify-start items-center gap-2">
          <input
            type="checkbox"
            defaultChecked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            By checking this checkbox, you had agreed with our{" "}
            <span
              onClick={() => setTermOpen(true)}
              className="border-2 border-transparent cursor-pointer text-blue-500 py-1 hover:border-b-blue-500"
            >
              Terms & Conditions
            </span>
          </span>
        </div>
        <div className="flex p-1">
          <Button
            type="primary"
            role="button"
            title="Submit Idea"
            onClick={handleSubmit(submitIdeaHandler)}
            icon={DocumentAddIcon}
            disabled={!agree}
          />
        </div>
      </Form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    authenticateReducer: state.authenticateReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getNewTokenRequest: () => dispatch(getNewToken()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostIdea);
