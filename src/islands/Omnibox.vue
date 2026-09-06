<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { IndexRow } from '../lib/data'
import { href } from '../lib/site'
import { omniboxFilter } from '../lib/omnibox-filter'

const open = ref(false)
const query = ref('')
const rows = ref<IndexRow[]>([])
const selected = ref(0)
const inputEl = ref<HTMLInputElement | null>(null)

const results = ref<IndexRow[]>([])

async function ensureRows() {
  if (rows.value.length > 0) return
  const res = await fetch(href('/data/index.json'))
  rows.value = await res.json()
}

function run() {
  results.value = omniboxFilter(rows.value, query.value)
  selected.value = 0
}

async function show() {
  open.value = true
  await ensureRows()
  requestAnimationFrame(() => inputEl.value?.focus())
}

function hide() {
  open.value = false
  query.value = ''
  results.value = []
}

function go(row: IndexRow | undefined) {
  if (!row) return
  window.location.href = href(`/elements/${row.t}`)
}

function onKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value ? hide() : show()
    return
  }
  if (!open.value) return
  if (e.key === 'Escape') hide()
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selected.value = Math.min(selected.value + 1, results.value.length - 1)
  }
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    selected.value = Math.max(selected.value - 1, 0)
  }
  if (e.key === 'Enter') go(results.value[selected.value])
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  window.addEventListener('untded:search', onSearchEvent as EventListener)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  window.removeEventListener('untded:search', onSearchEvent as EventListener)
})

async function onSearchEvent(e: CustomEvent<string>) {
  await show()
  query.value = e.detail ?? ''
  run()
}
</script>

<template>
  <div>
    <button
      type="button"
      class="flex items-center gap-2 rounded-full border border-line bg-paper px-3.5 py-1.5 text-sm text-body hover:border-un/60 hover:text-un-deep transition-colors"
      @click="show"
    >
      <span aria-hidden="true">⌕</span>
      Look up an element
      <kbd class="rounded-full border border-line bg-mist px-2 font-mono text-[0.7rem] text-body/80">⌘K</kbd>
    </button>

    <div v-if="open" class="fixed inset-0 z-50 flex items-start justify-center bg-panel/40 p-4 pt-[12vh]" @click.self="hide">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Look up an element"
        class="w-full max-w-xl overflow-hidden rounded-lg border border-line bg-paper shadow-xl"
      >
        <input
          ref="inputEl"
          v-model="query"
          class="w-full border-b border-line bg-paper px-4 py-3 text-base outline-none"
          type="search"
          placeholder="Tag (1001) or name (document type)…"
          @input="run"
          @keydown="onKeydown"
          aria-label="Tag or name"
        />
        <ul class="max-h-80 overflow-auto" role="listbox">
          <li v-if="query && results.length === 0" class="px-4 py-6 text-center text-sm text-body">
            No element matches “{{ query }}”. Search by tag, e.g. <span class="font-mono">1001</span>, or by name.
          </li>
          <li
            v-for="(r, i) in results"
            :key="r.t"
            role="option"
            :aria-selected="i === selected"
            :class="i === selected ? 'bg-un/10' : ''"
            class="flex cursor-pointer items-baseline gap-3 px-4 py-2 text-sm hover:bg-un/5"
            @click="go(r)"
            @mousemove="selected = i"
          >
            <span class="font-mono tabular-nums text-un-deep">{{ r.t }}</span>
            <span class="text-ink">{{ r.n || '(retired — see entry)' }}</span>
            <span class="ms-auto font-mono text-xs text-body">{{ r.r }}</span>
          </li>
        </ul>
        <p class="border-t border-line bg-mist px-4 py-1.5 text-xs text-body">
          ↑↓ to move · ↵ to open · esc to close
        </p>
      </div>
    </div>
  </div>
</template>
