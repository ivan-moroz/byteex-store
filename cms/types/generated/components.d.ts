import type { Schema, Struct } from '@strapi/strapi';

export interface ContentAssuranceBenefit extends Struct.ComponentSchema {
  collectionName: 'components_content_assurance_benefits';
  info: {
    displayName: 'assurance-benefit';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['truck', 'shield', 'cart']> & Schema.Attribute.Required;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ContentFaq extends Struct.ComponentSchema {
  collectionName: 'components_content_faqs';
  info: {
    displayName: 'faq';
  };
  attributes: {
    answer: Schema.Attribute.Text & Schema.Attribute.Required;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentImpact extends Struct.ComponentSchema {
  collectionName: 'components_content_impacts';
  info: {
    displayName: 'impact';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<['cloud', 'water', 'bolt']> & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    showOnMobile: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentItem extends Struct.ComponentSchema {
  collectionName: 'components_content_items';
  info: {
    displayName: 'item';
  };
  attributes: {
    description: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      ['sun', 'leaf', 'waves', 'cart', 'truck', 'cloud', 'water', 'bolt']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'leaf'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentPaymentMethod extends Struct.ComponentSchema {
  collectionName: 'components_content_payment_methods';
  info: {
    displayName: 'payment-method';
  };
  attributes: {
    imageUrl: Schema.Attribute.String & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentPress extends Struct.ComponentSchema {
  collectionName: 'components_content_presss';
  info: {
    displayName: 'press';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentPurchaseAssurance extends Struct.ComponentSchema {
  collectionName: 'components_content_purchase_assurances';
  info: {
    displayName: 'purchase-assurance';
  };
  attributes: {
    benefits: Schema.Attribute.Component<'content.assurance-benefit', true>;
    paymentMethods: Schema.Attribute.Component<'content.payment-method', true>;
    shippingNotice: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ContentQuote extends Struct.ComponentSchema {
  collectionName: 'components_content_quotes';
  info: {
    displayName: 'quote';
  };
  attributes: {
    avatar: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    rating: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 5;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<5>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'content.assurance-benefit': ContentAssuranceBenefit;
      'content.faq': ContentFaq;
      'content.impact': ContentImpact;
      'content.item': ContentItem;
      'content.payment-method': ContentPaymentMethod;
      'content.press': ContentPress;
      'content.purchase-assurance': ContentPurchaseAssurance;
      'content.quote': ContentQuote;
    }
  }
}
