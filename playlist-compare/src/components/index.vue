<template>
    <div>
        <v-form v-model="valid">
            <v-textarea
                rows="1"
                v-model="form.yourId"
                :rules="idRules"
                label="你的歌单ID或App分享的链接"
                required
                auto-grow
                clearable
            ></v-textarea>
            <v-radio-group
                v-model="form.yourPlatform"
                required
                row
                label="你的平台"
            >
                <v-radio label="网易云音乐" value="ncm"></v-radio>
                <v-radio label="QQ音乐" value="qqm"></v-radio>
            </v-radio-group>
            <v-textarea
                rows="1"
                v-model="form.herId"
                :rules="idRules"
                label="ta的歌单ID或App分享的链接"
                required
                auto-grow
                clearable
            ></v-textarea>
            <v-radio-group
                v-model="form.herPlatform"
                required
                row
                label="ta的平台"
            >
                <v-radio label="网易云音乐" value="ncm"></v-radio>
                <v-radio label="QQ音乐" value="qqm"></v-radio>
            </v-radio-group>
            <v-row>
                <v-btn
                    class="mx-auto"
                    :disabled="!valid"
                    color="success"
                    @click="validate"
                    >查看</v-btn
                >
            </v-row>
        </v-form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            valid: false,
            form: {
                yourId:
                    "分享oldshensheep创建的歌单「初音ミク」: http://music.163.com/playlist/5205779845/319475460/?userid=319475460 (来自@网易云音乐)",
                herId:
                    "分享oldshensheep创建的歌单「我喜欢的音乐」: http://music.163.com/playlist/444265995/319475460/?userid=319475460 (来自@网易云音乐)",
                yourPlatform: "ncm",
                herPlatform: "ncm",
            },
            idRules: [
                (v) => {
                    if (!v) {
                        return "请输入id或链接";
                    }
                    let dsa = new RegExp(
                        "((?<=/playlist/)[0-9]*)|((?<=/?id=)[0-9]*)"
                    );
                    if (v.length > 15) {
                        let d = dsa.exec(v);
                        if (d === null) return "请输入正确的id或url";
                    }
                    if (v.length < 4) {
                        return "请输入正确的id或url";
                    }
                    return true;
                },
            ],
        };
    },
    mounted() {
        this.$root.$data.isLoading = false;
    },
    methods: {
        validate() {
            let yourId = this.form.yourId;
            let herId = this.form.yourId;
            let dsa = new RegExp("((?<=/playlist/)[0-9]*)|((?<=/?id=)[0-9]*)");
            if (this.form.yourId.length > 15) {
                yourId = dsa.exec(this.form.yourId)[0];
            }
            if (this.form.herId.length > 15) {
                herId = dsa.exec(this.form.herId)[0];
            }
            this.$router.push({
                name: "result",
                params: {
                    form: {
                        yourId,
                        herId,
                        yourPlatform: this.form.yourPlatform,
                        herPlatform: this.form.herPlatform,
                    },
                },
            });
            this.$root.$data.isLoading = true;
        },
    },
};
</script>
