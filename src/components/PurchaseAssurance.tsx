import type { Storefront } from '@/lib/content-schema';
import { MediaImage } from './MediaImage';
import { Icon } from './Icon';
import styles from './styles/PurchaseAssurance.module.scss';

export function PurchaseAssurance({ content }: { content: Storefront['purchaseAssurance'] }) {
  if (!content) return null;
  return (
    <div className={styles.purchaseAssurance}>
      <div className={styles.paymentRow}>
        <p className={styles.shippingNotice}>
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
        <ul className={styles.paymentMethods}>
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
      <ul className={styles.purchaseBenefits}>
        {content.benefits.map((benefit, index) => (
          <li key={index}>
            <span className={styles.assuranceIcon}>
              <Icon name={benefit.icon} />
            </span>
            <span>{benefit.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
