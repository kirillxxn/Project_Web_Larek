
export interface IProductItem {
    name: string;
    _id: string;
    price: number | null;
    description: string;
    image: string;
    category: string;
}
export interface IProductItemPreview{
    products: IProductItem[];
    preview: string | null;
    getProduct(productId: string) :IProductItem;
    setPreview(productId: string | null): void;
}
export interface IFormStepOne {
    payment: string;
    address: string;
}
export interface IFormStepTwo {
    email: string;
    phone: number;
}
export interface IProductItemData {
    cards: IProductItem[];
    preview: string | null;
    getProduct(_id: string): IProductItem;
}
export interface IBasketData {
    items: IProductItem[];
    total: number;
    productIndex: number; 
    deleteProduct(product: IProductItem): void;
    getProductInBasket() :IProductItem[];
    setProductInBasket(product: IProductItem[]): void; 
}
export interface ISuccessfulOrder{
    _id: string;
    total: number;
}