# Индекс проектов: типографика

Креативный директор, 10 окт 2026. Смотрел `new-test-ru`: блок `/* Index (home and /info/` в `css/main.css`, `project_index()` в `scripts/build-html.py`, `PROJECTS` в `scripts/site_config.py`, `ru/index.html`, скриншоты главной RU и /info/ EN на 1440 и главной RU на 375, референс Kulturloft.

Только типографика. Новых функций, ссылок, hover, построчной анимации и картинки за курсором нет. Анимация появления (линейки и opacity) остаётся как есть, меняется только толщина линейки в ней.

## Что видно сейчас

- Колонка на главной и /info/ шириной около 600 px, на 1200 px около 496 px. Кегль строки `3.6cqi`, то есть около 21.6 px. Год и название одного размера, цвета и начертания, и 17 раз «2026» подряд спорят с названиями.
- Пометка `max(10px, 0.36em)` на этой ширине всегда упирается в 10 px. `top: -1.15em` поднимает её примерно на 3 px выше линии прописных, и она висит над словом, а не продолжает его.
- `®`/`©` (`span.r`: 0.5em, `vertical-align: 0.82em`) и скобка пометки стоят на разных высотах и разного размера. В строках «Powermatic Technologies®(Дизайн…)» и «Contour Office©(Концепт…)» получается каша из двух надстрочников.
- Миниатюра 1.9 × 1.05em, `vertical-align: -0.12em`. Верх выше прописных почти на 0.2em, она не привязана ни к одной линии шрифта.
- Линейки 1.5 px. На экранах 1x они округляются то до 1, то до 2 px, и в одном списке видны линии разной толщины.
- Трекинг `-0.02em` для названий заметно свободнее, чем у остальных крупных строк сайта (`.item__name`, `.lede`: -0.04em).
- На телефоне пометка 11 px. На сайте нет текста меньше 13 px (`.count`, `.block__no`, `.cs-fig figcaption`: 13 px, `letter-spacing: 0`).
- Тёмной темы на сайте нет. Всё ниже держится на `var(--fg)` и `var(--bg)`, так что тема, если появится, подхватит блок без доработок.

## Правки по приоритету

### 1. Пометка: прописные пометки на линии прописных названия
Самая заметная деталь референса: пометка начинается ровно от верха прописных. Кегль задаём через переменную, тогда подъём считается точно: `0.727` — высота прописных Inter (1490/2048), одинаковая для латиницы и кириллицы.
```css
.idx { --fs: clamp(17px, 3.9cqi, 30px); }            /* см. п. 4 */
.idx__row { font-size: var(--fs); }
.idx__note {
  margin-left: 0.3em;                                  /* ≈ 3px: отделена от слова, но держится за него */
  font-size: max(10px, calc(var(--fs) * 0.4)); line-height: 0; letter-spacing: 0.005em;
  vertical-align: 0; position: relative;
  top: calc((var(--fs) - 1em) * -0.727);               /* верх прописных пометки = верх прописных названия */
  white-space: nowrap;
}
```
Зачем: сейчас пометка висит над словом, а должна продолжать его верхнюю линию, как в Kulturloft.

### 2. `®` / `©` и пометка на одной линии
Знак уходит в ту же строку, что и пометка, того же размера и на той же высоте: «Technologies ®(Дизайн и разработка)».
```css
@container (min-width: 460px) {
  .idx__name .r {
    font-size: max(10px, calc(var(--fs) * 0.4)); line-height: 0; vertical-align: 0;
    position: relative; top: calc((var(--fs) - 1em) * -0.727); margin-left: 0.15em;
  }
  .idx__name .r + .idx__note { margin-left: 0.25em; }
}
```
Зачем: сейчас там два надстрочника разной высоты и размера, а станет одна верхняя строка.

### 3. Линейки: 1 px на 1x, 1.5 px на ретине
```css
.idx-block { --idx-rule: 1px; }
@media (min-resolution: 2dppx) { .idx-block { --idx-rule: 1.5px; } }
.idx { border-bottom: var(--idx-rule) solid var(--fg); }
.idx__row { border-top: var(--idx-rule) solid var(--fg); }
/* и в анимации появления заменить все «1.5px» на var(--idx-rule):
   background-size 0% var(--idx-rule) / 100% var(--idx-rule) */
```
Зачем: 1.5 px на обычном мониторе даёт линии разной толщины в одном списке. Программа держится на ровном шаге линий.

