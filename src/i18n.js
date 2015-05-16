let locale = {
  zh: {
    // jscs: disable
    'There is a new version': '发现新版本',
    'Your app running currently ${0} was outdated. Please download and install the newer version ${1}.': '您正在使用的 App ${0} 已经过时了, 请下载安装新版本 ${1}.',
    Update: '升级',
    Later: '稍后',
    'Nothing else': '没了',
    'Game complete page is working out.': '通关页面还没做.',
    // jscs: enable
  },
};

let lang = 'en';

let i18n = {
  t: (literals, ...values) => {
    console.log('[I18N] translate', literals.join('${}'), 'with', values);

    try {
      // join origin english string.
      let enstr = literals.reduce((result, str, index) => {
        return result + str + (index < values.length ? '${' + index + '}' : '');
      }, '');
      // get locale lang string.
      let localestr = locale[lang.substr(0, 2)][enstr];
      // replace and join locale lang string with values.
      let localeresult = values.reduce((result, value, index) => {
        return result.replace('${' + index + '}', value);
      }, localestr);

      console.log('[I18N] result', localeresult);

      return localeresult;
    } catch (ex) {
      console.log('[I18N]', ex.message);
    }

    // if lang is missing, return english string.
    let enresult = literals.reduce((result, str, index) => {
      return result + str + (index < values.length ? values[index] : '');
    }, '');

    console.log('[I18N] english', enresult);

    return enresult;
  },

  init: () => {
    navigator.globalization.getPreferredLanguage(
      language => {
        console.log('[I18N]', language.value);

        lang = language.value;
      }, () => {
        console.log('[I18N] error getting language');
      }
    );
  },
};

export default i18n;
