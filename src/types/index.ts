/* Интерфейс карточки товара */
export interface IProductItem {
    name: string;
    _id: string;
    price: number | null;
    description: string;
    image: string;
    category: string;
}
/* Превью карточки товара */
export interface IProductItemPreview{
    products: IProductItem[];
    preview: string | null;
    getProduct(productId: string) :IProductItem;
    setPreview(productId: string | null): void;
}
/* Интерфейс модального окна формы оплаты этап первый */
export interface IFormStepOne {
    payment: string;
    address: string;
}
/* Интерфейс модального окна формы оплаты этап второй */
export interface IFormStepTwo {
    email: string;
    phone: number;
}
/* Интерфейс модального окна просмотра отдельной карточки */
export interface IProductItemData {
    cards: IProductItem[];
    preview: string | null;
    getProduct(_id: string): IProductItem;
}
/* Интерфейс модального окна корзины */
export interface IBasketData {
    items: IProductItem[];
    total: number;
    productIndex: number; 
    deleteProduct(product: IProductItem): void;
    getProductInBasket() :IProductItem[];
    setProductInBasket(product: IProductItem[]): void; 
}
/* Интерфейс модального окна об успешной покупке */
export interface ISuccessfulOrder{
    _id: string;
    total: number;
}