### 4. Название крупнее и плотнее
```css
.idx { --fs: clamp(17px, 3.9cqi, 30px); }              /* 600px → 23.4px; 496px → 19.3px */
.idx__name { letter-spacing: -0.035em; text-wrap: pretty; }
```
Зачем: на 600 px название поднимается с 21.6 до 23.4 px, а трекинг -0.035em, как у `--t-head`/`.exp__name`. Индекс садится в ту же систему, что и остальные крупные строки, и гротеск выглядит собранным, как в референсе. Проверено по самой длинной строке («Powermatic Technologies® (Дизайн и разработка)» + миниатюра): на 496 px она помещается в одну строку с запасом около 15 px. Больше 3.9cqi не ставить.

### 5. Год: табличные цифры, трекинг для цифр, колонка под «2023–24»
```css
.idx__row { grid-template-columns: 4.3em minmax(0, 1fr); column-gap: 0.6em; }
.idx__year { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; white-space: nowrap; }
```
Зачем: табличным цифрам Inter при -0.035em тесно. -0.01em держит «2026» ровным блоком. При 4.3em «2023–24» (длинное тире, без пробелов, так правильно) не прилипает к названию, а у четырёхзначных годов зазор не разваливается. `nowrap` защищает «2023–24» от переноса на узкой колонке.

### 6. Строка: оптический ритм внутри ячейки
```css
.idx__row { line-height: 1.15; padding: 0.26em 0 0.14em; }
```
Зачем: сейчас от верхней линейки до прописных около 0.51em, от базовой линии до нижней около 0.31em, и строка проседает вниз. Новые 0.47 / 0.35em: текст стоит чуть ниже центра, как в программе, а нижним выносным («р», «у», «д») хватает места. Высота строки почти не меняется: 35 строк на 600 px примерно 1 230 px.

### 7. Миниатюра: от линии прописных до линии нижних выносных
```css
.idx__thumb {
  display: inline-block; margin-left: 0.4em;
  width: 1.6em; height: 0.93em; vertical-align: -0.2em;  /* верх = прописные (0.727em), низ = выносные (−0.2em) */
  overflow: hidden;
}
```
Зачем: картинка встаёт в строку как ещё один «знак» на линиях шрифта, а не плавает над ней. Пропорция примерно 16:9, она ближе к скриншотам сайтов. Ширина меньше прежней, и это даёт запас для п. 4.

### 8. Пометка: цвет и регистр остаются
Цвет `var(--fg)`, не `--mute`. Скобки обычные `( )`, без `font-feature-settings: "case"`: пометки в основном строчные, а скобки Inter по умолчанию отцентрованы как раз по строчным. Новых наборов Inter (`ss01`, `cv11`) не вводить: на сайте их нет нигде, и одна только эта таблица с другими цифрами или «a» выпадет из системы.
Зачем: чёрная мелкая пометка читается как часть названия (так в референсе), серая стала бы подписью.
Данные, не CSS: в EN у Powermatic «Design & Development» с заглавной, у остальных регистр предложения («Website design»). Предлагаю «Design & development» в `site_config.py`.

### 9. Повторяющийся год приглушить (по желанию, нужна разметка)
Первый год группы чёрный, повторы `--mute`. Список читается пятью группами (2026…2022), а колонка годов остаётся полной и ровной, как в программе.
```python
# project_index(): перед циклом
prev = None
# в цикле, вместо <span class="idx__year">
rep = " idx__year--rep" if p["year"] == prev else ""
prev = p["year"]
... f'<span class="idx__year{rep}">{t(p["year"])}</span>'
```
```css
.idx__year--rep { color: var(--mute); }
```
Зачем: 17 одинаковых «2026» подряд сейчас весят столько же, сколько названия. Если владелец хочет буквально как в Kulturloft (все даты чёрные), пункт пропускаем, остальное от него не зависит.

