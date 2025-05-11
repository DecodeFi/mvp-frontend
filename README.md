# ⚡ GraphChain

Интерактивный граф для визуализации блокчейн-данных.  
Создан с использованием React, TypeScript, Vite, Tailwind CSS и React Flow.

## 🚀 Features

- 🔎 Поиск по `address`, `tx`, `block`, `snapshot name`
- 📈 Визуализация графа с помощью `@xyflow/react`
- ⚙️ Фильтрация по `from`, `to`, `action`
- 💾 Возможность сохранения snapshot'ов и повторного вызова
- 🧠 Поддержка кастомных нод с информацией о безопасности

## 🧱 Стек технологий

- **React 19 + Vite**
- **TypeScript**
- **Redux Toolkit Query** для асинхронных API запросов
- **React Flow (@xyflow/react)** для визуализации графов
- **Tailwind CSS** для стилизации
- **Framer Motion** для анимаций
- **Radix UI** — dropdowns, tooltips
- **Lucide Icons**

## 🛠️ Установка

```bash
# 1. Клонируйте репозиторий
git clone https://github.com/DecodeFi/mvp-frontend.git
cd mvp-frontend

# 2. Установите зависимости. 
# Так как в зависимостях установлен React 19, есть конфликты, поэтому с флагом --legacy-peer-deps
 или npm install --legacy-peer-deps

# 3. Запустите проект
npm run dev

# Структура проекта:
├── backend/
│   └── apiSlice.ts         # RTK Query endpoints
│
├── redux/
│   └── store.ts            # Конфигурация Redux store
│
├── src/
│   ├── assets/             # Иконки и графические ресурсы
│   │
│   ├── components/
│   │   ├── graph-nodes/    # Компоненты узлов графа (NodeHeader и др.)
│   │   ├── graph-filters/  # UI-фильтры по from/to-адресам
│   │   ├── ContractTable/  # Отображение деталей адреса
│   │   ├── Header/         # Хедер страницы
│   │   ├── SearchBar/      # Компонент поиска
│   │   └── ui/             # Общие UI-компоненты (Button и т.п.)
│   │
│   ├── helpers/
│   │   ├── buildGraphFromData.ts     # Генерация графа из traces
│   │   ├── buildGraphFromSnapshot.ts # Генерация из snapshot
│   │   ├── detectSearchType.ts       # Определение типа ввода
│   │   ├── truncateAddress.ts        # Утилита сокращения адреса
│   │
│   ├── hooks/
│   │   └── useBalance.ts    # Пользовательские React-хуки
│   │
│   └── lib/                # Вспомогательные библиотеки и утилиты
│
├── pages/
│   └── GraphPage.tsx       # Главный компонент визуализации графа

