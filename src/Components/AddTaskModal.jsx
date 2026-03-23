import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";

const AddTaskModal = ({ isOpen, onClose, onSubmit, involvedUsers }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState(0);
  const [assignee, setAssignee] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setDescription("");
      setProgress(0);
      setAssignee("");
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

  const filteredUsers = involvedUsers.filter((user) =>
    user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = () => {
    if (!title || !description || !assignee) {
      toast.error("Please fill in all required fields (Title, Description, Assignee)");
      return;
    }
    if (!involvedUsers.includes(assignee)) {
      toast.error("Assignee must be a member of the current event.");
      return;
    }

    onSubmit({
      title,
      description,
      progress: Number(progress),
      assignee,
      counter: 0,
    });
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

        <h2 className="text-2xl font-semibold mb-6">Add New Task</h2>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Task Name
            </label>
            <input
              type="text"
              placeholder="Task name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Progress (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Progress"
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
              className="border border-gray-300 rounded w-full p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignee
            </label>
            <input
              type="text"
              placeholder="Search or select assignee"
              value={isDropdownOpen ? searchTerm : assignee}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setAssignee(e.target.value);
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <li
                      key={idx}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-gray-800"
                      onClick={() => {
                        setAssignee(user);
                        setSearchTerm(user);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {user}
                    </li>
                  ))
                ) : (
                  <li className="p-2 text-gray-500 text-sm">
                    No members found.
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
            Add task
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

export default AddTaskModal;
