import type { Schema, Struct } from '@strapi/strapi';

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

export interface ContentPress extends Struct.ComponentSchema {
  collectionName: 'components_content_presss';
  info: {
    displayName: 'press';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
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
      'content.faq': ContentFaq;
      'content.impact': ContentImpact;
      'content.item': ContentItem;
      'content.press': ContentPress;
      'content.quote': ContentQuote;
    }
  }
}
