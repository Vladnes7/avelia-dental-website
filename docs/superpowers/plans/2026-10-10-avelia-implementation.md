# АВЕЛИЯ — план реализации

> Для последовательного исполнения: использовать `superpowers:executing-plans` после утверждения подробного плана. Этапы отслеживать чекбоксами. План не является разрешением на немедленную сборку.

**Цель:** создать утверждённый сайт АВЕЛИИ на 36 содержательных страниц с 84 оригинальными кадрами и качеством движения, проверенным сначала на прототипе.

**Архитектура:** Next.js App Router, общие оболочка/шаблоны, централизованные данные услуг, специалистов, статей и медиа. Server Components для контента, небольшие client-компоненты для меню, тем, hero, лент, FAQ и демо-записи. Не превращать весь сайт в одну монолитную client-страницу.

**Стек:** TypeScript, Tailwind CSS, Motion, Sharp для оптимизации, встроенный imagegen; версии и совместимость проверить по официальным документациям перед установкой. CSS/browser APIs используются там, где отдельная библиотека не нужна.

**Спецификация:** `/Users/vladislav/Documents/ChatGPT/Dentist Website/SPEC.md`, `PLAN.md`, `_материалы/фото/PHOTO-PLAN.md`, `photo-plan.json`. Обязательный контекст: `/Users/vladislav/Desktop/ARCHIPILA-LESSONS-FOR-DENTAL-WEBSITE.md`.

Дополнительные входные данные: `_материалы/demo-content.json`, `_материалы/демо-контент.md`, `scrollcraft/builds/avelia/BRIEF.md`, `MOTION-PLAN.md`. Оценка 4,9, вымышленные отзывы, адрес и календарь разрешены прямым последующим запросом пользователя. Роли навыков: scroll-craft — сцены/глубина/проверка; apple-design — прерываемость и свайпы; emil-design-eng — интерфейсная полировка; refero-design — визуальный ориентир Aveline.

## Общие ограничения

- 36 маршрутов: 9 общих, 10 услуг, 8 врачей, 9 статей; состав PLAN.md исполняется только после утверждения.
- 84 оригинальных кадра; производные размеры не учитываются как дополнительные фото.
- Русский текст, локальные кириллические шрифты, плотные заголовки и утверждённые цвета.
- Демо-форма не передаёт контакты, не сообщает об отправке/реальной записи.
- Рейтинг 4,9 и 8 вымышленных отзывов — собственные демонстрационные данные, без выдуманного Google/Яндекс-источника.
- Вымышленный адрес: Москва, улица Тихого Света, 12. Внешний маршрут к настоящему учреждению не создаётся.
- Календарь и ближайший слот hero используют единую модель в Europe/Moscow.
- Нет декоративных номеров секций, фото поверх текста и пустых маршрутов.
- Все головы целые в исходнике, карточках, профиле и hover.
- Пользователь согласует прототип до расширения, публикацию отдельно.

## Основные риски проверки

1. Длинный русский title/фамилия на 375–390 px — нет переполнения и развалившихся переносов.
2. Быстрый повторный клик меню/FAQ/врача — состояние остаётся управляемым, фокус не теряется.
3. Изменение услуги после выбора врача/слота — несовместимый выбор очищается с объяснением.
4. Медленный/ошибочный hero — интерфейс и контент доступны, заставка не зависает.
5. Reduced motion, новая вкладка и Back — декоративные механизмы не ломают браузерное поведение.

## Файлы и ответственность

| Файл/группа | Назначение |
| --- | --- |
| `site/app/layout.tsx`, `globals.css` | Шрифты, токены, метаданные, оболочка |
| `site/components/shell/{header,menu,footer,theme-toggle}.tsx` | Навигация, меню, темы |
| `site/components/motion/{reveal,route-transition,preloader}.tsx` | Движение и reduced motion |
| `site/components/home/{hero,home,services-strip,doctor-selector,journal-strip,reviews}.tsx` | Главная, отзывная лента и интерактивные блоки |
| `site/components/ui/{button,faq,media}.tsx` | Общие элементы, доступные панели и фото |
| `site/components/templates/{service,doctor,article}.tsx` | Три типа подробных страниц |
| `site/components/appointment/{form,calendar,day-strip,visit-summary}.tsx`, `model.ts`, `availability.ts` | Демо-сценарий, календарь, лента дней, карточка визита |
| `site/content/{types,services,doctors,articles,reviews,clinic,navigation,media,routes}.ts` | Единая модель данных, отзывов, адреса и маршрутов |
| `site/components/motion/{scroll-scenes,hero-layers}.tsx`, `site/public/vendor/scrollcraft/` | Собственная интеграция и неизменённый engine навыка |
| `site/scripts/{optimize-media,audit-site}.mjs` | Медиа и проверка собранных маршрутов |
| `site/tests/{content,appointment,availability,reviews}.test.ts` | Содержательные тесты связей, календаря и оценки |
| `site/README.md` | Запуск, команды, демо-режим, ограничения |

