import React from 'react';
import InputField from '../../components/inputField';
import Button from '../../components/button';
import { PencilAltIcon, XIcon } from "@heroicons/react/solid";


const Assign = ({ user, role, handleSubmit, setOpen}) => {

    return (
        <>
            <InputField
                type="text"
                name="role"
                value={role}
                disabled
            />
             <InputField
                type="text"
                name="department"
                value={user.department}
                disabled
            />
            <div className="w-full flex justify-between items-center">
                <Button
                    // onClick={update}
                    role="button"
                    type="primary"
                    title="Update"
                    icon={PencilAltIcon}
                    onClick={handleSubmit}

                />
                <Button
                    type="danger"
                    title="Cancel"
                    icon={XIcon}
                    onClick={(e) => {e.preventDefault();setOpen(false)}}
                />
            </div>
        </>
    );
}

export default Assign;