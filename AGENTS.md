<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Визуальные требования Avelia

- Читать docs/REVISION-02.md перед изменением дизайна. Пользователь считает анимацию основным критерием качества.
- Анализировать поведение референса в браузере: старт, середина и конец движения; меню, скролл и переход страниц. Статичный скриншот не заменяет этот разбор.
- Не добавлять декоративные стрелки в карточки, кнопки и футер. Ленты управляются текстовыми кнопками и индикаторами.
- Не использовать абстрактные слоганы про заботу, свет, воздух и тихие детали. Тексты должны объяснять конкретную услугу, оборудование или порядок визита.
- Сравнивать фотографии по сюжету и ракурсу, а не только по хешу. Проверять соседние изображения в готовой странице.
- Проверять каждую категорию каталога, размеры карточек, мобильную версию, повторные переходы и reduced-motion. Успешная сборка не означает успешную визуальную проверку.
- Глобальное описание вымышленного проекта находится в футере и /project. Не дублировать его в каждом профиле врача.
