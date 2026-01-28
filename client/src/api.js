import axios from "axios";

const api = axios.create({
  baseURL: "https://ai-personal-finance-advisor-using-mern-usuh.onrender.com/",
});

export default api;
