Вот **строгое, лаконичное описание** для README, без лишних эмодзи и воды — только техническая суть:

```markdown
# tg-massage

Cloudflare Worker для периодического получения лучших цен покупки/продажи (Bid/Ask) BTC/USDT с биржи Free2EX и отправки уведомлений в Telegram.

## Функционал

- HTTP-запрос к публичному API Free2EX: `https://cryptottlivewebapi.free2ex.net:8443/api/v2/public/level2/BTCUSDT?depth=1`
- Извлечение полей: `BestBid.Price`, `BestAsk.Price`, `Timestamp`
- Вычисление спреда: `Ask - Bid`
- Формирование текстового сообщения
- Отправка через Telegram Bot API (метод `sendMessage`)

## Технологии

- Cloudflare Workers (runtime)
- Cloudflare KV (хранение `BOT_TOKEN` и `CHAT_ID`)
- Telegram Bot API
- Free2EX Public API

## Конфигурация

### 1. Переменные окружения (KV)

| Ключ | Значение |
|------|----------|
| `BOT_TOKEN` | Токен бота от @BotFather |
| `CHAT_ID` | Целевой chat ID (пользователь или группа) |

Запись в KV:
```bash
wrangler kv:key put --binding=myVar "BOT_TOKEN" "<token>"
wrangler kv:key put --binding=myVar "CHAT_ID" "<id>"
```

### 2. Расписание (cron)

Настраивается в `wrangler.toml`:
```toml
[triggers]
crons = ["*/5 * * * *"]  # интервал по желанию
```

### 3. KV binding в `wrangler.toml`

```toml
kv_namespaces = [
  { binding = "myVar", id = "<id>", preview_id = "<preview_id>" }
]
```

## Методы

### `scheduled(event, env)`

Основной метод. Выполняется по cron-расписанию:
- Читает `BOT_TOKEN` и `CHAT_ID` из KV
- Запрашивает данные с Free2EX
- Отправляет сообщение в Telegram

### `fetch(request, env)`

Вызывает `scheduled()` синхронно. Используется для ручного тестирования.

## Формат сообщения

```
BTC/USDT
Bid (покупка): <цена>
Ask (продажа): <цена>
Spread: <разница>
<timestamp>
```

## Логирование

Все этапы логируются в консоль Cloudflare Worker:
- `❌ BOT_TOKEN или CHAT_ID не найдены в KV`
- `📡 Запрос к API: <url>`
- `📤 Отправка в Telegram: <url>`
- `✅ Сообщение успешно отправлено в Telegram`
- `❌ Ошибка: <err>`

## Запуск

Локальная разработка:
```bash
wrangler dev
# Открыть http://localhost:8787
```

Деплой:
```bash
wrangler deploy
```

Просмотр логов в реальном времени:
```bash
wrangler tail
```

## Зависимости

Отсутствуют. Используются только нативные `fetch` и Web API.

## Лицензия

MIT
```

**Что убрано:**
- Все эмодзи в заголовках и секциях
- Восклицательные знаки и призывы к действию
- Разделы "Вклад в проект", "Благодарности", "Возможные проблемы" (оставлен только минимум)
- Пояснения "как получить chat_id" — только сухая конфигурация

**Что сохранено:**
- Точное соответствие коду
- Все технические детали (KV, cron, структура данных)
- Команды для терминала
- Формат сообщения и логи

Такой README выглядит как документация для разработчика, а не как рекламный пост.
