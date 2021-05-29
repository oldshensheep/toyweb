<template>
    <div class="compare">
        <div class="union">
            <div class="your box" :style="{ width: percentYour + '%' }">
                <span>{{ your }}</span>
                <span class="percent">{{ percentYour }}%</span>
                <span class="music-num">你的歌曲数量</span>
            </div>
        </div>
        <div class="union">
            <div class="her box" :style="{ width: percentHer + '%' }">
                <span>{{ her }}</span>
                <span class="percent">{{ percentHer }}%</span>
                <span class="music-num">ta的歌曲数量</span>
            </div>
        </div>
        <div class="union">
            <div class="same box" :style="{ width: percentSame + '%' }">
                <span>{{ same }}</span>
                <span class="percent">{{ percentSame }}%</span>
                <span class="music-num">相同歌曲数量</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["your", "her", "same"],
    computed: {
        percentHer() {
            return ((this.her / (this.her + this.your)) * 100).toFixed(2);
        },
        percentYour() {
            return ((this.your / (this.her + this.your)) * 100).toFixed(2);
        },
        percentSame() {
            return (((this.same * 2) / (this.her + this.your)) * 100).toFixed(
                2
            );
        },
    },
};
</script>

<style scoped>
.compare {
    width: 430px;
    height: 170px;
    padding-right: 60px;
    margin: auto;
    padding: 10px;
    border: 2px solid pink;
}
.union {
    width: 300px;
    word-break: keep-all;
}
.compare .box {
    /* float: left; */
    text-align: center;
    line-height: 50px;
    position: relative;
    margin-left: 60px;
    height: 50px;
}
.compare .percent {
    position: absolute;
    line-height: 50px;
    left: -60px;
}
.your {
    width: 60%;
    background: skyblue;
}
.same {
    width: 20%;
    background: rgb(50, 161, 83);
}
.her {
    width: 10%;
    background: pink;
}
.music-num {
    position: absolute;
    line-height: 50px;
    left: 240px;
}
</style>
