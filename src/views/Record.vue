<template>
  <div>
    <div class="page-title">
      <h3>{{'NewRecord' | localize}}</h3>
    </div>

    <Loader v-if="loading" />

    <p v-else-if="!categories.length" class="center">{{'NoCategories' | localize}} <router-link to="/categories">Добавить категорию</router-link></p>

    <form v-else class="form" @submit.prevent="onSubmit">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option
            v-for="c of categories"
            :key="c.id"
            :value="c.id"
          >
            {{c.title}}
          </option>
        </select>
        <label>{{'SelectCategory' | localize}}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{'Income' | localize}}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{'Outcome' | localize}}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{invalid: $v.amount.$dirty && !$v.amount.minValue}"
        >
        <label for="amount">{{'Amount' | localize}}</label>
        <span
          class="helper-text invalid"
          v-if="$v.amount.$dirty && !$v.amount.minValue"
        >Минимальное значение {{$v.amount.$params.minValue.min}}</span>
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{invalid: $v.description.$dirty && !$v.description.required}"
        >
        <label for="description">{{'Description' | localize}}</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
        >{{'Message_EnterDescription' | localize}}</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{'Create' | localize}}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
/*global M*/
import {required, minValue} from 'vuelidate/lib/validators';
import {mapGetters} from 'vuex';
import localizeFilter from '../filters/localize.filter';

export default {
  name: 'record',
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    category: null,
    type: 'outcome',
    amount: 1,
    description: '',
  }),
  metaInfo() {
    return {
      title: this.$title('NewRecord')
    }
  },
  validations: {
    amount: {minValue: minValue(1)},
    description: {required}
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories');
    this.loading = false;
    if(this.categories.length) {
      this.category = this.categories[0].id;
    }

    setTimeout(() => {
      this.select = M.FormSelect.init(this.$refs.select);
      M.updateTextFields();
    }, 0)
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }

      return this.info.bill >= this.amount
    }
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return
      }

      if (this.canCreateRecord) {
        try {
          const recordData = {
            category: this.category,
            type: this.type,
            amount: this.amount,
            description: this.description,
            date: new Date().toJSON()
          }

          await this. $store.dispatch('createRecord', recordData);

          const bill = this.type === 'income'
            ? this.info.bill + this.amount
            : this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', {bill});
          this.$v.$reset();
          this.amount = 1;
          this.description = '';

          this.$message(localizeFilter('RecordHasBeenCreated'));
        // eslint-disable-next-line no-empty
        } catch (e) {}
      } else {
        this.$message(`${localizeFilter('NotEnoughMoney')} (${this.amount - this.info.bill})`)
      }
    },
  },
  destroyed() {
      if (this.select && this.select.destroy) {
        this.select.destroy()
      }
    }
  }
</script>
