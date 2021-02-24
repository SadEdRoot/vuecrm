import store from '../store/index';
import ru from '../locales/ru.json';
import en from '../locales/en.json';


const locales = {
  'ru-RU': ru,
  'en-US': en,
};

export default function localize(key) {
  const locale = store.getters.info.locale || 'ru-RU';
  return locales[locale][key] || `[Localize error]: key ${key} not found`;
}
