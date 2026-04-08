export default {
  async scheduled(event, env) {
    const token = env.BOT_TOKEN;
    const chat = env.CHAT_ID;

    try {
      // 1. Получаем данные с биржи
      const apiUrl = "https://cryptottlivewebapi.free2ex.net:8443/api/v2/public/level2/BTCUSDT?depth=1";
      
      console.log("📡 Запрос к API:", apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();

      // 2. Берём нужные данные (лучшая покупка и продажа)
      const bestBid = data[0].BestBid.Price;   // лучшая цена покупки
      const bestAsk = data[0].BestAsk.Price;   // лучшая цена продажи
      const timestamp = new Date(data[0].Timestamp).toLocaleString("ru-RU");

      // 3. Формируем красивое сообщение
      const text = `🪙 BTC/USDT\n\n` +
                   `💰 Bid (покупка): ${bestBid}\n` +
                   `📈 Ask (продажа): ${bestAsk}\n` +
                   `🔄 Spread: ${(bestAsk - bestBid).toFixed(2)}\n\n` +
                   `🕒 ${timestamp}`;

      // 4. Отправляем в Telegram
      const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
      
      console.log("📤 Отправка в Telegram:");
      console.log(tgUrl);

      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: text
        })
      });

      console.log("✅ Сообщение отправлено");

    } catch (err) {
      console.error("❌ Ошибка:", err);
    }
  },

  // Для ручного теста (просто открой ссылку воркера)
  async fetch(request, env) {
    await this.scheduled(null, env);
    return new Response("Сообщение отправлено! Проверь Telegram и логи.");
  }
};
