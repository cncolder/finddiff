import assert from 'assert';
import I18n from '../src/i18n';

describe('I18n', () => {
  let i18n = new I18n();

  i18n.locale = {
    zh: {
      a: '啊',
      'hello ${0}': '你好${0}',
      '${0} and ${1} is ${2}': '${0}加${1}等于${2}',
      'Answer is ${0} but your choice is ${1}.': '你选了${1}, 但答案是${0}.',
    },
  };

  i18n.lang = 'zh-CN';

  it('first 2 char is code', () => {
    assert.equal(i18n.code, 'zh');
  });

  describe('t', () => {
    let t = i18n.t;

    it('get locale by simple english key', () => {
      assert.equal(t `a`, '啊');
    });

    it('get locale by key and value', () => {
      assert.equal(t `hello ${'毒'}`, '你好毒');
      assert.equal(t `${3} and ${5} is ${8}`, '3加5等于8');
      assert.equal(
        t `Answer is ${'C'} but your choice is ${'B'}.`,
        '你选了B, 但答案是C.'
      );
    });

    it('return english if code is missing', () => {
      assert.equal(t `none`, 'none');
      assert.equal(t `Hello ${'Job'}!`, 'Hello Job!');
    });
  });
});
