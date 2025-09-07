import { getHeader } from "./utils";

const API_URL = process.env.REACT_APP_API_URL;

export async function register(userData) {
  const response = await fetch(`${API_URL}/user/register`, {
    method: "POST",
    headers: getHeader(),
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function login(userData) {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: getHeader(),
    body: JSON.stringify(userData),
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

export async function getLoggedUser() {
  const response = await fetch(`${API_URL}/user/getLoggedUser`, {
    method: "GET",
    headers: getHeader(),
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function changePassword(username, oldPassword, newPassword) {
  const response = await fetch(`${API_URL}/user/changePassword`, {
    method: "PUT",
    headers: getHeader(),
    body: JSON.stringify({ username, oldPassword, newPassword }),
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

export async function logout() {
  const response = await fetch(`${API_URL}/user/logout`, {
    method: "POST",
    headers: getHeader(),
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}

export async function deleteUser(username) {
  const response = await fetch(`${API_URL}/user/${username}`, {
    method: "DELETE",
    headers: getHeader(),
    credentials: "include",
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message);
  }
}
