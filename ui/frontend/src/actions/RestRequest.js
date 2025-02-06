const BASE_URL = "/rest/v1/bcm";
const LOGIN_PATH = "/";

const getAuthToken = () => localStorage.getItem("token");

const handleUnauthorized = async (response, url) => {
    if (url.includes("login")) {
        const data = await response.json();
        console.log("Login response:", data);
        return data;
    } else {
        localStorage.removeItem("token");
        window.location.href = LOGIN_PATH;
        throw new Error("Unauthorized");
    }
};

const handleResponse = async (response, url) => {
    if (response.status === 401) return handleUnauthorized(response, url);
    const contentType = response.headers.get("Content-Type") || "";
    return contentType.includes("text") ? response.text() : response.json();
};

export const RestRequest = (url, method = "GET", body = null) => async (dispatch, getState) => {
    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getAuthToken()}`,
            },
            ...(body ? { body: JSON.stringify(body) } : {}),
        });
        return handleResponse(response, url);
    } catch (error) {
        console.error("API Request Failed:", error);
        throw error;
    }
};
