import useEffect from "react";
import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetcher = (...args) => fetch(...args).then((res) => res.json());

export const verifySSOUser = async ({ username, password, voucher }) => {
  const res = await axios.post(`${API_URL}/auth/sso`, {
    username,
    password,
    voucher,
  });
  return res.data;
};

// NEW ENDPOINTS

export const forgotPassword = async (data) => {
  const res = await axios.post(`${API_URL}/evs/forgot`, { ...data });
  return res.data;
};

export const fetchProof = async (data) => {
  const res = await axios.post(`${API_URL}/evs/proof`, { ...data });
  return res.data;
};

// SSO & USER ENDPOINTS

export const verifyOtp = async (data) => {
  const res = await axios.post(`${API_URL}/reset/verifyotp`, { ...data });
  return res.data;
};

export const sendPwd = async (data) => {
  const res = await axios.post(`${API_URL}/reset/sendpwd`, { ...data });
  return res.data;
};

// EVS ENDPOINTS

export const fetchEvsData = async (id, tag) => {
  const res = await axios.get(`${API_URL}/evs/data/${id}/${tag}`);
  return res.data;
};

export const fetchEvsUpdate = async (tag) => {
  const res = await axios.get(`${API_URL}/evs/update/${tag}`);
  return res.data;
};

export const fetchEvsReceipt = async (id, tag) => {
  const res = await axios.get(`${API_URL}/evs/receipt/${id}/${tag}`);
  return res.data;
};

export const fetchEvsRegister = async (id) => {
  const res = await axios.get(`${API_URL}/evs/register/${id}`);
  return res.data;
};

export const fetchEvsMonitor = async (id) => {
  const res = await axios.get(`${API_URL}/evs/monitor/${id}`);
  return res.data;
};

export const postEvsData = async (data) => {
  const res = await axios.post(`${API_URL}/evs/data`, { ...data });
  return res.data;
};

export const updateEvsControlData = async (data) => {
  const res = await axios.post(`${API_URL}/evs/setcontrol`, { ...data });
  return res.data;
};

export const deleteElector = async (id, tag) => {
  const res = await axios.delete(`${API_URL}/evs/deletevoter/${id}/${tag}`);
  return res.data;
};

export const addElector = async (data) => {
  const res = await axios.post(`${API_URL}/evs/addvoter`, { ...data });
  return res.data;
};

export const deletePortfolio = async (id) => {
  const res = await axios.delete(`${API_URL}/evs/deleteportfolio/${id}`);
  return res.data;
};

export const savePortfolio = async (data) => {
  const res = await axios.post(`${API_URL}/evs/saveportfolio`, { ...data });
  return res.data;
};

export const sellVoucher = async (data) => {
  const res = await axios.post(`${API_URL}/evs/sellvouch`, { ...data });
  return res.data;
};
