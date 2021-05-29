<template>
    <div>
        <v-select
            :items="[true, false]"
            label="isLoading"
            v-model="$root.$data.isLoading"
        ></v-select>
        <v-text-field
            label="NCM_API_Server"
            v-model="API_Server.ncm"
        ></v-text-field>
        <v-text-field
            label="QQ_API_Server"
            v-model="API_Server.qqm"
        ></v-text-field>
        <v-row align="center" justify="space-around">
            <v-btn color="primary" @click="save">确认</v-btn>
            <v-btn color="error" @click="reset_">重置</v-btn>
        </v-row>
    </div>
</template>

<script>
import { APIurl, reset } from "@/api/config";

export default {
    data() {
        return {
            API_Server: { ncm: null, qqm: null },
        };
    },
    methods: {
        save() {
            localStorage.setItem("ncm_api_server", this.API_Server.ncm);
            localStorage.setItem("qqm_api_server", this.API_Server.qqm);
            APIurl = this.API_Server;
            console.log("save success");
            console.log(APIurl);
        },
        reset_() {
            reset();
            this.API_Server = APIurl;
        },
    },
    mounted() {
        this.$root.$data.isLoading = false;
    },
    created() {
        this.API_Server.ncm = localStorage.getItem("ncm_api_server");
        this.API_Server.qqm = localStorage.getItem("qqm_api_server");
    },
};
</script>

<style></style>
