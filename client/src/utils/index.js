import axios from "axios";
export const BASE_URL = 'http://localhost:3000';

export const $axios = axios.create({
    baseURL: `${BASE_URL}/api`,
})

