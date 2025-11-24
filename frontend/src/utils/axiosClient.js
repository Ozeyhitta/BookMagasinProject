import axios from "axios";
import { buildApiUrl } from "./apiConfig";

const axiosClient = axios.create({
  baseURL: buildApiUrl("/api"),
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