Пути описывают будущие файлы: сейчас код отсутствует. Адреса Next.js соответствуют PLAN.md; динамические страницы используют `[slug]` и `generateStaticParams`, неизвестный slug даёт штатную 404.

## Контракт данных

```ts
type ContentBlock = { heading: string; paragraphs: string[]; mediaId?: string };
type FAQItem = { question: string; answer: string };
type Service = {
  slug: string; title: string; lead: string; categoryIds: string[];
  doctorIds: string[]; mediaIds: [string, string, string];
  blocks: ContentBlock[]; faq: FAQItem[];
  demoPrice: { amountRub: number; qualifier: string; includes: string[] };
};
type Doctor = {
  id: string; slug: string; name: string; specialty: string;
  serviceSlugs: string[]; portraitId: string; contextMediaId: string;
  approach: string[]; questions: string[];
};
type Article = {
  slug: string; title: string; category: string; lead: string;
  coverId: string; inlineId: string; blocks: ContentBlock[];
  serviceSlugs: string[]; sources: { title: string; url: string }[];
};
type MediaAsset = {
  id: string; src: string; width: number; height: number; alt: string;
  focalPoint: [number, number]; variants: { src: string; width: number }[];
};
type AppointmentSelection = {
  serviceSlug: string | null; doctorId: string | null;
  day: string | null; slot: string | null;
};
```

Имена полей одинаковы в контенте, шаблонах и форме. Демо-цены заполняются только согласованными числами. `getStaticRoutes(): string[]` возвращает 9 общих адресов и адреса всех записей контента; уникальность и связи проверяются.

## Этап 1. Утверждение и первая фотосерия

- [ ] Зафиксировать ответ Влада в SPEC.md: структура, визуальная система, движение, темы и фотостиль.
- [ ] Утвердить конкретный художественный стиль I02 и портретов до массовой генерации.
- [ ] Применить imagegen: I02 → D01-A → I04 → H01 → H04 → I08. Передавать реальные утверждённые опоры и сохранять каждый выбранный исходник в проект.
- [ ] Показать исходники, портретный/hero-кропы и меню; внести конкретные правки.
- [ ] Сгенерировать D08-A, I06, S01-A для прототипа услуги после утверждения направления.

Результат: согласованный эталон фотографий и набор для прототипа. Не использовать незавершённые кадры как окончательно утверждённые.

## Этап 2. Законченный прототип

- [ ] Создать `site/` и зависимости, сверив текущие официальные требования Node/Next/Motion; записать реально используемые версии в lockfile и README.
- [ ] Подключить локальные Manrope/Onest, реализовать утверждённые токены и темы.
- [ ] Реализовать оболочку, меню с фокусом/Escape/scroll lock и ссылками всех основных разделов.
- [ ] Собрать hero и переход к первому визиту, одну карточку услуги, один профильный модуль врача и FAQ с настоящими текстами.
- [ ] Реализовать reduced motion, ручную паузу hero, резервные состояния фото и завершение заставки.
- [ ] Подготовить clean plate и alpha-слои hero, проверить края и общую опору; подключить неизменённый движок scroll-craft через собственный React-lifecycle-модуль. Не назначать scroll-craft и Motion на одно transform-свойство.
- [ ] Добавить компактный рейтинг 4,9 и рабочую ленту дней/слотов на прототип, чтобы оценить их вместе с hero и меню.
- [ ] Запустить dev-сервер в устойчивой сессии, проверить реальный отвечающий URL.
- [ ] В браузере: 375/390/768/1440 px, темы, длинный title, повторные клики, Escape, reduced motion, медленная загрузка; сохранить экраны.
- [ ] Показать Владу прототип в движении и исправить замечания до следующего этапа.

Результат: проверяемая законченная композиция с согласованным темпом. Маршруты будущих страниц не выдавать за готовые материалы.

## Этап 3. Контент и медиа

