<script setup>
import { onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { scrollToSectionId } from '@/composables/useHomeSectionNav'
import { useSeo } from '@/composables/useSeo'
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import StatsSection from '../components/StatsSection.vue'
import DetailedFeatures from '../components/DetailedFeatures.vue'
import CapabilitiesSection from '../components/CapabilitiesSection.vue'
import FeatureSection from '../components/FeatureSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import PricingSection from '../components/PricingSection.vue'
import FAQSection from '../components/FAQSection.vue'
import ContactSection from '../components/ContactSection.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()
const { t } = useI18n()

useSeo({
  path: '/',
  title: () => t('seo.home.title'),
  description: () => t('seo.home.description'),
  keywords: () => t('seo.home.keywords'),
  ogDescription: () => t('seo.home.og_description'),
})

function scrollFromQueryIfPresent() {
  const section = route.query.section
  if (typeof section !== 'string' || !section) return
  nextTick(() => {
    setTimeout(() => {
      scrollToSectionId(section)
      router.replace({ path: '/', query: {} })
    }, 200)
  })
}

onMounted(async () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!prefersReducedMotion) {
    await import('aos/dist/aos.css')
    const { default: AOS } = await import('aos')
    await nextTick()
    AOS.init({
      duration: 700,
      easing: 'ease-out',
      once: true,
      // Telefonda animatsiya scroll paytida balandlikni o'zgartirib,
      // bo'limga o'tishni siljitadi — kichik ekranda o'chiriladi.
      disable: () => window.innerWidth < 768,
    })
  }

  scrollFromQueryIfPresent()
})
</script>

<template>
  <main>
    <NavBar />
    <HeroSection />
    <StatsSection data-aos="fade-up" />
    <DetailedFeatures data-aos="fade-up" />
    <CapabilitiesSection data-aos="fade-up" />
    <FeatureSection data-aos="fade-up" />
    <TestimonialsSection data-aos="fade-up" />
    <PricingSection data-aos="fade-up" />
    <FAQSection data-aos="fade-up" />
    <ContactSection data-aos="fade-up" />
    <Footer />
  </main>
</template>
