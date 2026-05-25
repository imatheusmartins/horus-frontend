import createAxiosClient from "./createAxiosClient";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8081";

export const api = createAxiosClient(baseUrl);
