import { Form } from './Form';
import { IOrderData } from '../../types';
import { IEvents } from '../base/events';
import { ensureAllElements } from '../../utils/utils';

export class OrderPayment extends Form<IOrderData> {
	protected _paymentButtons: HTMLButtonElement[];
	protected _address: HTMLInputElement;
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);

		this._paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		if (this._paymentButtons) {
			this._paymentButtons.forEach((button) => {
				button.addEventListener('click', () => {
					this.payment = button.name;
				});
			});
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}

	set payment(name: string) {
		this._paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === name);
			this.events.emit(`payment:select`, { payment: name });
		});
	}

	paymentSelectedRemove() {
		this._paymentButtons.forEach((button) => {
			if (button.classList.contains('button_alt-active')) {
				this.toggleClass(button, 'button_alt-active', false);
			}
		});
	}
}