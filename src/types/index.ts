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
	products: IProductItem[];
	preview: string | null;
	getProduct(id: string): IProductItem;
}

export interface IBasketData {
	totalProducts: number;
	totalPrice: number;
	setProductsInBasket(product: IProductItem): void;
	getProductsInBasket(): IProductItem[];
	checkProductInBasket(product: IProductItem): boolean;
	deleteProductsInBasket(product: IProductItem): void;
	clearBasket(): void;

}

export interface IFormStepOne {
	payment: string;
	address: string;
}

export interface IFormStepTwo {
	email: string;
	phone: string;
}

export interface IOrder {
	_order: IOrderData;
	setOrderItems(items: string[]): void;
	setOrderPrice(value: number): void;
	setOrderField(field: keyof IOrderForm, value: string): void;
	validateOrder(): boolean;
	clearOrder(): void;
}


export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export interface IOrderData extends IOrderForm {
	items: string[];
	total: number;
}

export interface IOrderForm extends IFormStepOne, IFormStepTwo {}

export interface ISuccessfulOrder {
	id: string;
	total: number;
}