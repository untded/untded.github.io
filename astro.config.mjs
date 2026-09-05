import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://www.untded.org',
  output: 'static',
  trailingSlash: 'never',
  integrations: [vue(), sitemap()],
  // hover-prefetch internal links registry-wide; element pages feel instant
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  // auto: tiny CSS inlines; the site sheet stays external so it caches
  // across the 1500+ pages instead of re-downloading per page
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
  },
})