- [ ] Подготовить 10 Service, 8 Doctor и 9 Article по карте PLAN.md; согласовать тексты, цены и демонстрационные сведения.
- [ ] Проверить медицинские утверждения первичными источниками, сохранить ссылки рядом с соответствующими статьями.
- [ ] Завершить портреты/интерьеры → остальные hero → услуги → статьи → поддерживающие фото по зависимостям `photo-plan.json`.
- [ ] После каждого набора осмотреть лица, руки, оборудование, свет и единообразие; исправить реальные проблемы.
- [ ] Создать оптимизацию Sharp без увеличения маленьких исходников под видом нативного разрешения; сохранить фактические размеры и focal point.
- [ ] Сформировать media-манифест: все 84 оригинала доступны, производные связаны с ними, ни один srcset не лжёт о ширине.

Проверка связности контента (тест использует реальные записи, а не дублирует их значения):

```ts
import { describe, it, expect } from 'vitest';
import { services } from '../content/services';
import { doctors } from '../content/doctors';
import { articles } from '../content/articles';
import { media } from '../content/media';
import { getStaticRoutes } from '../content/routes';

describe('content graph', () => {
  it('has the approved unique routes', () => {
    const routes = getStaticRoutes();
    expect(routes).toHaveLength(36);
    expect(new Set(routes).size).toBe(36);
  });
  it('resolves service doctors and photos', () => {
    const doctorIds = new Set(doctors.map(d => d.id));
    const mediaIds = new Set(media.map(m => m.id));
    for (const s of services) {
      expect(s.blocks.length).toBeGreaterThan(0);
      for (const id of s.doctorIds) expect(doctorIds.has(id)).toBe(true);
      for (const id of s.mediaIds) expect(mediaIds.has(id)).toBe(true);
    }
    for (const a of articles) {
      expect(a.blocks.length).toBeGreaterThan(0);
      expect(mediaIds.has(a.coverId)).toBe(true);
      expect(mediaIds.has(a.inlineId)).toBe(true);
    }
  });
});
```

## Этап 4. Полные страницы

- [ ] Собрать главную по 11 блокам PLAN.md, полную шапку/футер и общую систему переходов.
- [ ] Подключить 8 отзывов и рейтинг из единого источника, добавить центральную ленту цитат с паузами. Статичный рейтинг, без счётчика роста.
- [ ] Добавить вымышленный адрес и график из clinic-данных в контакты, футер и карточку визита; собственную условную схему вместо ложного внешнего маршрута.
- [ ] Собрать клинику, каталог услуг, список врачей, цены, журнал, контакты, о проекте.
- [ ] Собрать ServiceTemplate с коротким title/лидом, 3 фото, этапами, врачом, FAQ и записью.
- [ ] Собрать DoctorTemplate и ArticleTemplate с уникальными данными, полноразмерными материалами и связанными переходами.
- [ ] Сгенерировать все адреса из контента, индивидуальные metadata; сделать штатную 404, не добавляя её к числу 36.
- [ ] Проверить каждую страницу целиком: композиция, контент, отступы, фото, головы, реальная длина строк, связи и отсутствие пустых половин.

Результат: 35 содержательных страниц и структура страницы записи; после этапа 5 — все 36.

## Этап 5. Демо-запись

Сценарий без внешней отправки и хранения контактных данных. `chooseService(selection, slug)` возвращает новый выбор; при изменении направления очищает doctor/day/slot. `compatibleDoctors(slug)` выводит связанных врачей. `chooseDoctor(selection, id)` отклоняет несовместимый ID, меняет doctor и очищает day/slot. Разрешён «Помогите выбрать». Расписание явно демонстрационное.

Контракт календаря: `moscowDateKey(now: Date): string` даёт календарную дату Europe/Moscow; `getDemoSlots({ day, doctorId, now }): { time: string; available: boolean }[]` возвращает стабильные слоты; `getNextDemoSlot({ serviceSlug, doctorId, now }): { day: string; time: string } | null` применяется и в hero, и в форме. Пустой день не подменяется случайным временем. Демо-доступность воспроизводима от ISO-даты и ID врача; прошедшие московские даты и сегодняшние времена недоступны.

- [ ] Написать тест смены услуги/врача со слотом, совместимости и понятного финала, убедиться, что тест падает до реализации модели.
- [ ] Реализовать модель, поля имени/телефона, сообщения об ошибках и обзор выбора без сетевого запроса.
- [ ] Реализовать 7-дневную горизонтальную ленту со свайпом и стрелками, месячную сетку с понедельника, доступные/занятые слоты и карточку визита. Дни не автоперелистываются.
- [ ] Предзаполнять услугу/врача из hero и карточек, сохранять выбранные несекретные значения при переходе к /appointment; не сохранять имя/телефон в URL или localStorage.
- [ ] Проверить, что русский номер с пробелами, скобками и +7/8 приводится к единому виду; пустой, короткий и текстовый телефон не проходят.
- [ ] Реализовать честный итог «Демонстрация завершена. Заявка не отправлена»; кнопка не обещает настоящую запись.
- [ ] Проверить вход из услуги/врача, Back, смену выбора, экранную клавиатуру и читабельность ошибок.

