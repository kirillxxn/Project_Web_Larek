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
- src/scss/styles.scss — корневой файл стилей
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

Карточка товара
```
 interface IProductItem {
    id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	index?: number;
}
```
Превью карточки товара 
 ```
 interface IProductItemPreview {
    products: IProductItem[];
	preview: string | null;
	getProduct(id: string): IProductItem;
}
```
Модальное окно для товаров в корзине
```
 interface IBasketData {
    items: IProductItem[];
	total: number;
	setProductsInBasket(product: IProductItem): void;
	getProductsInBasket(): IProductItem[];
	checkProductInBasket(product: IProductItem): boolean;
	deleteProductsInBasket(product: IProductItem): void;
	clearBasket(): void;
}
```
Модальные окна для указания информации для оплаты 
```
 interface IFormStepOne {
    payment: string;
    address: string;
}
 interface IFormStepTwo {
    email: string;
    phone: number;
}
```
Интерфейс модели заказа товара
```
export interface IOrder {
	_order: IOrderData;
	setOrderItems(items: string[]): void;
    setOrderPrice(value: number): void; 
    setOrderField(field: keyof IOrderForm, value: string): void;
    validateOrder(): boolean;
	clearOrder(): void;
}
```
Типы ошибок формы
```
export type FormErrors = Partial<Record<keyof IOrderData, string>>;
```
Общий итог данных заказа

```
export interface IOrderData extends IOrderForm {
	items: string[];
	total: number;
}
```
Модальное окно после успешной покупки
```
 interface ISuccessfulOrder {
    _id: string;
    total: number;
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой данных, отвечает за хранение и изменение данных,
- слой представления, отвечает за отображение данных на - странице,
- презентер, отвечает за связь представления и данных.

## Базовый код 

#### Класс Api 

Содержит в себе базовую логику отправки запросов. Конструктор `constructor(baseUrl: string, options: RequestInit = {})`- принимает базовый URL и глобальные опции для всех запросов(опционально).

В полях класса хранятся следующие данные:

- baseUrl: string - базовый URL
- options: RequestInit - опции

Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется POST запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

Типы:

- `type ApiPostMethods = 'POST' | 'PUT' | 'DELETE'` - метод отправки запроса

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Конструктор `constructor() {this._events = new Map<EventName, Set<Subscriber>>();}` - принимает коллекцию для хранения данных любого типа в виде пар [ключ, значение].

Основные методы, реализуемые классом описаны интерфейсом `IEvents`:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие
- `onAll` - слушать все события
- `offAll` - сбросить все обработчики
- `trigger` - сделать коллбек триггер, генерирующий событие при вызове.

### Слой данных 

#### Класс ProductItemPreview 

Класс отвечает за хранение и логику работы с данными товаров.
В полях класса хранятся следующие данные:

- _products: IProduct[] - массив объектов товаров
- _preview: string | null - id карточки товара, выбранной для просмотра в модальном окне

Так же класс предоставляет методы для взаимодействия с этими данными: 

- `getProduct(id: string) :IProductItem` - возвращает карточку товара по ее Id
- `set preview(productId: string | null)` -  устанавливает данные для предварительного просмотра выбранного продукта
- `get preview()` - получить выбранный товар для показа в модальном окне
- `get products()` - получить все продукты

#### Класс BasketData

Класс отвечает за хранение и логику работы с данными корзины.\
В полях класса хранятся следующие данные:

- \_totalProducts: number - количество продуктов в корзине
- \__productsInBasket: IProductItem[] = [] - массив с продуктами

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- `setProductsInBasket(product: IProductItem)` - добавляет продукт в корзину
- `getProductsInBasket(): IProductItem[]` - получает продукты из корзины
- `checkProductInBasket(item: IProductItem): boolean` - проверяет по id, находится ли продукт в корзине
- `get totalProducts(): number` - получить количество продуктов в корзине
- `get totalPriсe(): number` - получить общую цену в корзине
- `deleteProductsInBasket(item: IProductItem)` - удаляет продукт из корзины
- `clearBasket()` - очищает корзину
- а так-же геттеры для получения общей цены и количества продуктов в корзине

#### Класс OrderData

Класс отвечает за хранение и логику работы с данными заказа.\
В полях класса хранятся следующие данные:

- \_order: IOrderData - все данные заказа
- formErrors: FormErrors = {} - массив с текстом ошибок форм.

Так же класс предоставляет набор методов для взаимодействия с этими данными.

- `get order()` - получить все данные заказа
- `setOrderItems(items: string[])` - записывает в массив id товаров в заказе.
- `setOrderPrice(value: number)` - записывает общую цену заказа
- `clearOrder(): void` - очищает массив данных после заказа
- `setOrderField(field: keyof IOrderForm, value: string)` - записывает данные с полей форм в массив данных заказа \_order
- `validateOrder()` - валидация форм


### Классы представления 
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Абстрактный класс Component<T>

Базовый компонент который реализует вспомогательные методы для работы других классов. В конструкторе `protected constructor(protected readonly container: HTMLElement)` принимает HTMLElement с которым нужно работать.

Методы класса:

- `toggleClasses(element: HTMLElement, className: string)` - переключает классы на указанном элементе DOM
- `setText(element: HTMLElement, value: unknown)` - устанавливает текстовое содержимое указанного элемента DOM
- `setDisabled(element: HTMLElement, state: boolean)` - изменяет статус блокировки указанного элемента DOM
- `setHidden(element: HTMLElement)` - cкрывает указанный элемент DOM
- `setVisible(element: HTMLElement)` - показывает указанный элемент DOM
- `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает изображение с альтернативным текстом
- `render(data?: Partial): HTMLElement` - возвращает корневой DOM-элемент

