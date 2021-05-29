<template>
    <div>
        <v-snackbar v-model="snackbar" :timeout="1500">
            时候未到
            <template v-slot:action="{ attrs }">
                <v-btn
                    color="pink"
                    text
                    v-bind="attrs"
                    @click="snackbar = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <span> 非专业程序员，出于兴趣写的 </span>
        <br />
        <a target="_blank" @click="getSourceCode">获取源码</a>
    </div>
</template>

<script>
export default {
    data() {
        return {
            snackbar: false,
        };
    },
    methods: {
        getSourceCode() {
            this.snackbar = true;
        },
    },
};
</script>
