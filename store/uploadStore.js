import { defineStore } from "pinia";
import { useNuxtApp, useRuntimeConfig } from "#app";

export const useUploadStore = defineStore("uploadStore", {
  state: () => ({
    uploading: false,
    error: null,
  }),

  actions: {
    /**
     * Upload an image file or FormData to the public uploads endpoint.
     * Accepts either a File or a FormData (if FormData is given, it should contain a file field).
     * Returns the parsed upload response (object with url, public_id, raw, etc.).
     */
    async uploadImage(input) {
      this.uploading = true;
      this.error = null;

      const nuxt = useNuxtApp();
      const runtimeConfig = useRuntimeConfig();
      const axiosInst =
        nuxt?.$publicAxios ||
        nuxt?.$UserPrivateAxios ||
        nuxt?.$AdminPrivateAxios ||
        nuxt?.$axios ||
        null;

      // Normalize to FormData
      let formData;
      if (input instanceof FormData) {
        formData = input;
      } else {
        // input expected to be a File or Blob
        formData = new FormData();
        formData.append("file", input);
      }

      // Helper to build absolute endpoint URL if needed
      const buildAbsoluteUrl = (path = "/api/v1/uploads/image") => {
        // Prefer explicit USER_PRIVATE_API from runtime config or env
        const envBase =
          (runtimeConfig && (runtimeConfig.USER_PRIVATE_API || runtimeConfig.public?.USER_PRIVATE_API)) ||
          (typeof process !== "undefined" && process.env?.USER_PRIVATE_API) ||
          null;
        if (envBase) {
          try {
            return `${new URL(envBase).origin.replace(/\/$/, "")}${path}`;
          } catch (e) {
            return `${envBase.replace(/\/$/, "")}${path}`;
          }
        }
        try {
          const base = axiosInst?.defaults?.baseURL || "";
          if (base) return `${new URL(base).origin.replace(/\/$/, "")}${path}`;
        } catch (e) {
          /* ignore */
        }
        if (typeof window !== "undefined") {
          return `${window.location.origin.replace(/\/$/, "")}${path}`;
        }
        return path;
      };

      try {
        let resp;

        if (axiosInst) {
          // Prefer axios instance; don't set Content-Type so browser sets multipart boundary
          try {
            resp = await axiosInst.post("/uploads/image", formData);
          } catch (err) {
            // If 404 or other network/path issue, retry with absolute URL built from base or origin
            if (err?.response?.status === 404) {
              const fallback = buildAbsoluteUrl("/api/v1/uploads/image");
              resp = await axiosInst.post(fallback, formData);
            } else {
              throw err;
            }
          }
          return resp.data || resp;
        } else {
          // Fallback to fetch
          const url = buildAbsoluteUrl("/api/v1/uploads/image");
          const fetchResp = await fetch(url, {
            method: "POST",
            body: formData,
          });
          if (!fetchResp.ok) {
            const text = await fetchResp.text();
            const err = new Error(`Upload failed: ${fetchResp.status}`);
            err.response = { status: fetchResp.status, body: text };
            throw err;
          }
          const data = await fetchResp.json();
          return data;
        }
      } catch (error) {
        this.error =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to upload image";
        throw error;
      } finally {
        this.uploading = false;
      }
    },
  },
});
