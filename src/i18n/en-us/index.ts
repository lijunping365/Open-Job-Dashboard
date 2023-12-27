import menu from './menu';
import setting from './setting';
import login from './login';

export default {
  lang: 'en-us',
  ...setting,
  ...menu,
  ...login,
};
