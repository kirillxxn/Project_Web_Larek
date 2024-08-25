import { createElement, ensureElement, formatNumber } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

interface IBasketView {
  list: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketView> {
  protected _list: HTMLElement;
  protected _total: HTMLElement;
  protected _button: HTMLElement;

  constructor(
    protected blockName: string,
    container: HTMLElement,
    protected events: IEvents
  ) {
    super(container);

    this._button = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container
    );

    this._button.addEventListener("click", () => {
      events.emit("order:open");
    });

    this._list = ensureElement<HTMLElement>(".basket__list", this.container);
    this._total = ensureElement<HTMLElement>(".basket__price", this.container);
  }

  get list(): HTMLElement[] {
    return Array.from(this._list.children).filter(
      (node) => node instanceof HTMLLIElement
    ) as HTMLElement[];
  }

  set list(items: HTMLElement[]) {
    if (items.length) {
      this._list.replaceChildren(...items);
      this.setDisabled(this._button, false);
    } else {
      this._list.replaceChildren(
        createElement<HTMLParagraphElement>("p", {
          textContent: "Корзина пуста",
        })
      );
      this.setDisabled(this._button, true);
    }
  }

  get total(): number {
    return parseInt(this._total.textContent) || 0;
  }

  set total(total: number) {
    this.setText(this._total, total + " синапсов");
  }
}
