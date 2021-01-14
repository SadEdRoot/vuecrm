import firebase from 'firebase/app'

export default {
  actions: {
    async createCategory({commit, dispatch}, {title, limit}) {
      try {
        const uid = await dispatch('getUid');
        const category = await firebase.database().ref(`/users/${uid}/categories`).push({title, limit})
        return {title, limit, id: category.key}
      } catch(e) {
        commit('setErroe', e)
        throw e
      }
    },
    async updateCategory({commit, dispatch}, {id, title, limit}) {
      try {
        const uid = await dispatch('getUid');
        await firebase.database().ref(`/users/${uid}/categories`).child(id).update({title, limit});

      } catch(e) {
        commit('setErroe', e)
        throw e
      }
    },
    async fetchCategories({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid');
        const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {};

        return Object.entries(categories).map(([key, value]) => ({
          id: key,
          title: value.title,
          limit: value.limit,
        }))
      } catch(e) {
        commit('setErroe', e)
        throw e
      }
    },
    async fetchCategoriesById({commit, dispatch}, id) {
      try {
        const uid = await dispatch('getUid');
        const category = (await firebase.database().ref(`/users/${uid}/categories`).child(id).once('value')).val() || {};

        return {...category, id}
      } catch(e) {
        commit('setErroe', e)
        throw e
      }
    },
  }
}
