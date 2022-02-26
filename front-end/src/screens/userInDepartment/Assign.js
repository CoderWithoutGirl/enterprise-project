import React from 'react';
import InputField from '../../components/inputField';
import Button from '../../components/button';


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
            <div className="w-3/5 flex flex-wrap justify-between items-center">
                <Button
                    // onClick={update}
                    role="button"
                    type="primary"
                    title="Update"
                    onClick={handleSubmit}

                />
                <Button
                    type="danger"
                    title="Cancel"
                    onClick={(e) => {e.preventDefault();setOpen(false)}}
                />
            </div>
        </>
    );
}

export default Assign;