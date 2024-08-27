import { IProductItem, IProductItemPreview } from "../../types/index";
import { Model } from "../base/model";

export class ProductData extends Model<IProductItemPreview> {
  protected _preview: string | null = null;
  catalog: IProductItem[] = [];

  setProductList(items: IProductItem[]) {
    this.catalog = items;
    this.emitChanges("items:changed", { catalog: this.catalog });
  }

  get products() {
    return this.catalog;
  }

  getProduct(id: string): IProductItem | undefined {
    return this.catalog.find((item) => item.id === id);
  }

  set preview(productId: string | null) {
    if (!productId) {
      this._preview = null;
      return;
    }
    const selectedProduct = this.getProduct(productId);
    if (selectedProduct) {
      this.emitChanges("preview:changed", selectedProduct);
      this._preview = productId;
    }
  }

  get preview() {
    return this._preview;
  }
}
