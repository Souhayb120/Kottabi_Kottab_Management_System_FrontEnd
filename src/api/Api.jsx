import axios from "axios";
import {toast} from "react-toastify";

const api = axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {

        const status = error.response?.status;

        switch (status) {

            case 400:
                toast.error("Erreur 400 : Requête invalide.");
                break;

            case 401:
                toast.error("Erreur 401 : Session expirée.");

                localStorage.removeItem("token");
                localStorage.removeItem("username");
                localStorage.removeItem("role");

                window.location.href = "/";
                break;

            case 403:
                toast.error("Erreur 403 : Accès interdit.");
                break;

            case 404:
                toast.error("Erreur 404 : Ressource introuvable.");
                break;

            case 500:
                toast.error("Erreur 500 : Erreur interne du serveur.");
                break;

            default:
                toast.error("Une erreur est survenue.");
        }

        return Promise.reject(error);
    }
);

export default api;