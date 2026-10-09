/* The few words the scripts write themselves (labels that change, form messages, the cookie
   bar), in the page's language (<html lang>). The English text is the key, so the scripts read
   as before; a string missing here stays English. The page's own words come from the build
   (src/i18n/, src/ru/). Draft Russian, for Artem to edit. */

export const LANG = document.documentElement.lang === 'ru' ? 'ru' : 'en';

const RU = {
  // main.js
  'Copied!': 'Скопировано!',
  'View': 'Смотреть',
  'Drag': 'Тяните',
  'Check confirmation': 'Проверить отзыв',
  // contact.js
  'Your name, please.': 'Как к вам обращаться?',
  'That email doesn’t look right.': 'Кажется, в почте опечатка.',
  'An email to reply to.': 'Куда вам ответить?',
  'Please agree to continue.': 'Нужна галочка, чтобы продолжить.',
  'Sending': 'Отправляю',
  'Send Project': 'Отправить',
  'Copied': 'Скопировано',
  'Not Copied': 'Не скопировалось',
  'Copy Answers': 'Скопировать ответы',
  'That didn’t go through. Your answers are still here — try again, or write to {email}.':
    'Не отправилось. Ответы на месте — попробуйте ещё раз или напишите на {email}.',
  'Website': 'Сайт', 'Needs': 'Задачи', 'Type': 'Тип', 'Start': 'Старт', 'Budget': 'Бюджет',
  '(no project notes)': '(без комментария к проекту)',
  // consent.js
  'Cookie consent': 'Согласие на cookie',
  'May I use analytics cookies (Google Analytics and Yandex Metrica) to see how the site is used? Nothing is loaded unless you agree.':
    'Можно включу аналитику (Google Analytics и Яндекс Метрику), чтобы видеть, как люди пользуются сайтом? Пока не разрешите, ничего не грузится.',
  'Privacy Policy': 'Политика конфиденциальности',
  'Accept': 'Разрешить',
  'Decline': 'Не надо',
};

/** The text in the page's language; {name} placeholders are filled from `vars`. */
export function L(en, vars = {}) {
  const text = (LANG === 'ru' && RU[en]) || en;
  return text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
