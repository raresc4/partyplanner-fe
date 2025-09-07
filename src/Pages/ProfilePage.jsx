import { useState } from "react";
import { useNavigate } from "react-router";
import TaskModal from "../Components/TaskModal";
import BaseLayout from "../Layouts/BaseLayout";
import ChangePasswordModal from "../Components/ChangePasswordModal";
import { datePipe } from "../Actions/datePipes";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserEvents } from "../Actions/event";
import { toast } from "react-toastify";
import { deleteUser } from "../Actions/user";

const ProfilePage = ({ loggedUser }) => {
  const [name, setName] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] =
    useState(false);

  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const openChangePasswordModal = () => setChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setChangePasswordModalOpen(false);

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events", loggedUser.username],
    queryFn: () => getUserEvents(loggedUser.username),
  });

  return (
    <div className="w-[100vw] h-[100vh] bg-white flex items-center justify-center bg-white">
      <BaseLayout>
        <div className="flex flex-1 items-center justify-center bg-white">
          <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-200 max-w-md w-full">
            <div className="flex flex-col items-center text-center mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {loggedUser.username}'s Profile
              </h2>
              <div className="space-y-3">
                <p className="text-gray-600">
                  <strong>Last Login:</strong> {datePipe(new Date(), "medium")}
                </p>
                <p className="text-gray-600">
                  <strong>Account Created:</strong>{" "}
                  {datePipe(loggedUser.accountCreationDate, "medium")}
                </p>
                <div>
                  <strong className="text-gray-700">Parties:</strong>
                  <ul className="list-disc ml-6 mt-2 text-gray-600">
                    {isLoading ? (
                      <li></li>
                    ) : events.length === 0 ? (
                      <li>No parties joined yet.</li>
                    ) : (
                      events.map((event, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between py-2 px-3 rounded-lg mb-2"
                        >
                          <span className="text-gray-700">{event.title}</span>
                          <button
                            className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer"
                            onClick={() => {
                              navigate(`/room/${event.title}`);
                            }}
                          >
                            Join
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg w-full transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer"
                  onClick={openModal}
                >
                  Create Party
                </button>
                <TaskModal
                  isOpen={isModalOpen}
                  onClose={closeModal}
                  loggedUser={loggedUser.username}
                />
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer"
                    onClick={openChangePasswordModal}
                  >
                    Change password
                  </button>
                  <ChangePasswordModal
                    isOpen={isChangePasswordModalOpen}
                    onClose={closeChangePasswordModal}
                    username={loggedUser.username}
                  />
                  <button
                    className="bg-black text-white px-4 py-2 rounded-lg  transition duration-200 hover:scale-110 hover:transition-all hover:cursor-pointer"
                    onClick={() => {
                      deleteUser(loggedUser.username)
                        .then(() => {
                          toast.success("Account deleted successfully");
                          navigate("/");
                        })
                        .catch((error) => {
                          toast.error(error.message);
                        });
                    }}
                  >
                    Delete account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </BaseLayout>
    </div>
  );
};

export default ProfilePage;
