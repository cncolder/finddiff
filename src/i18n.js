import assert from 'assert';

export var locale = {
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

export default class I18n {
  constructor() {
    this.lang = 'en';
    this.locale = locale;

    try {
      // Be sure call instance after deviceready.
      navigator.globalization.getPreferredLanguage(
        language => {
          console.log('[I18N]', language.value);

          this.lang = language.value;
        }, () => {
          console.log('[I18N] error getting language');
        }
      );
    } catch (ex) {}
  }

  get code() {
    return this.lang.substr(0, 2);
  }

  get t() {
    return this.translate.bind(this);
  }

  translate(literals, ...values) {
    // if lang is missing, return english string.
    if (!this.locale[this.code]) {
      let english = this.english(literals, ...values);

      console.log('[I18N] english', english);

      return english;
    }

    console.log('[I18N] translate', literals.join('__'), values);

    try {
      let englishKey = this.englishKey(literals);

      // get locale string.
      let localeString = this.locale[this.code][englishKey];

      // replace locale string with values.
      let localeResult = values.reduce((result, value, index) => {
        return result.replace('${' + index + '}', value);
      }, localeString);

      assert(localeResult, 'locale string not found');

      console.log('[I18N] result', localeResult);

      return localeResult;
    } catch (ex) {
      console.log('[I18N]', ex.message);
    }

    // if something wrong return english string.
    return this.english(literals, ...values);
  }

  // default english string
  english(literals, ...values) {
    return literals.reduce((result, str, index) => {
      return result + str + (index < values.length ? values[index] : '');
    }, '');
  }

  // join english key string
  englishKey(literals) {
    return literals.reduce((result, str, index) => {
      return result + str +
        (index < literals.length - 1 ? '${' + index + '}' : '');
    }, '');
  }
}
