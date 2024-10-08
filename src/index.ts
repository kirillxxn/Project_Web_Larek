import "./scss/styles.scss";

import {
  IProductItem,
  IShoppingInfo,
  IFormError,
  ISuccessfulOrder,
} from "./types";

import { EventEmitter } from "./components/base/events";

import { OrderData } from "./components/model/OrderData";

import { Basket } from "./components/view/Basket";
import { Modal } from "./components/view/Modal";
import { MainPage } from "./components/view/MainPage";
import { ContactsForm } from "./components/view/OrderContacts";
import { OrderForm } from "./components/view/OrderPayment";
import { ProductCard } from "./components/view/ProductCard";
import { Success } from "./components/view/Success";
import { BasketData } from "./components/model/BasketData";

import { SiteApi } from "./components/AppApi";

import { API_URL, CDN_URL } from "./utils/constants";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { ProductData } from "./components/model/ProductData";

const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const events = new EventEmitter();
const api = new SiteApi(CDN_URL, API_URL);

const success = new Success(cloneTemplate(successTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const page = new MainPage(document.body, events);
const basket = new Basket("basket", cloneTemplate(basketTemplate), events);

const basketData = new BasketData({}, events);
const orderData = new OrderData({}, events);
const productData = new ProductData({}, events);

events.on("modal:open", () => {
  page.locked = true;
});

events.on("modal:close", () => {
  page.locked = false;
});

api
  .getProductList()
  .then((result) => {
    productData.setProductList(result);
  })
  .catch((err) => {
    console.error(err);
  });

events.on("items:changed", () => {
  page.catalog = productData.catalog.map((item) => {
    const product = new ProductCard(
      "card",
      cloneTemplate(cardCatalogTemplate),
      {
        onClick: () => events.emit("card:select", item),
      }
    );
    return product.render({
      title: item.title,
      price: item.price,
      image: item.image,
      category: item.category,
    });
  });
});
events.on("card:select", (item: IProductItem) => {
  const card: ProductCard = new ProductCard(
    `card`,
    cloneTemplate(cardPreviewTemplate),
    {
      onClick: () => {
        if (!basketData.isInBasket(item)) {
          basketData.addToBasket(item);
        } else {
          basketData.deleteProductsInBasket(item);
        }
        card.inBasket = basketData.isInBasket(item);
      },
    }
  );
  card.inBasket = basketData.isInBasket(item);
  modal.render({
    content: card.render({
      id: item.id,
      title: item.title,
      image: item.image,
      category: item.category,
      description: item.description,
      price: item.price,
    }),
  });
});

events.on("card:add", (item: IProductItem) => {
  basketData.addToBasket(item);
});

events.on("card:remove", (item: IProductItem) => {
  basketData.deleteProductsInBasket(item);
});

events.on("basket:open", () => {
  orderData;
  modal.render({
    content: basket.render({ list: basket.list, total: basket.total }),
  });
});

events.on("basket:changed", () => {
  page.counter = basketData.getNumberBasket();
  const items = basketData.productsInBasket.map((item, index) => {
    const card = new ProductCard("card", cloneTemplate(cardBasketTemplate), {
      onClick: () => {
        events.emit("card:remove", item);
      },
    });
    return card.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });

  basket.render({ list: items, total: basketData.getTotalBasket() });
});

events.on("order:open", () => {
  modal.render({
    content: orderForm.render({
      valid: orderData.setOrderErrors(),
      errors: [],
    }),
  });
});

events.on("order:submit", () => {
  modal.render({
    content: contactForm.render({
      valid: orderData.setContactsErrors(),
      errors: [],
    }),
  });
});

events.on("formErrors:change", (errors: IFormError) => {
  const { payment, address, email, phone } = errors;
  orderForm.valid = !payment && !address;
  contactForm.valid = !email && !phone;
  orderForm.errors = Object.values({ payment, address })
    .filter((i) => !!i)
    .join("; ");
  contactForm.errors = Object.values({ email, phone })
    .filter((i) => !!i)
    .join("; ");
});

events.on("contacts:submit", () => {
  api
    .postOrder({
      ...orderData.order,
      total: basketData.getTotalBasket(),
      items: basketData.getBasketId(),
    })
    .then((result) => {
      orderForm.resetForm();
      contactForm.resetForm();
      events.emit("order:complete", result);
      basketData.cleanBasket();
      page.counter = basketData.getNumberBasket();
    })
    .catch(console.error);
});

events.on("order:complete", (res: ISuccessfulOrder) => {
  modal.render({
    content: success.render({
      total: res.total,
    }),
  });
});

events.on("success:close", () => {
  modal.close();
});

events.on(
  /^(order|contacts)\..*:change/,
  (data: { field: keyof IShoppingInfo; value: string }) => {
    orderData.setField(data.field, data.value);
  }
);
