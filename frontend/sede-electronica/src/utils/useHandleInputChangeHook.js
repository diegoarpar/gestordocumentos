import { useState } from 'react';
import Files from "../files/files";

const useHandleInputChangeHook = () => {
    const [input, setInput] = useState({});

    const handleInputChange = (e) => setInput({
        ...input,
        [e.currentTarget.name]: e.currentTarget.value
    });

    return [input, handleInputChange]
};
export default useHandleInputChangeHook;