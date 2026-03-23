<script setup>
import { onMounted, nextTick } from 'vue'
import NavBar from '../components/NavBar.vue'
import HeroSection from '../components/HeroSection.vue'
import StatsSection from '../components/StatsSection.vue'
import DetailedFeatures from '../components/DetailedFeatures.vue'
import IntegrationsSection from '../components/IntegrationsSection.vue'
import HardwareSection from '../components/HardwareSection.vue'
import TestimonialsSection from '../components/TestimonialsSection.vue'
import PricingSection from '../components/PricingSection.vue'
import FeatureSection from '../components/FeatureSection.vue'
import FAQSection from '../components/FAQSection.vue'
import ContactSection from '../components/ContactSection.vue'
import Footer from '../components/Footer.vue'

onMounted(async () => {
  document.title = 'CPOS - Smart POS for Retail & Services'
  await import('aos/dist/aos.css')
  const { default: AOS } = await import('aos')
  await nextTick()
  AOS.init({
    duration: 800,
    easing: 'slide',
    once: true,
  })
})
</script>

<template>
  <main>
    <NavBar />
    <HeroSection />
    <StatsSection data-aos="fade-up" />
    <DetailedFeatures data-aos="fade-up" />
    <FeatureSection data-aos="fade-up" />
    <IntegrationsSection data-aos="fade-up" />
    <HardwareSection data-aos="fade-up" />
    <TestimonialsSection data-aos="fade-up" />
    <PricingSection data-aos="fade-up" />
    <FAQSection data-aos="fade-up" />
    <ContactSection data-aos="fade-up" />
    <Footer />
  </main>
</template>

