# 💳 Налаштування системи оплати CoffeeOracle

## 🚀 Швидкий старт

### 1. Створення акаунту Stripe
1. Перейдіть на [stripe.com](https://stripe.com)
2. Зареєструйтеся та створіть акаунт
3. Перейдіть в Dashboard → Developers → API keys
4. Скопіюйте `Publishable key` та `Secret key`

### 2. Налаштування змінних середовища
Створіть файл `.env.local` в корені проекту:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_test_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here

# App Configuration
NEXT_PUBLIC_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=CoffeeOracle
NEXT_PUBLIC_APP_DESCRIPTION=AI-Powered Coffee Ground Divination

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=hello@coffeeoracle.org
NEXT_PUBLIC_CONTACT_TWITTER=@coffeeoracle
NEXT_PUBLIC_CONTACT_GITHUB=coffeeoracle

# Domain Configuration
NEXT_PUBLIC_DOMAIN=coffeeoracle.org
```

### 3. Тестування
1. Запустіть проект: `npm run dev`
2. Відкрийте http://localhost:3000
3. Виберіть намерение (Love, Money, Education, Luck)
4. Оберіть план оплати
5. Використайте тестові дані картки Stripe

## 🧪 Тестові дані карток

### Успішна оплата:
- **Номер:** 4242 4242 4242 4242
- **Термін:** Будь-яка майбутня дата
- **CVC:** Будь-які 3 цифри
- **ZIP:** Будь-які 5 цифр

### Скасована оплата:
- **Номер:** 4000 0000 0000 0002

### Недостатньо коштів:
- **Номер:** 4000 0000 0000 9995

## 💰 Моделі монетизації

### Freemium модель:
- **Безкоштовно:** 1 пророцтво на день
- **Premium ($9.99/міс):** Необмежена кількість пророцтв
- **VIP ($19.99/міс):** Пророцтва + детальна аналітика + експертні поради

### Pay-per-use:
- **$0.99** за кожне пророцтво
- **$2.99** за детальне пророцтво з астрологічними деталями

### Пакети:
- **5 пророцтв:** $3.99
- **10 пророцтв:** $6.99
- **20 пророцтв:** $11.99

## 🔧 Технічна архітектура

### Компоненти:
- `PaymentModal.tsx` - Модальне вікно з планами
- `IntentSelection.tsx` - Інтеграція з модальним вікном
- `app/api/create-checkout-session/route.ts` - API для Stripe

### Сторінки:
- `app/success/page.tsx` - Успішна оплата
- `app/cancel/page.tsx` - Скасована оплата

## 🌍 Підтримувані країни

Stripe підтримує 135+ країн, включаючи:
- 🇺🇸 США
- 🇨🇦 Канада
- 🇬🇧 Великобританія
- 🇩🇪 Німеччина
- 🇫🇷 Франція
- 🇮🇹 Італія
- 🇪🇸 Іспанія
- 🇺🇦 Україна

## 📱 Webhook налаштування

### 1. Створення webhook endpoint:
```bash
stripe listen --forward-to localhost:3000/api/webhooks
```

### 2. Додавання в Stripe Dashboard:
- Dashboard → Developers → Webhooks
- Endpoint URL: `https://coffeeoracle.org/api/webhooks`
- Events: `checkout.session.completed`, `payment_intent.succeeded`

## 🔒 Безпека

### Рекомендації:
1. **Ніколи не комітьте** `.env.local` в git
2. **Використовуйте HTTPS** в продакшені
3. **Валідуйте** всі вхідні дані
4. **Логуйте** всі транзакції
5. **Моніторте** підозрілу активність

### Перевірка платежів:
```typescript
// В webhook endpoint
const event = stripe.webhooks.constructEvent(
  request.body,
  signature,
  process.env.STRIPE_WEBHOOK_SECRET!
)

if (event.type === 'checkout.session.completed') {
  const session = event.data.object
  // Обробка успішної оплати
}
```

## 📊 Аналітика та моніторинг

### Stripe Dashboard:
- Переглядайте всі транзакції
- Аналізуйте конверсію
- Моніторте помилки
- Налаштовуйте алерти

### Власна аналітика:
- Відстежуйте популярні плани
- Аналізуйте поведінку користувачів
- Оптимізуйте ціни

## 🚀 Розгортання в продакшені

### 1. Оновлення змінних:
```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
NEXT_PUBLIC_URL=https://coffeeoracle.org
```

### 2. Налаштування домену:
- Додайте домен в Stripe Dashboard
- Налаштуйте webhook endpoints
- Перевірте SSL сертифікати

### 3. Тестування:
- Протестуйте всі сценарії оплати
- Перевірте webhook delivery
- Валідуйте email повідомлення

## 📞 Підтримка

### Stripe Support:
- [Документація](https://stripe.com/docs)
- [API Reference](https://stripe.com/docs/api)
- [Support Center](https://support.stripe.com)

### CoffeeOracle Support:
- Email: hello@coffeeoracle.org
- Twitter: @coffeeoracle
- GitHub: coffeeoracle

## 🎯 Наступні кроки

1. **Інтеграція з базою даних** для збереження користувачів
2. **Система підписок** для рекурентних платежів
3. **Аналітика користувачів** та персоналізація
4. **Мобільний додаток** з push-повідомленнями
5. **Партнерська програма** для блогерів

---

**Примітка:** Це тестова версія. Для продакшену замініть всі тестові ключі на реальні та налаштуйте додаткові заходи безпеки.
