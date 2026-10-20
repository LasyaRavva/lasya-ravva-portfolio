import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function getOrCreateMeta(attribute, name) {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.append(element)
  }
  return element
}

export default function usePageMeta(title, description) {
  const { pathname } = useLocation()

  useEffect(() => {
    const previousTitle = document.title
    const descriptionMeta = getOrCreateMeta('name', 'description')
    const ogTitle = getOrCreateMeta('property', 'og:title')
    const ogDescription = getOrCreateMeta('property', 'og:description')
    const ogUrl = getOrCreateMeta('property', 'og:url')
    const ogImage = getOrCreateMeta('property', 'og:image')
    const ogImageAlt = getOrCreateMeta('property', 'og:image:alt')
    const twitterTitle = getOrCreateMeta('name', 'twitter:title')
    const twitterDescription = getOrCreateMeta('name', 'twitter:description')
    const twitterImage = getOrCreateMeta('name', 'twitter:image')
    const twitterCard = getOrCreateMeta('name', 'twitter:card')
    let canonical = document.head.querySelector('link[rel="canonical"]')
    const madeCanonical = !canonical
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.append(canonical)
    }

    const previous = {
      description: descriptionMeta.content,
      ogTitle: ogTitle.content,
      ogDescription: ogDescription.content,
      ogUrl: ogUrl.content,
      ogImage: ogImage.content,
      ogImageAlt: ogImageAlt.content,
      twitterTitle: twitterTitle.content,
      twitterDescription: twitterDescription.content,
      twitterImage: twitterImage.content,
      twitterCard: twitterCard.content,
      canonical: canonical.href,
    }

    document.title = title
    descriptionMeta.content = description
    ogTitle.content = title
    ogDescription.content = description
    twitterTitle.content = title
    twitterDescription.content = description
    const socialImageUrl = new URL('/og-image.png', window.location.origin).href
    ogImage.content = socialImageUrl
    ogImageAlt.content = 'Lasya Ravva — freelance web developer building responsive websites and web apps'
    twitterImage.content = socialImageUrl
    twitterCard.content = 'summary_large_image'
    const canonicalUrl = new URL(pathname, window.location.origin).href
    ogUrl.content = canonicalUrl
    canonical.href = canonicalUrl

    return () => {
      document.title = previousTitle
      descriptionMeta.content = previous.description
      ogTitle.content = previous.ogTitle
      ogDescription.content = previous.ogDescription
      ogUrl.content = previous.ogUrl
      ogImage.content = previous.ogImage
      ogImageAlt.content = previous.ogImageAlt
      twitterTitle.content = previous.twitterTitle
      twitterDescription.content = previous.twitterDescription
      twitterImage.content = previous.twitterImage
      twitterCard.content = previous.twitterCard
      if (madeCanonical) canonical.remove()
      else canonical.href = previous.canonical
    }
  }, [description, pathname, title])
}
