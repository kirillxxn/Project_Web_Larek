import { IOrderData, FormErrors, IOrder, IOrderForm } from '../../types';
import { Model } from '../base/model';

export class OrderData extends Model<IOrder> implements IOrder {
	_order: IOrderData = {
		items: [],
		address: '',
		email: '',
		phone: '',
		payment: '',
		total: 0,
	};
	formErrors: FormErrors = {};

	get order(): IOrderData {
		return this._order;
	}

	setOrderItems(items: string[]) {
		this._order.items = items;
	}

	setOrderPrice(value: number) {
		this._order.total = value;
	}

	setOrderField(field: keyof IOrderForm, value: string) {
		this._order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
	}

	validateOrder() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес';
		}
		if (!this.order.payment) {
			errors.payment = 'Необходимо указать способ оплаты';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	clearOrder(): void {
		this._order = {
			items: [],
			address: '',
			email: '',
			phone: '',
			payment: '',
			total: 0,
		};
	}
}