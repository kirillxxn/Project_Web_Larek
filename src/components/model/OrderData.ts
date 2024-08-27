import { IProductItem, IShoppingInfo, IFormError, IAppInfo } from "../../types";
import { Model } from "../base/model";

export class OrderData extends Model<IAppInfo> {
  order: IShoppingInfo = {
    payment: "",
    address: "",
    email: "",
    phone: "",
  };
  orderErrors: IFormError = {};
  formType: "order" | "contacts";
  preview: string | null;

  setField(field: keyof IShoppingInfo, value: string) {
    this.order[field] = value;
    if (field === "address" || field === "payment") {
      this.setOrderErrors();
    }

    if (field === "phone" || field === "email") {
      this.setContactsErrors();
    }
  }

  setOrderErrors() {
    const errors: IFormError = {};
    if (!this.order.payment) {
      errors.payment = "Выберите способ оплаты";
    }
    if (!this.order.address) {
      errors.address = "Укажите адрес";
    }
    this.orderErrors = errors;
    this.events.emit("formErrors:change", this.orderErrors);
    return Object.keys(errors).length === 0;
  }

  setContactsErrors() {
    const errors: IFormError = {};

    const validateEmail = (email: string): boolean => {
      const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
      return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/;
      return phoneRegex.test(phone);
    };

    if (!this.order.phone) {
      errors.phone = "Укажите телефон";
    } else if (!validatePhone(this.order.phone)) {
      errors.phone = "Некорректный формат телефона";
    }

    if (!this.order.email) {
      errors.email = "Укажите email";
    } else if (!validateEmail(this.order.email)) {
      errors.email = "Некорректный формат email";
    }

    this.orderErrors = errors;
    this.events.emit("formErrors:change", this.orderErrors);
    return Object.keys(errors).length === 0;
  }

  clearErrors(): void {
    this.orderErrors = null;
  }
}
