<template>
    <v-app id="inspire">
        <v-navigation-drawer v-model="drawer" app>
            <v-list>
                <v-list-item link @click="$router.push('/')">
                    <v-list-item-action>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Home</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="$router.push('/setting')">
                    <v-list-item-action>
                        <v-icon>mdi-information</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>Setting</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item link @click="$router.push('/about')">
                    <v-list-item-action>
                        <v-icon>mdi-information</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title>About</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar app color="indigo" dark>
            <v-app-bar-nav-icon
                @click.stop="drawer = !drawer"
            ></v-app-bar-nav-icon>
            <v-toolbar-title>歌单比对</v-toolbar-title>
            <v-spacer></v-spacer>
            <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
            <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-progress-linear
                :v-show="$root.$data.isLoading == true ? true : false"
                :indeterminate="$root.$data.isLoading"
                absolute
                top
                color="lime"
            ></v-progress-linear>
        </v-app-bar>
        <v-main>
            <v-container>
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: "App",
    props: {
        source: String,
    },
    data: () => ({
        dialog: false,
        drawer: null,
    }),
};
</script>
