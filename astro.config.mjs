import { defineConfig } from 'astro/config'
import vue from '@astrojs/vue'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://www.untded.org',
  output: 'static',
  trailingSlash: 'never',
  integrations: [vue(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