#### Класс Modal

Расширяет класс Component<T>. Реализует модальное окно. Так же предоставляет методы `open` и `close` для управления отображением модального окна. Устанавливает слушатели на клик в оверлей и кнопку-крестик для закрытия попапа.
`constructor(container: HTMLElement, protected events: IEvents)` - конструктор принимает HTML элемент модального окна и экземпляр класса EventEmitter для возможности инициации событий. 

Поля класса: 

- _modal: HTMLElement - элемент модального окна 
- _buttonClose: HTMLButtonElement - кнопка закрытия

Методы:

- `set content(value: HTMLElement)` - устанавливает разметку модального окна
- `open()` - открытие модального окна
- `close()` - закрытие модального окна
- `render(): HTMLElement` - рендерит модальное окно с переданным контентом и вызывает метод open() для открытия окна.

#### Класс Form

Расширяет класс Component<T>. Отвечает за отображение элементов формы. В конструктор класса constructor(protected container: HTMLFormElement, protected events: IEvents) передается DOM элемент темплейта а так же экземпляр класса EventEmitter
В конструкторе вешается обработчик события на поля ввода для валидации и кнопку сабмита.

Поля класса содержат:

- protected _submit: HTMLButtonElement - DOM элемент кнопки сабмита
- protected _errors: HTMLElement - DOM элемент ошибок
Методы:

- `protected onInputChange(field: keyof T, value: string)` - вешает каждому полю ввода свое событие
- `set valid(value: boolean)` - разблокирует или блокирует кнопку отправки
- `set errors(value: string)` - записывает ошибки валидации
- `render(state: Partial<T> & IFormState)` - рендер формы

Интерфейс:

```
interface IFormState {
	valid: boolean;
	errors: string[];
}
```

#### Класс OrderPayment

Расширяет класс `Form`. Отвечает за отображение формы заказа, включая поля для адреса и способа оплаты.
В конструктор класса `constructor(container: HTMLFormElement, events: IEvents)` передается DOM элемент темплейта, а так же экземпляр класса EventEmitter. Вешается обработчик события на выбор способа оплаты.

Поля класса: 

- _paymentButtons: HTMLButtonElement - выбор способа оплаты
- _address: string - инпут для адреса

Методы:

- `set payment (value: string)` - установка способа оплаты
- `set address(value: string)` - запись адреса
- `paymentSelectedRemove()` - сброс кнопки выбора оплаты

#### Класс OrderContacts

Расширяет класс `Form` Отвечает за отображение формы заказа, включая поле для телефона и электронной почты.
В конструктор класса `constructor(container: HTMLFormElement, events: IEvents)` передается DOM элемент темплейта, а так же экземпляр класса EventEmitter. Вешается обработчик события на выбор способа оплаты.

Поля класса: 

- _phone: string - инпут для номера телефона
- _email: string - инпут для почты

Методы:

- `set phone(value: string)` - запись телефона  
- `set email(value: string)` - запись email

#### Класс ProductCard

Расширяет класс Component<T>. Класс генерирует карточки товаров, используемые на странице сайта для отображения доступных товаров. Он содержит элементы разметки для различных компонентов карточки продукта, таких как изображение, описание и кнопки добавления/удаления. В конструкторе класса передается DOM элемент темплейта, что позволяет при необходимости формитровать карточки товаров в  разных вариантах верстки. 

