import { MOBILE_MEDIA_QUERY } from '@/config/breakpoints';
import type { Product, Storefront } from '@/lib/content-schema';
import { Header, CallToAction, PhotoCollage, ReviewCard } from './Storefront';
import { MediaImage } from './MediaImage';
import { Icon } from './Icon';
import { ProductGallery } from './ProductGallery';
import { Carousel } from './Carousel';
import { PressGallery } from './PressGallery';
import { PurchaseAssurance } from './PurchaseAssurance';
import s from './Storefront.module.scss';
import pressGalleryStyles from './styles/PressGallery.module.scss';
export function ProductLanding({ product, content }: { product: Product; content: Storefront }) {
  return (
    <>
      <Header content={content} />
      <main id="main">
        <section className={`${s.container} ${s.hero}`} aria-labelledby="hero-heading">
          <h1 id="hero-heading">{product.heroHeading}</h1>
          <PhotoCollage images={product.heroImages} priority />
          <ul className={s.heroBenefits}>
            {content.heroBenefits.map((item) => (
              <li key={item.title}>
                <span className={s.iconCircle}>
                  <Icon name={item.icon} />
                </span>
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
          <div className={s.heroAction}>
            <CallToAction content={content} review={false} />
          </div>
          <div className={s.heroReview}>
            <ReviewCard quote={content.heroReview} compact label={content.reviewLabel} />
          </div>
        </section>
        <section
          className={`${s.press} ${pressGalleryStyles.press}`}
          aria-label={content.pressLabel}
        >
          <div className={s.container}>
            <p>{content.pressLabel}</p>
            <PressGallery items={content.press} label={content.pressLabel} />
          </div>
        </section>
        <section className={`${s.container} ${s.benefits}`} aria-labelledby="benefits-heading">
          <h2 id="benefits-heading">{content.benefitsHeading}</h2>
          <ProductGallery images={product.gallery} caption={product.galleryCaption} />
          <ul>
            {content.benefits.map((item) => (
              <li key={item.title}>
                <span className={s.iconCircle}>
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className={s.mobileOnly}>
            <CallToAction content={content} />
          </div>
        </section>
        <section className={s.story} aria-labelledby="story-heading">
          <div className={`${s.container} ${s.storyGrid}`}>
            <h2 id="story-heading">{content.storyHeading}</h2>
            <PhotoCollage images={content.storyImages} variant="story" />
            <div className={s.storyText}>
              {content.storyBody.split('\n\n').map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              <div className={s.desktopOnly}>
                <CallToAction content={content} review={false} />
              </div>
            </div>
          </div>
        </section>
        <section className={`${s.container} ${s.process}`} aria-labelledby="process-heading">
          <h2 id="process-heading">{content.processHeading}</h2>
          <Carousel label={content.processHeading} kind="steps" showDots={false}>
            {content.steps.map((item) => (
              <article className={s.stepCard} key={item.title}>
                <Icon name={item.icon} />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </Carousel>
          <CallToAction content={content} />
        </section>
        <section className={s.reviews} aria-labelledby="reviews-heading">
          <div className={s.sectionIntro}>
            <h2 id="reviews-heading">{content.reviewsHeading}</h2>
            <p>{content.reviewsDescription}</p>
          </div>
          <div className={s.community}>
            {content.communityImages.map((image, i) => (
              <MediaImage
                media={image}
                key={`${image.url}-${i}`}
                sizes={`${MOBILE_MEDIA_QUERY} 33vw, 10vw`}
              />
            ))}
          </div>
          <div className={s.container}>
            <Carousel label={content.reviewsHeading}>
              {content.testimonials.map((quote, i) => (
                <ReviewCard key={i} quote={quote} />
              ))}
            </Carousel>
            <CallToAction content={content} />
          </div>
        </section>
        <section className={`${s.container} ${s.faq}`} aria-labelledby="faq-heading">
          <div>
            <h2 id="faq-heading">{content.faqHeading}</h2>
            <div className={s.accordion}>
              {content.faqs.map((faq, i) => (
                <details key={i} open={i === 0}>
                  <summary>
                    {faq.question}
                    <span aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
            <div className={s.mobileOnly}>
              <CallToAction content={content} />
            </div>
          </div>
          <PhotoCollage images={content.faqImages} variant="faq" />
        </section>
        <section className={s.impact} aria-labelledby="impact-heading">
          <div className={s.container}>
            <h2 id="impact-heading">{content.impactHeading}</h2>
            <div className={s.impactItems}>
              {content.impact.map((item) => (
                <div className={!item.showOnMobile ? s.desktopOnly : undefined} key={item.label}>
                  <span className={s.iconCircle}>
                    <Icon name={item.icon} />
                  </span>
                  <strong>{item.value}</strong>
                  <p>{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className={s.final} aria-labelledby="final-heading">
          <div className={s.sectionIntro}>
            <h2 id="final-heading">{content.finalHeading}</h2>
            <p className={s.desktopOnly}>{content.finalDescription}</p>
            <p className={s.mobileOnly}>{content.finalMobileDescription}</p>
          </div>
          <PhotoCollage images={content.finalImages} variant="final" />
          <CallToAction content={content} />
          <PurchaseAssurance content={content.purchaseAssurance} />
        </section>
      </main>
    </>
  );
}
