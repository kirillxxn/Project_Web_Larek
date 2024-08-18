import './scss/styles.scss';

import {
	IFormStepOne,
	IFormStepTwo,
	IOrderForm,
	IProductItem,
} from './types/index';

import { EventEmitter } from './components/base/events';

import { ProductData } from './components/model/ProductData';
import { OrderData } from './components/model/OrderData';
import { BasketData } from './components/model/BasketData';

import { Basket } from './components/view/Basket';
import { Modal } from './components/view/Modal';
import { MainPage } from './components/view/MainPage';
import { OrderContacts } from './components/view/OrderContacts';
import { OrderPayment } from './components/view/OrderPayment';
import { ProductCard } from './components/view/ProductCard';
import { Success } from './components/view/Success';

import { WebAPI } from './components/AppApi';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const events = new EventEmitter();
const api = new WebAPI(CDN_URL, API_URL);

const success = new Success(cloneTemplate(successTemplate), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const orderForm = new OrderPayment(cloneTemplate(orderTemplate), events);
const contactForm = new OrderContacts(cloneTemplate(contactsTemplate), events);
const page = new MainPage(document.body, events);
const basket = new Basket(cloneTemplate(basketTemplate), events);

const basketData = new BasketData({}, events);
const productData = new ProductData({}, events);
const orderData = new OrderData({}, events);

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
});

api
	.getCardList()
	.then((res) => {
		productData.products = res;
	})
	.catch(console.error);

events.on('product:changed', () => {
	page.catalog = productData.products.map((item) => {
		const cardProduct = new ProductCard(
			cloneTemplate(cardCatalogTemplate),
			basketData.checkProductInBasket(item),
			item,
			events,
			{
				onClick: () => events.emit('product:select', item),
			}
		);
		return cardProduct.render(item);
	});
});

events.on('product:select', (product: IProductItem) => {
	productData.preview = product.id;
});

events.on('preview:changed', (product: IProductItem) => {
	if (product) {
		const productCard = new ProductCard(
			cloneTemplate(cardPreviewTemplate),
			basketData.checkProductInBasket(product),
			product,
			events
		);
		modal.render({
			content: productCard.render(product),
		});
	} else {
		modal.close();
	}
});

events.on('preview:delete', (product: IProductItem) => {
	basketData.deleteProductsInBasket(product);
	events.emit('basket:changed');

	const cardBasket = new ProductCard(
		cloneTemplate(cardPreviewTemplate),
		basketData.checkProductInBasket(product),
		product,
		events
	);
	modal.render({ content: cardBasket.render(product) });
	modal.close();
});

events.on('basket:open', () => {
	modal.render({
		content: basket.render(),
	});
});

events.on('basket:changed', () => {
	page.counter = basketData.totalProducts;
	basket.total = basketData.totalPrice;

	basket.items = Array.from(basketData.getProductsInBasket()).map(
		(basketProduct, index) => {
			const item = Array.from(basketData.getProductsInBasket()).find(
				(product) => product.id === basketProduct.id
			);
			const product = new ProductCard(
				cloneTemplate(cardBasketTemplate),
				true,
				item,
				events,
				{
					onClick: () => events.emit('basket:changed'),
				}
			);

			product.index = String(index + 1);
			return product.render(item);
		}
	);
});

events.on('basket:add', (product: IProductItem) => {
	basketData.setProductsInBasket(product);
	events.emit('basket:changed');

	const cardBasket = new ProductCard(
		cloneTemplate(cardPreviewTemplate),
		basketData.checkProductInBasket(product),
		product,
		events
	);
	modal.render({ content: cardBasket.render(product) });
	modal.close();
});

events.on('basket:delete', (product: IProductItem) => {
	basketData.deleteProductsInBasket(product);
});

events.on('order:open', () => {
	modal.render({
		content: orderForm.render({
			address: '',
			payment: 'card',
			valid: true,
			errors: [],
		}),
	});
});

events.on('order:submit', () => {
	modal.render({
		content: contactForm.render({
			phone: '',
			email: '',
			valid: false,
			errors: [],
		}),
	});
});

events.on('payment:select', (name: IFormStepOne) => {
	orderData.setOrderField('payment', name.payment);
});

events.on('order:ready', () => {
	contactForm.valid = true;
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { address, payment } = errors;
	orderForm.valid = !address && !payment;
	orderForm.errors = Object.values({ address, payment })
		.filter((i) => !!i)
		.join('; ');
});

events.on('formErrors:change', (errors: Partial<IOrderForm>) => {
	const { email, phone } = errors;
	contactForm.valid = !email && !phone;
	contactForm.errors = Object.values({ email, phone })
		.filter((i) => !!i)
		.join('; ');
});

events.on(
	/^order\..*:change/,
	(data: { field: keyof IFormStepOne; value: string }) => {
		orderData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IFormStepTwo; value: string }) => {
		orderData.setOrderField(data.field, data.value);
	}
);

events.on('contacts:submit', () => {
	orderData.setOrderItems(
		basketData.getProductsInBasket().map((item) => item.id)
	);
	orderData.setOrderPrice(basketData.totalPrice);

	api
		.orderProduct(orderData.order)
		.then(() => {
			success.total = basketData.totalPrice;
			modal.render({
				content: success.render({}),
			});
			basketData.clearBasket();
			orderForm.paymentSelectedRemove();
			orderData.clearOrder();
			events.emit('basket:changed');
		})
		.catch(console.error);
});

events.on('success:close', () => {
	modal.close();
});