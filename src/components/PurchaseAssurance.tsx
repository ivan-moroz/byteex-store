import type { Storefront } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import { Icon } from './Icon';
import s from './Storefront.module.scss';

export function PurchaseAssurance({ content }: { content: Storefront['purchaseAssurance'] }) {
  if (!content) return null;
  return (
    <div className={s.purchaseAssurance}>
      <div className={s.paymentRow}>
        <p className={s.shippingNotice}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 5v7h6" />
          </svg>
          {content.shippingNotice}
        </p>
        <ul className={s.paymentMethods}>
          {content.paymentMethods.map((method, index) => (
            <li key={`${method.name}-${index}`}>
              <MediaImage
                media={{
                  url: method.imageUrl,
                  alternativeText: method.name,
                  width: 38,
                  height: 24,
                }}
                sizes="28px"
              />
            </li>
          ))}
        </ul>
      </div>
      <ul className={s.purchaseBenefits}>
        {content.benefits.map((benefit, index) => (
          <li key={index}>
            <span className={s.assuranceIcon}>
              {benefit.icon === 'shield' ? (
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 2c3 2 6 3 9 3-1 9-4 14-9 17C7 19 4 14 3 5c3 0 6-1 9-3Z" />
                  <path d="m8 11 3 3 5-6" />
                </svg>
              ) : (
                <Icon name={benefit.icon} />
              )}
            </span>
            <span>{benefit.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