Поля класса содержат элементы разметки элементов товара:

- _id: string - id товара
- _description: HTMLElement - описание товара
- _image: HTMLImageElement - изображение товара
- _title: HTMLElement - название товара
- _category: HTMLElement - категори товара
- _index: HTMLElement - порядковый номер товара в корзине
- _button: HTMLButtonElemen - кнопка добавления в корзину
- _deleteButton: HTMLButtonElement - кнопка удаления товара из корзины

Методы: 

Сеттеры и геттеры для сохранения и получения данных из полей класса.

#### Класс MainPage 

Расширяет класс Component<T>. Отвечает за отображение главной страницы сайта, содержит корзину товаров со счетчиком, также список товаров. В конструктор класса `constructor(container: HTMLElement, protected events: IEvents)` передается DOM элемент темплейта, а так же экземпляр класса EventEmitter. Вешается обработчик события на нажатие кнопки корзины.

Поля класса:

- _counter: HTMLElement - количество товаров в корзине
- _catalog: HTMLElement - контейнер для продуктов
- _wrapper: HTMLElement - wrapper
- _basket: HTMLElement - корзина

Методы:

- `set catalog(items: HTMLElement)` - выводит товары на страницу
- `set counter(value: number)` - устанавливает количество товаров в корзине 
- `set locked(value: boolean)` - блокирует прокрутку страницы когда открыта модалка


Интерфейс:

```
interface IMainPage {
	counter: number;
	products: HTMLElement[];
	locked: boolean;
}
```

#### Класс Success
Расширяет класс Component<T>. Отвечает за отображение модального окна успешного заказа. В конструктор класса constructor(container: HTMLElement, events: IEvents) передается DOM элемент темплейта а так же экземпляр класса EventEmitter. Вешается обработчик события на нажатие кнопки закрытия.

Поля класса содержат DOM элементы страницы:

- protected _total: HTMLElement - общая сумма заказа
- closeButton: HTMLElement - кнопка закрытия
Методы:

set total(value: number) - заполняет общею сумму заказа

Интерфейс:

```
interface ISuccess {
	total: number;
}
```

### Слой коммуникаций 

#### Класс AppApi 

Наследует класс Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса. Конструктор constructor(cdn: string, baseUrl: string, options?: RequestInit) - принимает ссылку на сервер(cdn), базовый URL и глобальные опции для всех запросов(опционально).

Поле класса:

- readonly cdn: string - ссылка на сервер

Методы:

- `getCardItem(id: string): Promise<IProductItem>` - получить продукт по id
- `getCardList(): Promise<IProductItem[]>` - получить все продукты
- `order(order: IOrderData): Promise` - отправить заказ

Интерфейс:

```
export interface IProductAPI {
	getCardItem: (id: string) => Promise<IProductItem>;
	getCardList: () => Promise<IProductItem[]>;
	orderProduct: (order: IOrderData) => Promise<IOrderSuccess>;
}
```

## Взаимодействие компонентов 

Код, описывающий взаимодействие представления и данных между собой находится в файле `index.ts`, выполняющем роль презентера.
Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

Список всех событий, которые могут генерироваться в системе:
События изменения данных (генерируются классами моделями данных)

- `product:changed` - изменение массива карточек
- `preview:changed` - выбрана карточка для показа
- `product:select` - открытие модального окна товара

События, возникающие при взаимодействии пользователя с интерфейсом (генерируются классами, отвечающими за представление): 

- `basket:open` - открытие корзины
- `basket:add` - добавление товара в корзину
- `basket:changed` - изменения в корзине
- `basket:delete` - удаление товара из корзины
- `preview:delete` - удаление товара из корзины в модальном окне товара
- `order:open` - открытие модального окна заказа
- `order:ready` - активация кнопки далее после заполнения формы для контактов 
- `order:change` - инпут адреса
- `order.contacts:change` - инпут номера телефона и email
- `order:submit` - кнопка далее в форме заказа
- `modal:open` - открытие модального окна 
- `modal:close` - закрытие модального окна
- `payment:select` - выбор способа оплаты
- `formErrors:change` - обновляют состояние компонентов orderForm и сontactForm в соответствии с текущими ошибками в формах заказа и контактов
- `contacts:submit` - отвечает за отправку заказа на сервер и обработку успешного или неудачного отклика
- `success:close` - закрытие модального окна после завершения оформления 