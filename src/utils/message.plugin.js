/*global M*/

/*Заметки обучающигося: планин который добавляем методы к вью.
В данном случае вызывает функцию библиотеки.
Официальная дока: https://ru.vuejs.org/v2/guide/plugins.html*/
export default {
  install(Vue) {
    Vue.prototype.$message = function(html) {
      M.toast({html})
    }

    Vue.prototype.$error = function(html) {
      M.toast({html: `[Ошибка]: ${html}`})
    }
  }
}
