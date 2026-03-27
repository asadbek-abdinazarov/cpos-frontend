<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { goToHomeSection } from '@/composables/useHomeSectionNav'
import VideoPlayer from './VideoPlayer.vue'

const { t } = useI18n()
const router = useRouter()
const isVideoOpen = ref(false)

const goContact = () => goToHomeSection(router, 'contact')
</script>

<template>
  <section class="hero">
    <div class="container hero-content">
      <div class="text-content">
        <h1 class="headline">
          {{ t('hero.title_prefix') }} <br>
          <span class="highlight">{{ t('hero.title_highlight') }}</span>
        </h1>
        <p class="subheadline">
          {{ t('hero.subtitle') }}
        </p>
        <div class="cta-group">
          <a href="/" @click.prevent="goContact">
            <button type="button" class="btn btn-primary btn-lg">{{ t('hero.cta') }}</button>
          </a>
          <button class="btn btn-outline btn-lg" @click="isVideoOpen = true">{{ t('hero.watch_demo') }}</button>
        </div>
      </div>
      <div class="visual-content">
        <!-- Placeholder for hero image/dashboard preview -->
        <div class="dashboard-preview">
          <div class="preview-header">
            <div class="dot red"></div>
            <div class="dot yellow"></div>
            <div class="dot green"></div>
          </div>
          <div class="preview-body">
            <div class="preview-sidebar"></div>
            <div class="preview-main">
              <div class="preview-card"></div>
              <div class="preview-card"></div>
              <div class="preview-card"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero-bg-shape"></div>
    <VideoPlayer :isOpen="isVideoOpen" @close="isVideoOpen = false" />
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding: 8rem 0 4rem;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  width: 100%;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  z-index: 10;
}

.headline {
  font-size: 4rem;
  line-height: 1.1;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 1.5rem;
  color: var(--color-secondary);
}

.highlight {
  color: var(--color-primary);
  position: relative;
  display: inline-block;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: 5px;
  left: 0;
  width: 100%;
  height: 15px;
  background-color: rgba(0, 123, 255, 0.1);
  z-index: -1;
  border-radius: 4px;
}

.subheadline {
  font-size: 1.25rem;
  color: var(--color-text-light);
  margin-bottom: 2.5rem;
  max-width: 500px;
}

.cta-group {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.btn-lg {
  padding: 1rem 2rem;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-outline {
  background-color: transparent;
  border: 2px solid var(--color-text-main);
  color: var(--color-text-main);
}

.btn-outline:hover {
  background-color: var(--color-text-main);
  color: var(--color-white);
  transform: translateY(-2px);
}

/* Dashboard Preview abstract UI */
.dashboard-preview {
  background: var(--color-white);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  padding: 1rem;
  border: 1px solid rgba(0,0,0,0.05);
  transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
  transition: transform 0.5s ease;
}

.dashboard-preview:hover {
  transform: perspective(1000px) rotateY(0) rotateX(0);
}

.preview-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.red { background-color: #ff5f56; }
.yellow { background-color: #ffbd2e; }
.green { background-color: #27c93f; }

.preview-body {
  display: flex;
  gap: 1rem;
  height: 300px;
}

.preview-sidebar {
  width: 60px;
  background-color: var(--color-surface);
  border-radius: 6px;
}

.preview-main {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  align-content: start;
}

.preview-card {
  height: 80px;
  background-color: var(--color-surface);
  border-radius: 6px;
}

.hero-bg-shape {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 50%;
  height: 120%;
  background: linear-gradient(135deg, rgba(0, 123, 255, 0.05) 0%, rgba(0, 123, 255, 0) 100%);
  z-index: 1;
  border-radius: 50px;
  transform: skewX(-20deg);
}

@media (max-width: 900px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
  }
  
  .headline {
    font-size: 3.5rem; /* Increased from 3rem */
  }
  
  .subheadline {
    margin: 0 auto 2rem;
  }
  
  .cta-group {
    justify-content: center;
  }
  
  .dashboard-preview {
    transform: none;
    max-width: 500px;
    margin: 0 auto;
  }
  
  .dashboard-preview:hover {
    transform: none;
  }
}

@media (max-width: 480px) {
  .headline {
    font-size: 2.75rem; /* Increased from 2.25rem */
  }
  
  .hero {
    padding: 6rem 0 3rem; /* Kept similar but ensure it fits */
  }
  
  .subheadline {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }

  .cta-group {
    flex-direction: column;
    width: 100%;
    gap: 0.75rem;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
