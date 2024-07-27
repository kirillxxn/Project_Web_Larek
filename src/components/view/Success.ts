import { formatNumber } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

interface ISuccess {
	total: number;
}

export class Success extends Component<ISuccess> {
	closeButton: HTMLElement;
	protected _total: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.closeButton = container.querySelector('.order-success__close');
		this._total = container.querySelector('.order-success__description');

		this.closeButton.addEventListener('click', () => {
			events.emit('success:close');
		});
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${formatNumber(value)} синапсов`);
	}
}