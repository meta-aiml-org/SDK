# Инструкция по публикации NPM пакета @meta-aiml/parser

## Шаг 1: Подготовка аккаунта NPM

1. **Создайте аккаунт на NPM:**
   - Зайдите на https://www.npmjs.com/
   - Нажмите "Sign Up"
   - Заполните форму регистрации
   - Подтвердите email

2. **Настройте двухфакторную аутентификацию (рекомендуется):**
   - Зайдите в Account Settings → Two-Factor Authentication
   - Включите 2FA для Auth and Publishes

3. **Войдите в аккаунт через терминал:**
   ```bash
   npm login
   # Введите username, password и email
   # При включенной 2FA введите одноразовый код
   ```

4. **Проверьте авторизацию:**
   ```bash
   npm whoami
   # Должен показать ваш username
   ```

## Шаг 2: Подготовка пакета

1. **Перейдите в папку с пакетом:**
   ```bash
   cd package-sdk
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Проверьте TypeScript:**
   ```bash
   npm run type-check
   ```

4. **Соберите пакет:**
   ```bash
   npm run build
   ```

5. **Проверьте содержимое пакета:**
   ```bash
   npm pack --dry-run
   # Покажет какие файлы будут включены в пакет
   ```

## Шаг 3: Публикация

1. **Проверьте доступность имени пакета:**
   ```bash
   npm view @meta-aiml/parser
   # Если пакет не существует, получите ошибку 404 - это хорошо
   ```

2. **Если имя занято, измените в package.json:**
   ```json
   {
     "name": "@ваш-username/aiml-parser"
   }
   ```

3. **Публикуйте пакет:**
   ```bash
   npm publish --access public
   # --access public нужен для scoped packages (@meta-aiml/parser)
   ```

4. **Проверьте публикацию:**
   ```bash
   npm view @meta-aiml/parser
   # Должен показать информацию о пакете
   ```

## Шаг 4: Обновление версий

Для последующих обновлений:

1. **Внесите изменения в код**

2. **Обновите версию:**
   ```bash
   # Для небольших исправлений (1.0.0 → 1.0.1)
   npm version patch

   # Для новых функций (1.0.0 → 1.1.0)
   npm version minor

   # Для breaking changes (1.0.0 → 2.0.0)
   npm version major
   ```

3. **Соберите и опубликуйте:**
   ```bash
   npm run build
   npm publish
   ```

## Шаг 5: Настройка CI/CD (опционально)

Создайте GitHub Actions для автоматической публикации:

1. **Создайте .github/workflows/publish.yml:**
   ```yaml
   name: Publish Package

   on:
     push:
       tags:
         - 'v*'

   jobs:
     publish:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3

         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             registry-url: 'https://registry.npmjs.org'

         - name: Install dependencies
           run: npm ci

         - name: Build
           run: npm run build

         - name: Publish
           run: npm publish --access public
           env:
             NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
   ```

2. **Создайте NPM токен:**
   - Зайдите на https://www.npmjs.com/settings/tokens
   - Создайте новый Automation token
   - Добавьте его в GitHub Secrets как NPM_TOKEN

## Проверка установки

После публикации проверьте, что пакет корректно устанавливается:

```bash
# В новой папке
mkdir test-install
cd test-install
npm init -y
npm install @meta-aiml/parser

# Создайте test.js
echo 'const { AIMLParser } = require("@meta-aiml/parser"); console.log("OK");' > test.js
node test.js
```

## Troubleshooting

### Ошибка: "Package name too similar"
NPM может отклонить пакет если имя слишком похоже на существующий. Измените название.

### Ошибка: "You do not have permission to publish"
Убедитесь что:
- Вы авторизованы: `npm whoami`
- Пакет не существует или вы его owner
- Используете `--access public` для scoped packages

### Ошибка: "Version already exists"
Увеличьте версию в package.json или используйте `npm version`

### Проблемы с 2FA
При включенной 2FA используйте App Password вместо обычного пароля в `npm login`

## Рекомендации

1. **Используйте семантическое версионирование (SemVer)**
2. **Ведите CHANGELOG.md** с описанием изменений
3. **Тестируйте пакет** перед публикацией
4. **Используйте .npmignore** чтобы исключить ненужные файлы
5. **Добавьте keywords** в package.json для лучшей находимости
6. **Настройте репозиторий** в package.json

## Полезные команды

```bash
# Проверить содержимое пакета
npm pack --dry-run

# Показать информацию о пакете
npm view @meta-aiml/parser

# Список ваших пакетов
npm profile get

# Отзыв версии (только в течение 72 часов)
npm unpublish @meta-aiml/parser@1.0.0

# Deprecate версию
npm deprecate @meta-aiml/parser@1.0.0 "Please use version 1.0.1+"
```
