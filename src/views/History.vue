<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>
    <Loader v-if="loading" />

    <p v-else-if="!records.length" class="center">
      Записей пока нет. <router-link to="/record">Добавить звпись?</router-link>
    </p>

    <div v-else>
      <div class="history-chart">
        <Chart :chartData="chartData" />
      </div>

      <section>
        <HistoryTable :records="items" :page="page" :pageSize="pageSize" />

        <Paginate
          v-model="page"
          :page-count="pageCount"
          :click-handler="pageChangeHendler"
          :prev-text="'Назад'"
          :next-text="'Вперед'"
          :container-class="'pagination'"
          :page-class="'waves-effect'"
        />
      </section>
    </div>
  </div>
</template>

<script>
import Chart from '../components/Chart';
import paginationMixin from '../mixins/pagination.mixin';
import Loader from '../components/app/Loader.vue';
import HistoryTable from '../components/HistoryTable';

export default {
  name: 'history',
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
    records: [],
    chartData: {},
  }),
  async mounted() {
    this.records = await this.$store.dispatch('fetchRecords');
    const categories = await this.$store.dispatch('fetchCategories');

    this.setup(categories);

    this.chartData = {
      labels: categories.map((c) => c.title),
      datasets: [
        {
          label: 'Расходы по категориям',
          data: categories.map((c) => {
            return this.records.reduce((total, rec) => {
              if (rec.category === c.id && rec.type === 'outcome') {
                total += +rec.amount;
              }
              return total;
            }, 0);
          }),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPagination(
        this.records.map((record) => {
          return {
            ...record,
            categoryName: categories.find((c) => c.id === record.category)
              .title,
            typeClass: record.type === 'income' ? 'green' : 'red',
            typeText: record.type === 'income' ? 'Доход' : 'Расход',
          };
        })
      );
    },
  },
  components: {
    HistoryTable,
    Loader,
    Chart,
  },
  watch: {
    // eslint-disable-next-line no-unused-vars
    $route(to, from) {
      if (!to.query.page) {
        this.page = 1;
      }
    },
  },
};
</script>
