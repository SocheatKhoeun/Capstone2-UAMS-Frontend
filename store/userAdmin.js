import { defineStore } from "pinia";
import { useNuxtApp } from "#app";

export const userAdminStore = defineStore('userAdminStore', {
    state: () => ({
        users : []
    }),
    actions:{
        async getAllUsers(){
            const { $AdminPrivateAxios} = useNuxtApp();
            try{
                const response = await $AdminPrivateAxios.get('/users');
                this.users = response.data.data.users;
                console.log("User ", this.users)
                return this.users;
            }
            catch (error){
                console.error("Faild to fetch users", error)
                throw error;
            }
        }
    }
})