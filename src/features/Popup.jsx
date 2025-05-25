import React from 'react';
import check from '../assets/check.png';
import PropTypes from 'prop-types';

const Popup = ({ message, onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                    className="sm:h-12 sm:w-12 h-10 w-10 text-center mx-auto"
                    src={check}
                    alt="Check"
                ></img>
                <p className="text-sm sm:text-lg text-gray-700 font-semibold mb-4 mt-2 ">
                    {message}
                </p>
                <button
                    onClick={onClose}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 sm:text-base text-sm"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

Popup.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};
export default Popup;

//NOTE: Popup Implementation
/*

import Popup from '../features/Popup';

const [isPopupVisible, setIsPopupVisible] = useState(false);
const [popupMessage, setPopupMessage] = useState('');

setPopupMessage('Contest Updated successfully!');
setIsPopupVisible(true);

const closePopup = () => {
    setIsPopupVisible(false); // Hide the popup
};

{isPopupVisible && (
    <Popup
        message={popupMessage}
        onClose={closePopup}
    />
)}

*/
