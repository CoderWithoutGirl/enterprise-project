import {
  UploadIcon,
} from "@heroicons/react/solid";
const FileUpload = ({ ...rest }) => {
  return (
    <>
      <input id="file" className="hidden" type="file" {...rest} />
      <label htmlFor="file" className="bg-gray-500 cursor-pointer flex gap-1 sm:gap-2 items-center h-fit text-white rounded-md font-semibold px-[10px] py-[7px] sm:px-4 sm:py-3 w-fit">
        <UploadIcon className="h-5 w-5" />
        Attachment
      </label>
    </>
  );
};

export default FileUpload;
