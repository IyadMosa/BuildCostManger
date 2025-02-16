const BASE_URL = "/rest/v1/bcm";
const LOGIN_PATH = "/";

const getAuthToken = () => localStorage.getItem("token");

const handleUnauthorized = (response, url) => {
  if (url.includes("login")) {
    return response.json(); // Handle login response
  } else {
    localStorage.removeItem("token");
    window.location.href = LOGIN_PATH;
    throw new Error("Unauthorized");
  }
};

const handleResponse = (response, url) => {
  if (response.status === 401 || response.status === 403) {
    return handleUnauthorized(response, url);
  }

  const contentType = response.headers.get("Content-Type") || "";
  return contentType.includes("text") ? response.text() : response.json();
};

export const RestRequest = (url, method = "GET", body = null) => {
  return fetch(`${BASE_URL}${url}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAuthToken()}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
    .then((response) => handleResponse(response, url))
    .catch((error) => {
      console.error("API Request Failed:", error);
      throw error;
    });
};
