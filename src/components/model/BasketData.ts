import { IBasketData, IProductItem } from "../../types";
import { ProductData } from "./ProductData";

export class BasketData extends ProductData implements IBasketData {
  productsInBasket: IProductItem[] = [];

  addToBasket(item: IProductItem): void {
    this.productsInBasket.push(item);
    this.emitChanges("basket:changed", this.productsInBasket);
  }

  getProductsInBasket(): IProductItem[] {
    return this.productsInBasket;
  }
  getNumberBasket(): number {
    return this.productsInBasket.length;
  }
  getTotalBasket(): number {
    return this.productsInBasket.reduce((total, item) => {
      return total + (item.price || 0);
    }, 0);
  }
  isInBasket(item: IProductItem): boolean {
    return this.productsInBasket.some((product) => product.id === item.id);
  }

  deleteProductsInBasket(item: IProductItem): void {
    this.productsInBasket = this.productsInBasket.filter((basketItem) => basketItem.id !== item.id); 
    this.emitChanges("basket:changed", this.productsInBasket); 
  }
  getBasketId() {
    return this.productsInBasket.map((item) => item.id);
  }
  cleanBasket(): void {
    this.productsInBasket.length = 0;
  }
}
