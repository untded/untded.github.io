<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { IndexRow } from '../lib/data'
import { href } from '../lib/site'
import { filterRows, filtersFromParams, EMPTY_FILTERS, type DirectoryFilters } from '../lib/directory-filter'

export interface CategoryMeta {
  k: number
  range: string
  label: string
}

const props = defineProps<{ categories: CategoryMeta[]; changes: string[] }>()

const rows = ref<IndexRow[]>([])
const loaded = ref(false)
const filters = ref<DirectoryFilters>(
  typeof window === 'undefined'
    ? { ...EMPTY_FILTERS }
    : filtersFromParams(new URLSearchParams(window.location.search)),
)

const CHANGE_LABELS: Record<string, string> = {
  add: 'Added',
  u: 'Undeleted',
  cn: 'Changed name',
  cnd: 'Changed name + desc.',
  cnr: 'Changed name + repr.',
  cndr: 'Changed name + desc. + repr.',
  x: 'Marked for deletion',
}

const visible = computed(() => filterRows(rows.value, filters.value))

async function load() {
  const res = await fetch(href('/data/index.json'))
  rows.value = await res.json()
  loaded.value = true
}

function setParam(key: keyof DirectoryFilters, value: string | number) {
  const url = new URL(window.location.href)
  const str = String(value)
  if (str === '' || str === '0' || str === 'all') url.searchParams.delete(key)
  else url.searchParams.set(key, str)
  window.history.replaceState(null, '', url)
}

function onQ(e: Event) {
  filters.value.q = (e.target as HTMLInputElement).value
  setParam('q', filters.value.q)
}

function onSelect(key: keyof DirectoryFilters, e: Event) {
  const value = (e.target as HTMLSelectElement).value
  ;(filters.value as Record<string, unknown>)[key] = key === 'cat' ? Number(value) : value
  setParam(key, value)
}

onMounted(load)
onBeforeUnmount(() => {})
</script>

<template>
  <div>
    <div class="filter-bar mb-4">
      <label class="sr-only" for="dir-q">Search by tag or name</label>
      <input
        id="dir-q"
        class="filter-input"
        type="search"
        placeholder="Filter by tag or name…"
        :value="filters.q"
        @input="onQ"
      />
      <label class="sr-only" for="dir-cat">Category</label>
      <select id="dir-cat" class="filter-select" :value="filters.cat" @change="onSelect('cat', $event)">
        <option value="0">All categories</option>
        <option v-for="c in categories" :key="c.k" :value="c.k">{{ c.range }} — {{ c.label }}</option>
      </select>
      <label class="sr-only" for="dir-status">Status</label>
      <select id="dir-status" class="filter-select" :value="filters.status" @change="onSelect('status', $event)">
        <option value="all">Any status</option>
        <option value="active">Active</option>
        <option value="retired">Retired</option>
      </select>
      <label class="sr-only" for="dir-change">Change tag</label>
      <select id="dir-change" class="filter-select" :value="filters.change" @change="onSelect('change', $event)">
        <option value="">Any change</option>
        <option v-for="c in changes" :key="c" :value="c">{{ CHANGE_LABELS[c] ?? c }}</option>
      </select>
      <label class="sr-only" for="dir-cs">Representation charset</label>
      <select id="dir-cs" class="filter-select" :value="filters.cs" @change="onSelect('cs', $event)">
        <option value="">Any repr.</option>
        <option value="an">an…</option>
        <option value="n">n…</option>
        <option value="a">a…</option>
      </select>
      <label class="sr-only" for="dir-sort">Sort order</label>
      <select id="dir-sort" class="filter-select" :value="filters.sort" @change="onSelect('sort', $event)">
        <option value="tag">Tag ↑</option>
        <option value="-tag">Tag ↓</option>
        <option value="name">Name A–Z</option>
        <option value="-name">Name Z–A</option>
      </select>
      <span class="filter-count" aria-live="polite">
        {{ loaded ? `${visible.length} of ${rows.length} elements` : 'loading…' }}
      </span>
    </div>

    <p v-if="loaded && visible.length === 0" class="rounded-md border border-line bg-mist p-6 text-center text-body">
      No elements match these filters. Clear the search or pick another category.
    </p>

    <table v-if="loaded && visible.length > 0" class="dir-table">
      <thead>
        <tr>
          <th scope="col">Tag</th>
          <th scope="col">Name</th>
          <th scope="col">Repr.</th>
          <th scope="col">Change</th>
          <th scope="col">Category</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in visible" :key="r.t" :class="r.s === 'r' ? 'retired' : ''">
          <td class="font-mono tabular-nums">
            <a :href="href(`/elements/${r.t}`)">{{ r.t }}</a>
          </td>
          <td class="name-cell">
            <a :href="href(`/elements/${r.t}`)">{{ r.n || '(retired — see entry)' }}</a>
          </td>
          <td class="font-mono text-xs text-body">{{ r.r || '—' }}</td>
          <td class="font-mono text-xs text-body">{{ r.c }}</td>
          <td>
            <span class="me-1 inline-block h-2 w-2 rounded-full align-middle" :class="`bg-cat-${r.k}`" aria-hidden="true"></span>
            <span class="font-mono text-xs text-body">{{ r.k }}000</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