Тест перехода состояния:

```ts
import { it, expect } from 'vitest';
import { chooseService, compatibleDoctors, chooseDoctor } from '../components/appointment/model';
it('clears stale choices when changing service', () => {
  const selected = { serviceSlug: 'diagnostics', doctorId: 'D08', day: 'demo-day-1', slot: '09:15' };
  expect(chooseService(selected, 'children')).toEqual({
    serviceSlug: 'children', doctorId: null, day: null, slot: null
  });
});
it('rejects a doctor outside the selected service', () => {
  const selection = { serviceSlug: 'children', doctorId: null, day: null, slot: null };
  expect(compatibleDoctors('children').map(d => d.id)).not.toContain('D04');
  expect(() => chooseDoctor(selection, 'D04')).toThrow();
});
```

Дополнительные тесты календаря и рейтинга:

```ts
import { it, expect } from 'vitest';
import { moscowDateKey, getDemoSlots } from '../components/appointment/availability';
import { reviews, getDisplayRating } from '../content/reviews';
it('uses Moscow date at UTC midnight boundary', () => {
  expect(moscowDateKey(new Date('2026-10-31T22:30:00Z'))).toBe('2026-11-01');
});
it('does not offer past days', () => {
  const slots = getDemoSlots({ day: '2026-10-31', doctorId: 'D01', now: new Date('2026-11-01T12:00:00Z') });
  expect(slots.every(slot => !slot.available)).toBe(true);
});
it('has stable demo slots', () => {
  const input = { day: '2026-11-02', doctorId: 'D01', now: new Date('2026-11-01T12:00:00Z') };
  expect(getDemoSlots(input)).toEqual(getDemoSlots(input));
});
it('derives 4.9 from eight fictional reviews', () => {
  expect(reviews).toHaveLength(8);
  expect(getDisplayRating(reviews)).toBe('4,9');
});
```

`getDisplayRating(reviews)` вычисляет среднее и форматирует ru-RU с одним десятичным знаком; читает те же записи, которые показываются в ленте. Дополнительно проверить конец года, московскую полночь, сегодня после закрытия, следующий воскресный день, полностью занятый день и смену выбранного врача со старым слотом.

## Этап 6. Приёмка и сдача

- [ ] Выполнить `npm run test`, `npm run typecheck`, `npm run build`; команды должны реально существовать в package.json.
- [ ] `npm run audit:site`: из getStaticRoutes проверять title/H1, внутренние ссылки, существование медиа и уникальность маршрутов собранного сайта; результат должен перечислить 36 страниц.
- [ ] Браузерный проход каждого типа и затем всех маршрутов: 375/390/768/1280/1440 px, обе темы при их выборе, длинная кириллица, кадрирование и отсутствие переполнения.
- [ ] Проверить меню и FAQ при быстрых повторных действиях; фокус, Escape, touch, reduced motion, Cmd/Ctrl-click и Back.
- [ ] Пройти промежуточные состояния scroll-craft: старт/середина/конец и шесть положений длинных сцен; показать слои без двойных лиц, дыр в фоне, дрейфа опоры и перекрытого заголовка.
- [ ] Проверить ленту отзывов, календарь, переход недели/месяца, пустой день, московскую смену даты и одинаковый ближайший слот в hero/форме.
- [ ] Проверить offscreen/hidden-tab паузу, ручную остановку лент и освобождение RAF/таймеров.
- [ ] Сохранить скриншоты, перечень исправлений и README с проверенным запуском. Не заявлять проверенные FPS без измерения.
- [ ] Показать результат Владу и выполнить замечания. Публикация или внешний репозиторий только в рамках отдельной авторизации.

## Самопроверка плана

Структура 36 страниц покрыта этапами 3–5; 84 фото — этапами 1 и 3; движения, темы, меню — этапами 2 и 4; форма — этапом 5; правила Archipila — прототипом и финальной приёмкой. Пять рисков проверяются в своих этапах. Зависимости фотосерии исправлены: I04 предшествует H01, D08-A и I06 предшествуют S01-A. Неизвестные решения имеют явные пользовательские точки согласования, не маскируются пустыми задачами.
