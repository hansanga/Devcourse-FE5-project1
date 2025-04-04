const API_URL = "https://kdt-api.fe.dev-cos.com/documents/";

const request = async (method, id = "", data = null) => {
  try {
    const response = await fetch(API_URL + id, {
      headers: {
        "Content-Type": "application/json",
        "x-username": "1TeamLetsGo",
      },
      method,
      body: data ? JSON.stringify(data) : null,
    });
    if (!response.ok) {
      throw new Error(
        `Network response was not ok. error code is ${response.status}`
      );
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

const getDocuments = async (id = "") => {
  const response = await request("GET", id);
  return response;
};

const createDocument = async (data) => {
  const response = await request("POST", "", data);
  return response;
};

const updateDocument = async (id, data) => {
  const response = await request("PUT", id, data);
  return response;
};

const deleteDocument = async (id) => {
  const response = await request("DELETE", id);
  return response;
};

const getDocument = async (id) => {
  const response = await request("GET", id);
  return response;
};

export {
  getDocuments,
  createDocument,
  updateDocument,
  deleteDocument,
  getDocument,
};
