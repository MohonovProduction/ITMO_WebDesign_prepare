<script setup>
import MathText from '@/components/MathText.vue'
import Formula from '@/components/Formula.vue'
import MetricDirectionChip from '@/components/MetricDirectionChip.vue'
import ExampleBlock from '@/components/ExampleBlock.vue'

defineProps({
  item: { type: Object, required: true },
  number: { type: [Number, String], default: null },
})
</script>

<template>
  <article :id="'q-' + item.id" class="card flex flex-col gap-4 p-5 sm:p-6">
    <header class="flex items-start gap-3">
      <span
        v-if="number !== null"
        class="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-brand-50 text-sm font-bold text-brand-700"
      >
        {{ number }}
      </span>
      <h3 class="text-lg font-bold leading-snug text-slate-900 sm:text-xl">{{ item.title }}</h3>
    </header>

    <section>
      <div class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Определение</div>
      <p class="leading-relaxed text-slate-700"><MathText :text="item.definition" /></p>
    </section>

    <section v-if="item.formulas?.length" class="rounded-xl bg-slate-50 p-4">
      <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Формулы</div>
      <div class="flex flex-col gap-1">
        <Formula v-for="(f, i) in item.formulas" :key="i" :expr="f" />
      </div>
    </section>

    <section v-if="item.notation?.length">
      <div class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Обозначения</div>
      <ul class="flex flex-col gap-1.5">
        <li v-for="(n, i) in item.notation" :key="i" class="flex flex-wrap items-baseline gap-2 text-sm">
          <span class="rounded bg-white px-2 py-0.5 ring-1 ring-slate-200">
            <Formula :expr="n.symbol" :display="false" />
          </span>
          <span class="text-slate-600">— <MathText :text="n.meaning" /></span>
        </li>
      </ul>
    </section>

    <section v-if="item.explanation" class="rounded-xl border-l-4 border-brand-300 bg-brand-50/60 p-4">
      <div class="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-500">На пальцах</div>
      <p class="leading-relaxed text-slate-700"><MathText :text="item.explanation" /></p>
    </section>

    <section v-if="item.examples?.length" class="flex flex-col gap-3">
      <ExampleBlock v-for="ex in item.examples" :key="ex.id" :example="ex" />
    </section>

    <section v-if="item.interpretation" class="rounded-xl bg-sky-50 p-4">
      <div class="mb-2 text-xs font-semibold uppercase text-sky-600">Как читать результат</div>
      <ul class="flex flex-col gap-1 text-sm text-sky-900">
        <li v-if="item.interpretation.good"><strong>Хорошо:</strong> <MathText :text="item.interpretation.good" /></li>
        <li v-if="item.interpretation.bad"><strong>Плохо:</strong> <MathText :text="item.interpretation.bad" /></li>
        <li v-if="item.interpretation.improve"><strong>Улучшить:</strong> <MathText :text="item.interpretation.improve" /></li>
      </ul>
    </section>

    <section v-if="item.metrics?.length">
      <div class="mb-2 text-xs font-semibold uppercase text-slate-400">Метрики</div>
      <div class="flex flex-wrap gap-2">
        <MetricDirectionChip
          v-for="(m, i) in item.metrics"
          :key="i"
          :direction="m.direction"
          :name="m.name"
          :plain="m.plain"
        />
      </div>
    </section>

    <section v-if="item.mnemonic" class="flex items-start gap-3 rounded-xl bg-amber-50 p-4">
      <span class="text-xl">🧠</span>
      <div>
        <div class="text-xs font-semibold uppercase tracking-wide text-amber-600">Мнемоника</div>
        <p class="leading-relaxed text-amber-900"><MathText :text="item.mnemonic" /></p>
      </div>
    </section>
  </article>
</template>
