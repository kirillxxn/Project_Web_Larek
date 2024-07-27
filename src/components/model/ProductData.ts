import { IProductItem, IProductItemPreview } from '../../types/index';
import { Model } from '../base/model';

export class ProductData extends Model<IProductItemPreview> {
	protected _preview: string | null;
	protected _products: IProductItem[] = [];
	

	set products(products: IProductItem[]) {
		this._products = products;
		this.events.emit('product:changed', { catalog: this._products });
	}

	get products() {
		return this._products;
	}

	getProduct(id: string): IProductItem {
		return this._products.find((item) => item.id === id);
	}

	set preview(productId: string | null) {
		if (!productId) {
			this._preview = null;
			return;
		}
		const selectedProduct = this.getProduct(productId);
		if (selectedProduct) {
			this.emitChanges('preview:changed', selectedProduct);
			this._preview = productId;

		}
	}

	get preview() {
		return this._preview;
	}
}