import createAxiosClient from "./createAxiosClient";

const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const api = createAxiosClient(baseUrl);
