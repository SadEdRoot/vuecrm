<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!records.length" class="center">Записей пока нет. <router-link to="/record">Добавить звпись?</router-link></p>

    <section v-else>
      <HistoryTable :records="records"/>
    </section>
  </div>
</template>

<script>
import Loader from '../components/app/Loader.vue';
import HistoryTable from '../components/HistoryTable'

export default {
  name: 'history',
  data: () => ({
    loading: true,
    records: [],
    categories: [],
  }),
  async mounted() {
    const records = await this.$store.dispatch('fetchRecords');
    this.categories = await this.$store.dispatch('fetchCategories');
    this.records = records.map(record => {
      return {
        ...record,
        categoryName: this.categories.find(c => c.id === record.category).title,
        typeClass: record.type === 'income' ? 'green' : 'red',
        typeText: record.type === 'income' ? 'Доход' : 'Расход',
      }
    });
    this.loading = false;
  },
  components: {
    HistoryTable,
    Loader
  }
}
</script>
