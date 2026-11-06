import { computed } from 'vue'
import { DATASET_C15, getColumnValues, parseDatasetRef } from '@/data/dataset'
import { histogramBins, summary } from '@/utils/datasetStats'

export function useDataset(datasetId = 'c15') {
  const meta = computed(() => (datasetId === 'c15' ? DATASET_C15 : null))

  function columnSummary(refOrColumn) {
    const col = typeof refOrColumn === 'string' && refOrColumn.startsWith('c15.')
      ? parseDatasetRef(refOrColumn)?.column
      : refOrColumn
    return summary(getColumnValues(col))
  }

  function columnHistogram(refOrColumn, k = null) {
    const col = typeof refOrColumn === 'string' && refOrColumn.startsWith('c15.')
      ? parseDatasetRef(refOrColumn)?.column
      : refOrColumn
    return histogramBins(getColumnValues(col), k)
  }

  return { meta, getColumnValues, columnSummary, columnHistogram, parseDatasetRef }
}
