import { useParams } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { getMonth } from "../Actions/utils";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getEvent, updateEvent, deleteEvent } from "../Actions/event";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../Components/AddTaskModal";
import AddUserModal from "../Components/AddUserModal";

export default function EventPage({ loggedUser }) {
  const { name } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const getTime = (hour) => {
    if (hour > 12) {
      return `${hour - 12}:00 PM`;
    } else {
      return `${hour}:00 AM`;
    }
  };

  const {
    data: event,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["event", name],
    queryFn: () => getEvent(name),
  });

  const { mutate: updateEventMutation } = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries(["event", name]);
    },
  });

  const { mutate: deleteEventMutation } = useMutation({
    mutationFn: () => deleteEvent(name),
    onSuccess: () => {
      toast.success("Event deleted successfully!");
      queryClient.invalidateQueries(["events"]);
      navigate("/profile");
    },
    onError: (error) => {
      console.error("Error deleting event:", error);
      toast.error("Failed to delete event. Please try again.");
    },
  });

  const updateTaskProgress = (taskIndex, newProgress) => {
    if (newProgress < 0 || newProgress > 100) return;
    queryClient.setQueryData(["event", name], (oldData) => ({
      ...oldData,
      tasks: oldData.tasks.map((task, index) =>
        index === taskIndex
          ? { ...task, progress: Math.max(0, Math.min(100, newProgress)) }
          : task
      ),
    }));
  };

  const handleMouseDown = (taskIndex, increment) => {
    const currentTask = event.tasks[taskIndex];
    updateTaskProgress(taskIndex, currentTask.progress + increment);

    const interval = setInterval(() => {
      const currentEvent = queryClient.getQueryData(["event", name]);
      const currentProgress = currentEvent.tasks[taskIndex].progress;
      updateTaskProgress(taskIndex, currentProgress + increment);
    }, 100);

    window.progressInterval = interval;
  };

  const handleMouseUp = () => {
    if (window.progressInterval) {
      clearInterval(window.progressInterval);
      window.progressInterval = null;
    }
  };

  const markTaskAsDone = (taskIndex) => {
    queryClient.setQueryData(["event", name], (oldData) => ({
      ...oldData,
      tasks: oldData.tasks.map((task, index) =>
        index === taskIndex ? { ...task, progress: 100 } : task
      ),
    }));
  };

  const deleteTask = (taskIndex) => {
    queryClient.setQueryData(["event", name], (oldData) => ({
      ...oldData,
      tasks: oldData.tasks.filter((_, index) => index !== taskIndex),
    }));
  };

  const saveProgressToServer = () => {
    const currentEvent = queryClient.getQueryData(["event", name]);
    if (currentEvent) {
      updateEventMutation(currentEvent);
    }
  };

  const handleAddTask = (newTask) => {
    queryClient.setQueryData(["event", name], (oldData) => {
      const updatedEvent = {
        ...oldData,
        tasks: [...oldData.tasks, newTask],
      };
      // We also update it on the server right away
      updateEventMutation(updatedEvent);
      return updatedEvent;
    });
    setIsAddTaskModalOpen(false);
  };

  const handleAddUser = (newUser) => {
    queryClient.setQueryData(["event", name], (oldData) => {
      const updatedEvent = {
        ...oldData,
        involvedUsers: [...oldData.involvedUsers, newUser],
      };
      // We also update it on the server right away
      updateEventMutation(updatedEvent);
      return updatedEvent;
    });
    setIsAddUserModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <div>Loading event...</div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="w-[100vw] h-[100vh] flex items-center justify-center">
        <div>Error loading event or event not found.</div>
      </div>
    );
  }

  if (
    event.admin !== loggedUser.username &&
    !event.involvedUsers.includes(loggedUser.username)
  ) {
    navigate("/profile");
    return null;
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-start pt-2 px-4 lg:px-8 justify-between">
      <div className="w-full"><Navbar /></div>
      <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-y-8 lg:gap-y-0 lg:gap-x-8 my-4 flex-1">
        <div className="flex flex-col justify-start items-start w-full lg:w-64 h-auto p-4 border-8 border-gray-600 gap-y-4">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-bold"> Members </h1>
            {event.admin === loggedUser.username && (
              <button
                className="bg-black text-white px-2 py-1 rounded-lg hover:bg-gray-800 transition-colors font-bold text-sm"
                onClick={() => setIsAddUserModalOpen(true)}
              >
                Add
              </button>
            )}
          </div>
          {event.involvedUsers.map((user, index) => (
            <div
              key={index}
              className="flex flex-row justify-start items-center gap-x-2"
            >
              {user === event.admin ? (
                <>
                  <p className="text-md w-full">{user} (admin)</p>
                </>
              ) : (
                <>
                  <p className="text-md w-full">{user}</p>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="w-full flex flex-col justify-start items-center">
          <div className="w-full flex flex-col gap-y-4 border-gray-600 border-8 p-4">
            <div className="flex justify-between items-center w-full">
              <h1 className="text-2xl font-bold"> Tasks </h1>
              {event.admin === loggedUser.username && (
                <button
                  className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-bold"
                  onClick={() => setIsAddTaskModalOpen(true)}
                >
                  Add Task
                </button>
              )}
            </div>

            {event.tasks.map((task, index) => (
              <div
                key={index}
                className="w-full flex flex-col justify-start items-center"
              >
                <div className="w-full flex flex-col gap-x-4 items-start justify-center">
                  <h2 className="text-xl font-bold">{task.title}</h2>
                  <p className="font-italic text-gray-600">
                    {task.description}
                  </p>
                </div>

                <div className="flex flex-row w-full gap-x-4">
                  <div className="flex flex-row w-[90%] h-6 bg-gray-200 rounded-md ">
                    <div
                      className="bg-green-200 h-full rounded-md"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                  <p>{task.progress}%</p>
                </div>

                <div
                  key={index}
                  className="w-full flex flex-row flex-wrap justify-start items-center mt-4 gap-y-2"
                >
                  <p>{task.assignee}</p>
                  {(task.assignee === loggedUser.username ||
                    loggedUser.username === event.admin) && (
                    <>
                      <button
                        className="shrink-20 inline-block w-40 m-2 rounded-lg bg-black py-2 font-bold text-white"
                        onClick={() => {
                          markTaskAsDone(index);
                          saveProgressToServer();
                        }}
                      >
                        Mark as done
                      </button>
                      <button
                        className="shrink-20 inline-block w-10 m-2 rounded-lg bg-black py-2 font-bold text-white"
                        onMouseDown={() => handleMouseDown(index, -1)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={() => handleMouseDown(index, -1)}
                        onTouchEnd={handleMouseUp}
                      >
                        -
                      </button>
                      <button
                        className="shrink-20 inline-block w-10 m-2 rounded-lg bg-black py-2 font-bold text-white"
                        onMouseDown={() => handleMouseDown(index, 1)}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={() => handleMouseDown(index, 1)}
                        onTouchEnd={handleMouseUp}
                      >
                        +
                      </button>
                      <div>{task.counter}</div>
                      <button
                        className="shrink-20 inline-block w-40 m-2 rounded-lg bg-black py-2 font-bold text-white"
                        onClick={saveProgressToServer}
                      >
                        Set progress
                      </button>
                      <button
                        className="shrink-20 inline-block w-40 m-2 rounded-lg bg-black py-2 font-bold text-white"
                        onClick={() => {
                          deleteTask(index);
                          saveProgressToServer();
                        }}
                      >
                        Delete task
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-start items-start w-full lg:w-96 h-auto p-4 border-8 border-gray-600 gap-y-4">
          <h1 className="text-2xl font-bold"> Current Event </h1>
          <div className="w-full flex flex-row justify-start items-center gap-x-2">
            <div className="flex flex-col justify-center items-center text-lg font-bold">
              <p> {getMonth(event.date)} </p>
              <p> {event.date.substring(0, 2)} </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-md w-full">{event.title}</p>
              <p className="text-xs">
                {" "}
                {event.location} @ {getTime(event.date.substring(11, 13))}{" "}
              </p>
            </div>
          </div>
          {event.admin === loggedUser.username && (
            <button
              className="shrink-0 inline-block w-56 rounded-lg bg-black py-3 font-bold text-white"
              onClick={() => {
                deleteEventMutation(name);
              }}
            >
              Mark event as done
            </button>
          )}
          <button
            className="shrink-0 inline-block w-56 rounded-lg bg-black py-3 font-bold text-white"
            onClick={() => {
              navigate(`/room/${name}/statistics`);
            }}
          >
            View Statistics
          </button>
        </div>
      </div>
      <Footer />
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        onSubmit={handleAddTask}
        involvedUsers={event.involvedUsers}
      />
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
        involvedUsers={event.involvedUsers}
      />
    </div>
  );
}
