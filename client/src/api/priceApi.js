import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const predictPrice = async (data) => {
  const response = await axios.post(`${API_URL}/price/predict`, data);

  return response.data;
};

export const getSupportedCrops = async () => {
  const response = await axios.get(`${API_URL}/price/crops`);

  return response.data;
};

export const getStates = async (crop) => {
  const response = await axios.get(
    `http://localhost:5000/api/price/states/${crop}`,
  );

  return response.data;
};

export const getDistricts = async (crop, state) => {
  const response = await axios.get(
    `http://localhost:5000/api/price/districts/${crop}/${state}`,
  );

  return response.data;
};

export const savePrediction = async (data) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API_URL}/price/save`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getPredictionHistory = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API_URL}/price/history`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getPriceStats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/price/stats`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
