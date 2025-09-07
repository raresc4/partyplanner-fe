import React from "react";
import { changePassword } from "../Actions/user";
import { toast } from "react-toastify";

export default function ChangePasswordModal({ isOpen, onClose, username }) {
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold mb-4">Change Password</h2>
          <div className="mb-4">
            <h1 className="text-m font-semibold py-2">
              Enter your old password:
            </h1>
            <input
              type="password"
              id="old-password"
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="mb-4">
            <h1 className="text-m font-semibold py-2">Enter new password:</h1>
            <input
              type="password"
              id="new-password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded-lg"
              onClick={() =>
                changePassword(username, oldPassword, newPassword)
                  .then(() => {
                    onClose();
                    toast.success("Password changed successfully");
                  })
                  .catch((err) => toast.error(err.message))
              }
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
