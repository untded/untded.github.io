<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { IndexRow } from '../lib/data'
import { href } from '../lib/site'
import { buildTree, filterTree, type TreeCategory, type TreeClass, type TreeLeaf } from '../lib/tree'

export interface CategoryMeta {
  k: number
  range: string
  label: string
}

const props = defineProps<{ categories: CategoryMeta[] }>()

const rows = ref<IndexRow[]>([])
const loaded = ref(false)
const query = ref('')
const expanded = ref(new Set<string>())

const tree = computed(() => buildTree(rows.value))
const filtered = computed(() => filterTree(tree.value, query.value))
const searching = computed(() => query.value.trim().length > 0)

async function load() {
  const res = await fetch(href('/data/index.json'))
  rows.value = await res.json()
  loaded.value = true
}

function toggle(key: string) {
  const next = new Set(expanded.value)
  next.has(key) ? next.delete(key) : next.add(key)
  expanded.value = next
}

function categoryLabel(cat: TreeCategory) {
  return props.categories.find((c) => c.k === cat.k)?.label ?? `${cat.k}000`
}

function categoryRange(cat: TreeCategory) {
  return props.categories.find((c) => c.k === cat.k)?.range ?? `${cat.k}000`
}

function leafLabel(leaf: TreeLeaf) {
  if (!leaf.name) return `(retired ${leaf.tag})`
  const segments = leaf.name.split('.').map((s) => s.trim())
  return segments.length >= 2 ? segments[segments.length - 1] : leaf.name
}

function onQ(e: Event) {
  query.value = (e.target as HTMLInputElement).value
}

onMounted(load)
</script>

<template>
  <div>
    <div class="filter-card mb-4"><div class="filter-bar">
      <label class="sr-only" for="tree-q">Filter the tree by tag or name</label>
      <input
        id="tree-q"
        class="filter-input"
        type="search"
        placeholder="Filter by tag or name — branches open as you type…"
        :value="query"
        @input="onQ"
      />
      <span v-if="searching" class="filter-count" aria-live="polite">
        {{ filtered.matches }} {{ filtered.matches === 1 ? 'match' : 'matches' }}
      </span>
      </div>
    </div>

    <p v-if="!loaded" class="text-sm text-body">loading…</p>
    <p
      v-else-if="searching && filtered.matches === 0"
      class="rounded-md border border-line bg-mist p-6 text-center text-body"
    >
      No element matches “{{ query }}”. Try a tag such as <span class="font-mono">1001</span>, or a
      name fragment like “document”.
    </p>

    <ul v-if="loaded" role="tree" aria-label="Elements grouped by category and object class" class="space-y-1">
      <li v-for="cat in searching ? filtered.tree : tree" :key="cat.key" role="treeitem" :aria-expanded="searching || expanded.has(cat.key)">
        <button
          type="button"
          class="flex w-full items-center gap-3 rounded-md py-2 text-left"
          :class="searching || expanded.has(cat.key) ? '' : 'hover:bg-mist'"
          @click="!searching && toggle(cat.key)"
        >
          <span class="me-1 inline-block h-2.5 w-2.5 rounded-full align-middle" :class="`bg-cat-${cat.k}`" aria-hidden="true"></span>
          <span class="font-mono text-xs tabular-nums text-body">{{ categoryRange(cat) }}</span>
          <span class="font-medium text-ink">{{ categoryLabel(cat) }}</span>
          <span class="filter-count ms-auto">{{ cat.count }}</span>
          <span aria-hidden="true" class="font-mono text-xs text-body/60" v-if="!searching">
            {{ expanded.has(cat.key) ? '−' : '+' }}
          </span>
        </button>

        <div
          v-if="searching || expanded.has(cat.key)"
          class="ms-4 border-s border-line ps-3"
          role="group"
          :aria-label="categoryLabel(cat)"
        >
          <ul class="space-y-0.5">
            <li v-for="cls in cat.classes" :key="cls.key">
              <div class="flex items-baseline gap-2 border-s border-line ps-3 py-0.5">
                <span class="text-sm font-medium text-ink break-words">{{ cls.label }}</span>
                <span class="filter-count">{{ cls.count }}</span>
              </div>
              <ul class="space-y-0.5">
                <li v-for="leaf in cls.leaves" :key="leaf.tag">
                  <a
                    :href="href(`/elements/${leaf.tag}`)"
                    class="flex flex-wrap items-baseline gap-x-3 border-s border-line ps-3 py-0.5 text-sm hover:bg-mist"
                    :title="leaf.name"
                  >
                    <span class="font-mono tabular-nums text-un-deep">{{ leaf.tag }}</span>
                    <span class="break-words" :class="leaf.status === 'r' ? 'text-stamp' : 'text-body'">
                      {{ leafLabel(leaf) }}
                    </span>
                    <span class="ms-auto font-mono text-xs text-body/60">{{ leaf.r || '—' }}</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
          <div v-if="cat.unnamed.length" class="mt-1">
            <p class="text-xs uppercase tracking-wider text-body/70 py-0.5">(no 2005 name)</p>
            <ul class="space-y-0.5">
              <li v-for="leaf in cat.unnamed" :key="leaf.tag">
                <a
                  :href="href(`/elements/${leaf.tag}`)"
                  class="flex items-baseline gap-x-3 border-s border-line ps-3 py-0.5 text-sm hover:bg-mist"
                >
                  <span class="font-mono tabular-nums text-stamp">{{ leaf.tag }}</span>
                  <span class="text-stamp">retired</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
