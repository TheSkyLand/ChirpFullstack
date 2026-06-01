# Chirp Project

Full-stack веб-приложение. Бэкенд разработан на Spring Boot (Java / Maven), фронтенд — на React (JavaScript/TypeScript).

## Предварительные требования

Перед запуском проекта убедитесь, что у вас установлены:
* **Java SDK 17** (или выше)
* **Apache Maven 3.8+**
* **Node.js** (LTS версия)
* **PostgreSQL 14+**
* **Google Chrome** (для запуска без CORS)

---

## 1. Настройка базы данных PostgreSQL

Проекту необходима база данных с именем `chirp_db`. Вы можете создать её любым удобным способом.

### Вариант A: Через терминал (psql)
1. Откройте терминал и подключитесь к PostgreSQL:
   ```bash
   psql -U postgres
   ```
2. Создайте базу данных:
   ```sql
   CREATE DATABASE chirp_db;
   ```

### Вариант B: Через pgAdmin / DBeaver
1. Подключитесь к вашему серверу PostgreSQL.
2. Нажмите правой кнопкой мыши на раздел **Databases** -> **Create** -> **Database...**
3. В поле имени укажите `chirp_db` и нажмите **Save**.

### Настройка подключения в бэкенде
Откройте файл `backend/src/main/resources/application.properties` и проверьте параметры подключения:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/chirp_db
spring.datasource.username=ваш_логин_postgres
spring.datasource.password=ваш_пароль_postgres
spring.jpa.hibernate.ddl-auto=update
```

---

## 2. Запуск бэкенда в IntelliJ IDEA

1. Запустите **IntelliJ IDEA**.
2. Выберите **File** -> **Open** и укажите путь к папке `backend` (папка, где находится файл `pom.xml`).
3. Дождитесь, пока Maven загрузит все зависимости (процесс индексации в правом нижнем углу).
4. Найдите главный класс приложения (обычно `ChirpApplication.java` в директории `src/main/java/...`).
5. Нажмите зелёную стрелку **Run** (или сочетание клавиш `Shift + F10`) рядом с методом `main`.
6. Бэкенд запустится на порту `8080` (http://localhost:8080).

---

## 3. Запуск фронтенда в Visual Studio Code

1. Запустите **Visual Studio Code**.
2. Выберите **File** -> **Open Folder...** и откройте папку `frontend` (папка, где находится файл `package.json`).
3. Откройте встроенный терминал в VS Code (`Ctrl + ~` или `Cmd + ~` на macOS).
4. Установите зависимости проекта:
   ```bash
   npm install
   ```
5. Запустите сервер для разработки React:
   ```bash
   npm start
   ```
   *(или `npm run dev`, если проект инициализирован через Vite)*

---

## 4. Запуск браузера без CORS (Важно)

Поскольку бэкенд и фронтенд работают на разных портах, для тестирования необходимо запустить Google Chrome с отключенной политикой безопасности CORS.

**Перед запуском полностью закройте все открытые окна Chrome!**

### Windows
Нажмите `Win + R`, вставьте команду и нажмите Enter:
```cmd
chrome.exe --user-data-dir="C:/chrome_dev" --disable-web-security
```

### macOS
Откройте Терминал и выполните:
```bash
open -na "Google Chrome" --args --user-data-dir="/tmp/chrome_dev" --disable-web-security
```

### Linux
Откройте Терминал и выполните:
```bash
google-chrome --user-data-dir="/tmp/chrome_dev" --disable-web-security
```

> **Примечание:** В открывшемся окне Chrome появится предупреждение о снижении безопасности. Используйте это окно строго для разработки и тестирования проекта `http://localhost:3000`.
