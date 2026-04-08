export default {
  async scheduled(event, env) {
    try {
      // === Читаем токен и chat_id из KV ===
      const token = await env.myVar.get("BOT_TOKEN");
      const chat = await env.myVar.get("CHAT_ID");

      if (!token || !chat) {
        console.error("❌ BOT_TOKEN или CHAT_ID не найдены в KV!");
        return;
      }

      // 1. Получаем данные с биржи
      const apiUrl = "https://cryptottlivewebapi.free2ex.net:8443/api/v2/public/level2/BTCUSDT?depth=1";
     
      console.log("📡 Запрос к API:", apiUrl);

      const response = await fetch(apiUrl);
      const data = await response.json();

      // 2. Берём нужные данные
      const bestBid = data[0].BestBid.Price;
      const bestAsk = data[0].BestAsk.Price;
      const timestamp = new Date(data[0].Timestamp).toLocaleString("ru-RU");

      // 3. Формируем сообщение
      const text = `🪙 BTC/USDT\n\n` +
                   `💰 Bid (покупка): ${bestBid}\n` +
                   `📈 Ask (продажа): ${bestAsk}\n` +
                   `🔄 Spread: ${(bestAsk - bestBid).toFixed(2)}\n\n` +
                   `🕒 ${timestamp}`;

      // 4. Отправляем в Telegram
      const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
     
      console.log("📤 Отправка в Telegram:");
      console.log(tgUrl);   // покажет URL без токена в логах (токен не логируется)

      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: text
        })
      });

      console.log("✅ Сообщение успешно отправлено в Telegram");

    } catch (err) {
      console.error("❌ Ошибка:", err);
    }
  },

  // Для ручного теста — просто открой ссылку воркера
  async fetch(request, env) {
    await this.scheduled(null, env);
    return new Response("Сообщение отправлено! Проверь Telegram и логи Worker.");
  }
};
