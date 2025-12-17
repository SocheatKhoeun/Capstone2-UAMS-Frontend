import Swal from "sweetalert2";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.globalProperties.$swal = Swal;
  nuxtApp.provide("swal", Swal);
});