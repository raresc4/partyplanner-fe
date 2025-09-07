import { getHeader } from "./utils";

const API_URL = process.env.REACT_APP_API_URL;

export async function createEvent(eventData) {
  const response = await fetch(`${API_URL}/events/createEvent`, {
    method: "POST",
    headers: getHeader(),
    body: JSON.stringify(eventData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getUserEvents(username) {
  const response = await fetch(`${API_URL}/events/getUserEvents/${username}`, {
    method: "GET",
    headers: getHeader(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function getEvent(eventname) {
  const response = await fetch(`${API_URL}/events/${eventname}`, {
    method: "GET",
    headers: getHeader(),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function updateEvent(event) {
  const response = await fetch(`${API_URL}/events/updateEvent`, {
    method: "PUT",
    headers: getHeader(),
    body: JSON.stringify(event),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  return data;
}

export async function deleteEvent(eventname) {
  const response = await fetch(`${API_URL}/events/${eventname}`, {
    method: "DELETE",
    headers: getHeader(),
  });

  if (!response.ok) {
    throw new Error();
  }
}
