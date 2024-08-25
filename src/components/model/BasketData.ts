import { IBasketData, IProductItem } from "../../types";
import { ProductData } from "./ProductData";

export class BasketData extends ProductData implements IBasketData {
  protected _productsInBasket: IProductItem[] = [];

  setProductsInBasket(product: IProductItem): void {
    if (!this._productsInBasket.some((item) => item.id === product.id)) {
      this._productsInBasket.push(product);
    }
  }

  getProductsInBasket(): IProductItem[] {
    return this._productsInBasket;
  }

  get totalProducts(): number {
    return this._productsInBasket.length;
  }

  get totalPrice(): number {
    return this._productsInBasket.reduce((total, product) => {
      return total + (product.price || 0);
    }, 0);
  }

  checkProductInBasket(item: IProductItem): boolean {
    return this._productsInBasket.some((product) => product.id === item.id);
  }

  deleteProductsInBasket(item: IProductItem): void {
    this._productsInBasket = this._productsInBasket.filter(
      (product) => product.id !== item.id
    );
  }

  clearBasket(): void {
    this._productsInBasket.length = 0;
  }
}
