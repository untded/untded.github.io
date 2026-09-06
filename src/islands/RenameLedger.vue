<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { href } from '../lib/site'
import type { LedgerLine } from '../lib/ledgers'

const props = defineProps<{ lines: LedgerLine[] }>()

const index = ref(0)
let timer: ReturnType<typeof setInterval> | undefined
let reduced = false
let paused = false

function advance() {
  index.value = (index.value + 1) % props.lines.length
}

function pause() {
  paused = true
}

function resume() {
  paused = false
}

onMounted(() => {
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduced && props.lines.length > 1) {
    timer = setInterval(() => {
      if (!paused) advance()
    }, 3200)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div
    class="rounded-md border border-line bg-paper"
    @mouseenter="pause"
    @mouseleave="resume"
    @focusin="pause"
    @focusout="resume"
    role="img"
    :aria-label="`Rename example: tag ${lines[index].tag}, ${lines[index].from}, renamed to ${lines[index].to}`"
  >
    <div class="border-b border-line px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-body">
      1993 <span class="mx-1 text-un">→</span> 2005 · element names in both editions
    </div>
    <Transition name="ledger" mode="out-in">
      <div :key="index" class="grid gap-1 px-4 py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-x-4">
        <a
          :href="href(`/elements/${lines[index].tag}`)"
          class="font-mono text-sm tabular-nums text-un-deep hover:underline"
        >
          {{ lines[index].tag }}
        </a>
        <p class="text-[0.95rem] leading-snug">
          <span class="text-stamp">{{ lines[index].from }}</span>
          <span class="mx-2 font-mono text-un">→</span>
          <span class="font-medium text-ink">{{ lines[index].to }}</span>
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.ledger-enter-active,
.ledger-leave-active {
  transition: opacity 280ms ease, transform 280ms ease;
}
.ledger-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.ledger-leave-to {
  opacity: 0;
}
@media (prefers-reduced-motion: reduce) {
  .ledger-enter-active,
  .ledger-leave-active {
    transition: none;
  }
}
</style>
