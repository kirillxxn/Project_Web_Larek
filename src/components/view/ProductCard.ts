import { IProductItem } from '../../types';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Component<IProductItem> {
	protected _id: string;
	protected _description?: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;
	protected deleteButton: HTMLButtonElement;
	protected _index: HTMLElement;
	protected categoryType = <Record<string, string>>{
		кнопка: 'button',
		'софт-скил': 'soft',
		'хард-скил': 'hard',
		другое: 'other',
		дополнительное: 'additional',
	};

	constructor(
		element: HTMLElement,
		productInBasket: boolean,
		product: IProductItem,
		events: IEvents,
		actions?: ICardActions
	) {
		super(element);

		this._description = element.querySelector('.card__text');
		this._image = element.querySelector('.card__image');
		this._title = element.querySelector('.card__title');
		this._category = element.querySelector('.card__category');
		this._price = element.querySelector('.card__price');
		this._button = element.querySelector('.button');
		this._index = element.querySelector('.basket__item-index');
		this.deleteButton = element.querySelector('.basket__item-delete');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				element.addEventListener('click', actions.onClick);
			}
		}

		if (this._button) {
			if (productInBasket) {
				this._button.addEventListener('click', () => {
					events.emit('preview:delete', product);
				});
			} else {
				this._button.addEventListener('click', () => {
					events.emit('basket:add', product);
				});
			}
		}

		if (product.price === null) {
			this.setDisabled(this._button, true);
			this.setText(this._button, 'Товар бесценен');
		}

		if (this.deleteButton) {
			this.deleteButton.addEventListener('click', () => {
				events.emit('basket:delete', product);
			});
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent;
	}

	set category(value: string) {
		this._category?.classList.add(`card__category_${this.categoryType[value]}`);
		this.setText(this._category, value);
	}

	set price(value: number) {
		this.setText(this._price, value ? `${value} синапсов` : 'Бесценно');
		if (this._button) {
			this._button.disabled === !value;
		}
	}

	set buttonText(value: string) {
		this.setText(this._button, value);
	}

	set index(value: string) {
		this.setText(this._index, value);
	}
}