import { useState } from "react";
import Button from "./button";
import Modal from "./modal";
import {
    PencilAltIcon,
    XCircleIcon,
} from "@heroicons/react/solid";

const Submission = ({ description, ...rest }) => {
    const [open, setOpen] = useState(false);
    return (
        <Modal open={open} setOpen={setOpen}>
            <div className="w-screen sm:max-w-lg">
                <div class="flex justify-between items-start p-5 rounded-t border-b dark:border-gray-600">
                    <h3 class="text-xl font-semibold text-gray-900 lg:text-2xl">
                        Terms & Conditions
                    </h3>
                </div>

                <div class="p-6 space-y-6 max-h-[28rem] overflow-y-auto">
                    <p class=" text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        {description}
                    </p>
                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        {...rest}
                    </p>
                    <p class="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                        {...rest}
                    </p>
                </div>

                <div class="flex items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                    <Button icon={PencilAltIcon} type="danger" title="Accept" />
                    <Button icon={XCircleIcon} type="secondary" title="Cancel" />
                </div>
            </div>
        </Modal>
    )
}

export default Submission;