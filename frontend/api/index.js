const getAuthHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const apiFetch = async (url, options = {}) => {
  const { headers, ...restOptions } = options;
  const defaultHeaders = getAuthHeaders();

  // For FormData, we let the browser set the Content-Type
  if (options.body instanceof FormData) {
    delete defaultHeaders["Content-Type"];
  }

  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    ...restOptions,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: `Request failed with status ${response.status}`,
    }));
    throw new Error(errorData.message);
  }

  if (response.status === 204 || response.status === 201) {
    return;
  }

  return response.json();
};
