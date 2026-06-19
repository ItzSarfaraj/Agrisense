import api from "./axios";

export const predictPrice = async (data) => {
  const response = await api.post("/price/predict", data);
  return response.data;
};

export const getSupportedCrops = async () => {
  const response = await api.get("/price/crops");
  return response.data;
};

export const getStates = async (crop) => {
  const response = await api.get(`/price/states/${crop}`);
  return response.data;
};

export const getDistricts = async (crop, state) => {
  const response = await api.get(
    `/price/districts/${crop}/${state}`
  );
  return response.data;
};

export const savePrediction = async (data) => {
  const response = await api.post(
    "/price/save",
    data
  );

  return response.data;
};

export const getPredictionHistory = async () => {
  const response = await api.get(
    "/price/history"
  );

  return response.data;
};

export const getPriceStats = async () => {
  const response = await api.get(
    "/price/stats"
  );

  return response.data;
};