import { IEvents } from "../components/base/events";
export interface IProductItem {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
  index?: number;
}

export interface IProductItemPreview {
  catalog: IProductItem[];
  preview: string | null;
  getProduct(id: string): IProductItem;
}

export interface IBasketData {
  getTotalBasket(): number;
  getNumberBasket(): number;
  addToBasket(product: IProductItem): void;
  getProductsInBasket(): IProductItem[];
  isInBasket(product: IProductItem): boolean;
  deleteProductsInBasket(product: IProductItem): void;
  cleanBasket(): void;
}

export interface IOrder {
  payment: string;
  address: string;
}

export interface IBuyerInfo {
  email: string;
  phone: string;
}

export interface IOrderData {
  CheckValidation(data: Record<keyof IOrder, string>): boolean;
}

export interface IBuyerInfoData {
  CheckValidation(data: Record<keyof IBuyerInfo, string>): boolean;
}

export type IShoppingInfo = IOrder & IBuyerInfo;

export type IShoppingPost = IShoppingInfo & {
  total: number;
  items: string[];
};

export type IFormError = Partial<IShoppingInfo>;

export interface IAppInfo {
  order: IShoppingInfo;
  formError: IFormError;
  events: IEvents;
}

export interface ISuccessfulOrder {
  id: string;
  total: number;
}
