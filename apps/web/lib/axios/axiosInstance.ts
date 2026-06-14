import axios from "axios";

const url = process.env.NEXT_PUBLIC_HTTP_URL || "http://localhost:3001/api/v1";

const axiosInstance = axios.create({
  baseURL: url,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let token: string | undefined;

    if (typeof window === "undefined") {
      // Server-side: dynamically import cookies to avoid module-level async call
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      token = cookieStore.get("jwt")?.value;
    } else {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
      };
      token = getCookie("jwt");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
