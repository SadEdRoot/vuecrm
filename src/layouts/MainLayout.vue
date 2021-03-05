<template>
  <div class="app-main-layout">

    <Navbar @click="isOpen = !isOpen" />

    <Sidebar v-model="isOpen" :key="locale"/>

    <main class="app-content" :class="{full: !isOpen}">
      <div class="app-page">
        <router-view />
      </div>
    </main>

    <div class="fixed-action-btn">
      <router-link
        class="btn-floating btn-large blue"
        to="/record"
        data-position="left"
        v-tooltip="tooltip">
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/app/Navbar';
import Sidebar from '@/components/app/Sidebar';
import messages from '../utils/messages';
import localizeFilter from '../filters/localize.filter';

export default {
  name: 'main-layout',
  data: () => ({
    isOpen: true,
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo');
    }
  },
  components: {
    Navbar, Sidebar
  },
  computed: {
    error() {
      return this.$store.getters.error
    },
    tooltip() {
      return localizeFilter("CreateNewRecord")
    },
    locale() {
      return this.$store.getters.info.locale
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code || 'Что то пошло не так'])
    }
  }
}
</script>
