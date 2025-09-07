import { useState } from "react";
import { createEvent } from "../Actions/event";
import DatePicker from "react-datepicker";
import "../styles/datepicker.css";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const TaskModal = ({ isOpen, onClose, loggedUser }) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  const queryClient = useQueryClient();

  const createEventMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });

      toast.success("Event created successfully!");

      resetModal();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create event");
    },
  });

  const resetModal = () => {
    setTasks([]);
    setTitle("");
    setLocation("");
    setStartDate(new Date());
  };

  if (!isOpen) return null;

  const handleChange = (index, field, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index][field] = value;
    setTasks(updatedTasks);
  };

  const getEventData = (tasks, title, date, location) => {
    return {
      title: title,
      location: location,
      date: date,
      involvedUsers: [...new Set(tasks.map((task) => task.assignee))],
      tasks: tasks,
      admin: loggedUser,
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md h-auto max-h-[80vh] overflow-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 focus:outline-none text-2xl"
          onClick={() => {
            onClose();
            setTasks([]);
          }}
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">Event title</h2>
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Event title"
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Event date</h2>
        <div className="mb-6">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="MMMM d, yyyy h:mm aa"
            className="border border-gray-300 rounded w-full p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
            placeholderText="Select date and time"
            minDate={new Date()}
            popperClassName="react-datepicker-custom"
            calendarClassName="shadow-lg border-0"
            wrapperClassName="w-full"
            showPopperArrow={false}
            fixedHeight
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Event location</h2>
        <div className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Location"
            onChange={(e) => setLocation(e.target.value)}
            className="border border-gray-300 rounded w-full p-2 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>

        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        <div className="space-y-4 mb-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <label className="block mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Title:
                </span>
                <input
                  type="text"
                  placeholder={`Task ${index + 1}`}
                  onChange={(e) => handleChange(index, "title", e.target.value)}
                  className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </label>
              <label className="block mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Description:
                </span>
                <input
                  type="text"
                  value={task.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </label>
              <label className="block mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Progress:
                </span>
                <input
                  type="number"
                  value={task.progress}
                  onChange={(e) =>
                    handleChange(index, "progress", e.target.value)
                  }
                  className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </label>
              <label className="block mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Assignee:
                </span>
                <input
                  type="text"
                  value={task.assignee}
                  onChange={(e) =>
                    handleChange(index, "assignee", e.target.value)
                  }
                  className="border border-gray-300 rounded w-full p-2 mt-1 focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="flex justify-between gap-3">
          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={createEventMutation.isPending}
            onClick={() => {
              if (
                tasks.every((task) => task.title && task.description) &&
                location &&
                startDate &&
                title
              ) {
                const eventData = getEventData(
                  tasks,
                  title,
                  startDate,
                  location
                );
                createEventMutation.mutate(eventData);
              } else {
                toast.error("Please fill in all fields");
              }
            }}
          >
            {createEventMutation.isPending ? "Creating..." : "Create room"}
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex-1"
            onClick={() =>
              setTasks([
                ...tasks,
                { title: "", description: "", progress: 0, assignee: "" },
              ])
            }
          >
            Add task
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
