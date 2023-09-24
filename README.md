
# giftToDocx

## Описание

Проект `giftToDocx` состоит из двух частей: [backend-сервиса](./convertator-servise) и [frontend-клиента](./client). В этом руководстве описано, как развернуть Node.js backend и Next.js frontend на VPS.

## Установка

### Шаг 1: Настройка сервера

1. **Подключение к серверу**: Вы можете сделать это через SSH с вашей локальной машины:
   ```bash
   ssh -i /путь/к/вашему/закрытому/ключу ubuntu@ip-адрес-сервера
   ```
2. **Создание нового пользователя**: Это должен быть пользователь, отличный от root, в целях безопасности. Используйте:
   ```bash
   adduser <имя_пользователя>
   ```
3. **Предоставление новому пользователю привилегий sudo**:
   ```bash
   usermod -aG sudo <имя_пользователя>
   ```

### Шаг 2: Установка Node.js и NPM

1. **Обновление сервера**:
   ```bash
   sudo apt update
   ```
2. **Установка Node.js**:
   ```bash
   sudo apt install nodejs
   ```
3. **Установка npm**:
   ```bash
   sudo apt install npm
   ```
4. **Проверка установки**: 
   ```bash
   node -v
   npm -v
   ```

### Шаг 3: Развертывание Backend и Frontend

1. **Копирование проекта на сервер**. Используйте Git, SCP или rsync для этого.
2. **Установка зависимостей**:
   - В каталоге backend: 
     ```bash
     cd giftToDocx/conversion-service
     npm install
     ```
   - В каталоге frontend:
     ```bash
     cd giftToDocx/client
     npm install
     npm run build
     ```

### Шаг 4: Настройка менеджера процессов

1. **Установка PM2**:
   ```bash
   sudo npm install pm2 -g
   ```
2. **Запуск ваших приложений с помощью PM2**:
   - В каталоге backend:
     ```bash
     pm2 start server.js --name backend
     ```
   - В каталоге frontend:
     ```bash
     pm2 start npm --name frontend -- start
     ```
3. **Настройка скриптов автозагрузки PM2**:
   ```bash
   pm2 startup
   ```

### Шаг 5: Настройка прокси

1. **Установка Nginx**:
   ```bash
   sudo apt install nginx
   ```
2. **Настройка Nginx**. Необходимо настроить блоки сервера для вашего backend на Node.js и frontend на Next.js.
3. **Проверка вашей конфигурации**:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Шаг 6: Настройка DNS

1. **Подключите ваш домен**.
2. **Тестирование вашего домена**.

### Шаг 7: Настройка HTTPS

1. **Получение SSL-сертификата**.
2. **Обновление конфигурации Nginx**.
3. **Обновление вашего файрвола**.

### Шаг 8: Обновление конфигурации CORS для Backend

Обязательно обновите настройки CORS на backend в файле server.js, чтобы избежать ошибки с CORS.

### Шаг 9: Планирование скрипта с использованием Cron

Чтобы автоматически запускать этот скрипт каждый день в полночь, вы можете использовать cron.

Откройте crontab для редактирования:

```bash
crontab -e
```

В конце файла добавьте следующую строку:

```bash
Copy code
0 0 * * * rm -rf /путь/к/public/папке
```
