# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении
Интерфейс карточки товара
```
export interface IProductItem {
    name: string;
    _id: string;
    price: number | null;
    description: string;
    image: string;
    category: string;
}
```
Превью карточки товара 
 ```
export interface IProductItemPreview {
    products: IProductItem[];
    preview: string | null;
    getProduct(productId: string) :IProductItem;
    setPreview(productId: string | null): void;
}
```
Интерфейс модальных окон форм оплаты этап
```
export interface IFormStepOne {
    payment: string;
    address: string;
}
export interface IFormStepTwo {
    email: string;
    phone: number;
}
```
Интерфейс модального окна просмотра отдельной карточки
```
export interface IProductItemData {
    cards: IProductItem[];
    preview: string | null;
    getProduct(_id: string): IProductItem;
}
```
Интерфейс модального окна корзины
```
export interface IBasketData {
    items: IProductItem[];
    total: number;
    productIndex: number; 
    deleteProduct(product: IProductItem): void;
    getProductInBasket() :IProductItem[];
    setProductInBasket(product: IProductItem[]): void; 
}
```
Интерфейс модального окна об успешной покупке
```
export interface ISuccessfulOrder {
    _id: string;
    total: number;
}
```
## Архитектура приложения
Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на - странице,
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.
  
#### Класс Api 

Данный класс содержит в себе базовую логику отправки запросов. Конструктор `constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов.

В полях класса хранятся следующие данные:

baseUrl: string - базовый URL
options: RequestInit - опции

Методы класса:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода.

Типы:

- `type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'` - метод отправки запроса\

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Конструктор `constructor() {this._events = new Map<EventName, Set<Subscriber>>();}` - принимает коллекцию для хранения данных любого типа в виде пар [ключ, значение].

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `onAll` - слушать все события,
- `offAll` - сбросить все обработчики,
- `on` - подписка на событие,
- `emit` - инициализация события,
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие,
- `trigger` - сделать коллбек триггер, генерирующий событие при вызове.
  
### Слой данных 

#### Класс ProductItemPreview

Класс отвечает за хранение и логику работы с данными товаров.
В полях класса хранятся следующие данные:

- products: IProductItem[]; - массив объектов товаров
- preview: string | null - id карточки товара, выбранной для просмотра в модальном окне

Так же класс предоставляет методы для взаимодействия с этими данными: 

- getProduct(productId: string) :IProductItem - возвращает карточку товара по ее Id
- setPreview(productId: string | null) -  устанавливает данные для предварительного просмотра выбранного продукта
  
#### Класс IBasketData

Класс представляет корзину покупок и предоставляет методы управления ее содержимым. Он хранит массив продуктов `IProductItem`, общую стоимость и порядковые номера продуктов.

В полях класса хранятся следующие данные:

- items: IProductItem[]; - массив объектов `IProductItem`, представляющих список продуктов в корзине
- total: number - общая стоимость продуктов в корзине
- productIndex: number - порядковый номер товара 

Так же класс предоставляет методы для взаимодействия с этими данными: 

- `deleteProduct(product: IProductItem)` - удаляет объект `IProductItem` из списка продуктов в корзине
- `getProductInBasket() :IProductItem[]` - получает массив объектов `IProductItem`, представляющих список продуктов в корзине
- `setProductInBasket(product: IProductItem[])` - устанавливает массив объектов `IProductItem` в качестве списка продуктов в корзине

 ### Классы представления 
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.
