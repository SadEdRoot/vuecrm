<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{'Create' | localize}}</h4>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model.trim="title"
            :class="{invalid: $v.title.$dirty && !$v.title.required}"
          >
          <label for="name">{{'Title' | localize}}</label>
          <span
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
          >{{'Message_CategoryTitle' | localize}}</span>
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{invalid: $v.limit.$dirty && !$v.limit.minValue}"
          >
          <label for="limit">{{'Limit' | localize}}</label>
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
          >{{'Message_MinLength' | localize}} {{$v.limit.$params.minValue.min}}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{'Create' | localize}}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
/* global M */
import {required, minValue} from 'vuelidate/lib/validators';
import localizeFilter from '../filters/localize.filter';

export default {
  data: () => ({
    title: '',
    limit: 10
  }),
  validations: {
    title: {required},
    limit: {minValue: minValue(10)}
  },
  mounted() {
    M.updateTextFields();
  },
  methods: {
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      try {
        // eslint-disable-next-line no-unused-vars
        const category = await this.$store.dispatch('createCategory', {
          title: this.title,
          limit: this.limit
        })
        this.title = '';
        this.limit = 100;
        this.$v.$reset();
        this.$message(localizeFilter('Category_HasBeenCreated'));
        this.$emit('created', category)
      // eslint-disable-next-line no-empty
      } catch(e) {}

    }
  }
}
</script>