### 10. Телефон (контейнер < 460px): размеры из системы сайта
```css
@container (max-width: 459px) {
  .idx__row { grid-template-columns: 3.6em minmax(0, 1fr); padding: 0.3em 0 0.32em; }
  .idx__year { font-size: 13px; letter-spacing: 0; }
  .idx__note {
    display: block; position: static; top: auto; margin: 0.2em 0 0;
    font-size: 13px; line-height: 1.3; letter-spacing: 0; white-space: normal; color: var(--mute);
  }
  .idx__name .r { position: static; }                  /* знак остаётся у слова, по общему правилу .r */
  .idx__thumb { display: none; }
}
```
Зачем: 11 px и 12.2 px (`0.72em`) не встречаются больше нигде на сайте. 13 px и `--mute` — это размер `.count`, `.block__no` и подписей. Под названием пометка стоит отдельной строкой, а не продолжает его, поэтому здесь её можно сделать серой подписью.

### 11. Защита от переносов
```css
.idx__name { min-width: 0; text-wrap: pretty; }
.idx__note, .idx__thumb { white-space: nowrap; }
```
Перенос между словом и `(` уже запрещён правилами переноса строк (LB30). `pretty` не даст длинному названию на телефоне («Сайт, мобильная версия», «Website from a concept») оставить одно слово на второй строке.

### 12. Отдельные случаи
`.dotslash/` начинается с точки, и визуально строка начинается на полшага правее. Оставить: это имя, и левый край по точке честный. Висячую пунктуацию (`hanging-punctuation`) не применять: она работает только в Safari и не на точках.

## Итоговый блок целиком (заменяет правила от `.idx-block` до конца `@container`)

```css
.idx-block { container-type: inline-size; --idx-rule: 1px; }
@media (min-resolution: 2dppx) { .idx-block { --idx-rule: 1.5px; } }
.idx { --fs: clamp(17px, 3.9cqi, 30px); border-bottom: var(--idx-rule) solid var(--fg); }
.idx__row {
  display: grid; grid-template-columns: 4.3em minmax(0, 1fr); column-gap: 0.6em; align-items: baseline;
  padding: 0.26em 0 0.14em; border-top: var(--idx-rule) solid var(--fg);
  font-size: var(--fs); line-height: 1.15; letter-spacing: -0.035em;
}
.idx__year { font-variant-numeric: tabular-nums; letter-spacing: -0.01em; white-space: nowrap; }
.idx__year--rep { color: var(--mute); }               /* п. 9, по желанию */
.idx__name { min-width: 0; text-wrap: pretty; }
.idx__note {
  margin-left: 0.3em; font-size: max(10px, calc(var(--fs) * 0.4)); line-height: 0; letter-spacing: 0.005em;
  vertical-align: 0; position: relative; top: calc((var(--fs) - 1em) * -0.727); white-space: nowrap;
}
.idx__thumb { display: inline-block; margin-left: 0.4em; width: 1.6em; height: 0.93em; vertical-align: -0.2em; overflow: hidden; white-space: nowrap; }
.idx__thumb :is(picture, img) { display: block; width: 100%; height: 100%; object-fit: cover; }
@container (min-width: 460px) {
  .idx__name .r {
    font-size: max(10px, calc(var(--fs) * 0.4)); line-height: 0; vertical-align: 0;
    position: relative; top: calc((var(--fs) - 1em) * -0.727); margin-left: 0.15em;
  }
  .idx__name .r + .idx__note { margin-left: 0.25em; }
}
@container (max-width: 459px) {
  .idx__row { grid-template-columns: 3.6em minmax(0, 1fr); padding: 0.3em 0 0.32em; }
  .idx__year { font-size: 13px; letter-spacing: 0; }
  .idx__note { display: block; position: static; margin: 0.2em 0 0; font-size: 13px; line-height: 1.3; letter-spacing: 0; white-space: normal; color: var(--mute); }
  .idx__thumb { display: none; }
}
/* в анимации появления: все «1.5px» → var(--idx-rule) */
```

Примечание к реализации: `--fs` задан на `.idx`, а не на `.idx-block`. Единицы `cqi` на самом контейнере считаются от его предка, а пользовательское свойство подставляется там, где его используют, то есть уже внутри контейнера. После правки проверить на 1200, 1440 и 375, RU и EN: строки Powermatic и Contour Office (знак + пометка), «2023–24», «Сайт, мобильная версия».
