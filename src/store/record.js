import firebase from 'firebase/app';

export default {
  actions: {
    async createRecord({dispatch, commit}, record) {
      try {
        const uid = await dispatch('getUid');
        return await firebase.database().ref(`/users/${uid}/records`).push(record)
      } catch (e) {
        commit ('setError', e)
        throw e
      }
    },
    async fetchRecords({commit, dispatch}) {
      try {
        const uid = await dispatch('getUid');
        const records = (await firebase.database().ref(`/users/${uid}/records`).once('value')).val() || {};

        return Object.entries(records).map(([key, value]) => ({
          id: key,
          ...value
        }))
      } catch(e) {
        commit('setErroe', e)
        throw e
      }
    }
  }
}
