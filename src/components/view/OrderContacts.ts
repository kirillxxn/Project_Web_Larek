import { Form } from './Form';
import { IOrderData } from '../../types';

export class OrderContacts extends Form<IOrderData> {
	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}
}