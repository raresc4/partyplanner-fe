import { useState } from "react";
import { useNavigate } from "react-router";
import { register } from "../Actions/user";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigator = useNavigate();
  return (
    <>
      <div class="mx-auto my-10 max-w-md rounded-xl border px-4 py-10 text-gray-700 shadow-lg sm:px-8">
        <div class="mb-16 flex justify-between">
          <span class="font-bold">
            <span class="inline-block h-3 w-3 bg-black"></span>Party planner
          </span>
          <span class="">
            Have account?{" "}
            <a href="/login" class="font-medium text-blue-600 hover:underline">
              Log in
            </a>
          </span>
        </div>
        <p class="mb-5 text-3xl font-medium">Plan your party with us!</p>
        <p class="mb-6 text-sm">Register here:</p>
        <div class="mb-6">
          <div class="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
            <input
              type="username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
              class="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
              placeholder="Username"
            />
          </div>
          <div class="focus-within:border-b-blue-500 relative mb-3 flex overflow-hidden border-b-2 transition">
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              class="w-full flex-1 appearance-none border-blue-300 bg-white px-4 py-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
              placeholder="Password"
            />
          </div>
        </div>
        <button
          class="mb-6 rounded-xl bg-black px-8 py-3 font-medium text-white hover:scale-110 transition"
          onClick={() => {
            if (!username || !password) {
              toast.error("Please fill in all fields");
              return;
            }
            register({ username, password })
              .then((data) => {
                toast.success("Registration successful!");
                navigator("/login");
              })
              .catch((err) => toast.error(err.message));
          }}
        >
          Get Started
        </button>
        <p class="">
          By signing up you are agreeing to our{" "}
          <a
            href="#"
            class="whitespace-nowrap font-medium text-gray-900 hover:underline"
          >
            Terms and Conditions
          </a>
        </p>
      </div>
    </>
  );
}
