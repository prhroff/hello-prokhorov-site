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
  'Choose one.': 'Выберите вариант.',
  'Choose at least one.': 'Выберите хотя бы один.',
  'Your name, please.': 'Как к вам обращаться?',
  'That email doesn’t look right.': 'Кажется, в почте опечатка.',
  'An email to reply to.': 'Куда вам ответить?',
  'An email or a phone to reply to.': 'Оставьте почту или номер, чтобы я мог ответить.',
  'That number doesn’t look right.': 'Кажется, в номере опечатка.',
  'Please agree to continue.': 'Нужна галочка, чтобы продолжить.',
  'Sending': 'Отправляю',
  'Send Project': 'Отправить',
  'Copied': 'Скопировано',
  'Not Copied': 'Не скопировалось',
  'Copy Answers': 'Скопировать ответы',
  'That didn’t go through. Your answers are still here — try again, or write to {email}.':
    'Не отправилось, но ответы на месте. Попробуйте ещё раз или напишите мне в WhatsApp ({phone}) либо на {email}.',
  'Website': 'Сайт', 'Needs': 'Задачи', 'Type': 'Тип', 'Start': 'Старт', 'Budget': 'Бюджет', 'Found via': 'Откуда узнали',
  '(no project notes)': '(без комментария к проекту)',
  // consent.js
  'Cookie consent': 'Согласие на куки',
  'May I use analytics cookies (Google Analytics and Yandex Metrica) to see how the site is used? Nothing is loaded unless you agree.':
    'Можно я включу Гугл Аналитику и Яндекс Метрику? Они ставят куки и показывают мне, как пользуются сайтом. Пока не разрешите, они не загружаются.',
  'Privacy Policy': 'Политика конфиденциальности',
  'Accept': 'Разрешить',
  'Decline': 'Не надо',
  // lost.js: the archive categories under the pictures on the 404
  'Web Concept': 'Сайт', 'Poster': 'Постер', 'Branding': 'Айдентика', 'Landing Page': 'Лендинг',
  'Interface': 'Интерфейс', 'Product Render': 'Рендер продукта', 'Mobile UI': 'Мобильная версия',
  'Motion Still': 'Кадр из моушна', 'Type Study': 'Типографический этюд', 'Image Study': 'Этюд',
  'Detail Study': 'Деталь', 'Unused Direction': 'Неиспользованный вариант', 'Campaign': 'Рекламный визуал',
};

/** The text in the page's language; {name} placeholders are filled from `vars`. */
export function L(en, vars = {}) {
  const text = (LANG === 'ru' && RU[en]) || en;
  return text.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}
