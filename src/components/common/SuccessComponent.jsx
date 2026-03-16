import React, { useState } from 'react';
import { MdOutlineClose } from 'react-icons/md';

const SuccessComponent = ({ message }) => {
    const [visible, setVisible] = useState(true);
    if (!message) return null;
    if (!visible) return null;

    return (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4 flex justify-between max-w-6xl mx-auto' role="alert">
            <span>{message}</span>
            <button
                onClick={() => setVisible(false)}
            >
                <MdOutlineClose size={20} />
            </button>
        </div>
    );
};

export default SuccessComponent;