import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Appbar = ({ name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate(); // Hook for navigation

  const toggleList = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from local storage
    navigate("/signin"); // Redirect to signin page
  };

  return (
    <div className="shadow h-14 flex justify-between">
      <div className="flex flex-col justify-center h-full ml-4">
        PayTM App
      </div>
      <div className="flex">
        <div className="flex flex-col justify-center h-full mr-4">
          Hello
        </div>
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl">
            {name ? name[0].toUpperCase() : name}
          </div>
        </div>
        {/* Heroicon and dropdown */}
        <div className="relative flex self-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 cursor-pointer"
            onClick={toggleList}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25"
            />
          </svg>
          {isOpen && (
            <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
              <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
