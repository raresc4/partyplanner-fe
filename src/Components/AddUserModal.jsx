import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getAllExcludingSome } from "../Actions/user";

const AddUserModal = ({ isOpen, onClose, onSubmit, involvedUsers }) => {
  const [selectedUser, setSelectedUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { data: availableUsers = [], isLoading, isError } = useQuery({
    queryKey: ["availableUsers", involvedUsers],
    queryFn: async () => {
      const data = await getAllExcludingSome(involvedUsers);
      // Backend returns an array of user objects: [{ id, username, ... }, ...]
      if (Array.isArray(data)) {
        return data
          .filter((user) => user && user.username)
          .map((user) => user.username);
      }
      return [];
    },
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedUser("");
      setSearchTerm("");
      setIsDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  if (!isOpen) return null;

  const filteredUsers = availableUsers.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!selectedUser) {
      toast.error("Please select a user to add.");
      return;
    }
    onSubmit(selectedUser);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md h-auto max-h-[90vh] overflow-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none text-2xl"
          onClick={onClose}
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6">Add New User</h2>

        <div className="space-y-4 mb-6">
          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search User
            </label>
            <input
              type="text"
              placeholder="Search available users"
              value={isDropdownOpen ? searchTerm : selectedUser}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedUser(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => {
                setSearchTerm("");
                setIsDropdownOpen(true);
              }}
              className="border border-gray-300 rounded w-full p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
            {isDropdownOpen && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-1 max-h-40 overflow-auto rounded shadow-lg">
                {isLoading ? (
                  <li className="p-2 text-gray-500 text-sm">Loading...</li>
                ) : isError ? (
                  <li className="p-2 text-red-500 text-sm">Error loading users.</li>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <li
                      key={idx}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      onClick={() => {
                        setSelectedUser(user);
                        setSearchTerm(user);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {user}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-sm">
                    No available users found.
                  </li>
                )}
              </ul>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-3">
          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex-1"
            onClick={handleSubmit}
          >
            Add user
          </button>
          <button
            className="bg-gray-200 text-black px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors flex-1"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUserModal;
