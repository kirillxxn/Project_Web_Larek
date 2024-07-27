import { IProductItem, IBasketData } from '../../types/index';
import { ProductData } from './ProductData';

export class BasketData extends ProductData implements IBasketData {
	total: number;
	items: IProductItem[] = [];


	setProductsInBasket(product: IProductItem) {
		if (!this.items.some((item) => item.id === product.id)) {
			this.items.push(product);
		}
	}

	getProductsInBasket(): IProductItem[] {
		return this.items;
	}

	checkProductInBasket(product: IProductItem): boolean {
		return this.items.some((item) => item.id === product.id);
	}

	deleteProductsInBasket(product: IProductItem) {
		this.items = this.items.filter((item) => item.id !== product.id);
	}

	clearBasket() {
		this.items.length = 0;
		this.total = 0;
	}

	get totalPrice(): number {
		return this.items.reduce((total, product) => {
			return total + (product.price || 0);
		}, 0);
	}

	get totalCard(): number {
		return this.items.length;
	}
}
