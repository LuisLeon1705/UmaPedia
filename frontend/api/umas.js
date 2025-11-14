const UMA_API_URL = `${window.APP_CONFIG.API_BASE_URL}/api/uma_musumes`;

const getUmas = () => {
  return apiFetch(UMA_API_URL);
};

const createUma = (formData) => {
  return apiFetch(UMA_API_URL, {
    method: "POST",
    body: formData, // FormData will be passed directly
  });
};

const deleteUma = (id) => {
  return apiFetch(`${UMA_API_URL}/${id}`, {
    method: "DELETE",
  });
};

const updateUma = (id, formData) => {
  return apiFetch(`${UMA_API_URL}/${id}`, {
    method: "PUT",
    body: formData,
  });
};
