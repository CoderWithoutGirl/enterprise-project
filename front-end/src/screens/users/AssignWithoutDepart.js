import React, { useCallback, useEffect, useState } from 'react'
import InputField from '../../components/inputField';
import Button from '../../components/button';

function AssignWithoutDepart({ setOpen, role, users, handleSubmit }) {

    const [selectedId, setSelectedId] = useState("");

    return (
        <>
            <InputField
                type="text"
                name="role"
                value={role}
                disabled
            />
            <select 
                className="border-1 rounded-lg w-full h-12 px-4"
                onChange={(e) => {
                    setSelectedId(e.target.value)
                    
                }}
            >
                {users.length &&
                    users.filter(user => user.role === 'Staff').map((item, index) => (
                        <option value={item.id} key={index}>
                            {item.fullname}
                        </option>
                    ))
                    
                }
            </select>
            
            <div className="w-3/5 flex flex-wrap justify-between items-center">
                <Button
                    // onClick={update}
                    role="button"
                    type="primary"
                    title="Update"
                    onClick={() => handleSubmit(selectedId)}

                />
                <Button
                    type="danger"
                    title="Cancel"
                    onClick={setOpen}
                />
            </div>
        </>
    )
}

export default AssignWithoutDepart