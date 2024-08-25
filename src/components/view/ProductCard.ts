import { IProductItem } from "../../types";
import { Component } from "../base/component";
import { ensureElement } from "../../utils/utils";

interface IProductActions {
  onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Component<IProductItem> {
  protected _index?: HTMLElement;
  protected _id: HTMLElement;
  protected _description?: HTMLElement;
  protected _image?: HTMLImageElement;
  protected _title: HTMLElement;
  protected _category?: HTMLElement;
  protected _price: HTMLElement;
  protected _button?: HTMLButtonElement;
  protected _deletButton?: HTMLButtonElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    actions?: IProductActions
  ) {
    super(container);
    this._index = this.container.querySelector(".basket__item-index");
    this._description = this.container.querySelector(`.${blockName}__text`);
    this._image = this.container.querySelector(`.card__image`);
    this._title = ensureElement<HTMLElement>(
      `.${blockName}__title`,
      this.container
    );
    this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
    this._category = this.container.querySelector(`.card__category`);
    this._button = this.container.querySelector(`.${blockName}__button`);

    if (actions?.onClick) {
      if (this._button) {
        this._button.addEventListener("click", actions.onClick);
      } else {
        container.addEventListener("click", actions.onClick);
      }
    }
  }

  set id(value: string) {
    this.container.dataset.id = value;
  }

  get id(): string {
    return this.container.dataset.id || "";
  }

  set description(value: string) {
    this.setText(this._description, value);
  }

  set image(value: string) {
    this.setImage(this._image, value, this.title);
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get title(): string {
    return this._title.textContent || "";
  }

  set category(value: string) {
    const allCategories: Record<string, string> = {
      "софт-скил": "soft",
      "хард-скил": "hard",
      другое: "other",
      кнопка: "button",
      дополнительное: "additional",
    };

    Object.values(allCategories).forEach((_category) => {
      this.toggleClass(
        this._category,
        `card__category_${allCategories[value]}`,
        false
      );
    });
    this.toggleClass(
      this._category,
      `card__category_${allCategories[value]}`,
      true
    );
    this.setText(this._category, value);
  }

  set price(value: number | null) {
    if (value === null) {
      this.setDisabled(this._button, true);
      this.setText(this._button, "Нельзя купить");
      this.setText(this._price, "Бесценно");
    } else {
      this.setText(this._price, `${value} синапсов`);
    }
  }

  set inBasket(isInBasket: boolean) {
    this.setText(this._button, isInBasket ? "Убрать" : "В корзину");
  }

  set index(value: number) {
    this.setText(this._index, value);
  }
}
