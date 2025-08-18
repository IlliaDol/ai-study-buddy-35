# 🔧 Налаштування змінних середовища

## Створення файлу .env.local

Створіть файл `.env.local` в корені проекту з наступним вмістом:

```env
# Stripe Configuration (замініть на ваші реальні ключі)
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

## Важливо!

- **Ніколи не комітьте** файл `.env.local` в git
- Додайте `.env.local` до `.gitignore`
- Для продакшену використовуйте реальні ключі Stripe

## Як отримати ключі Stripe:

1. Зареєструйтеся на [stripe.com](https://stripe.com)
2. Перейдіть в Dashboard → Developers → API keys
3. Скопіюйте `Publishable key` та `Secret key`
4. Вставте їх у файл `.env.local`
