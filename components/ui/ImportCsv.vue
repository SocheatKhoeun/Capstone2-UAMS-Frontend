<template>
  <div>
    <v-btn 
      class="modern-btn import-btn" 
      prepend-icon="mdi-download" 
      variant="outlined"
      @click="triggerFileInput"
    >
      Import CSV
      <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
    </v-btn>
    
    <input 
      ref="fileInput"
      type="file"
      accept=".csv"
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- Preview Dialog -->
    <v-dialog v-model="previewDialog" max-width="900" persistent>
      <v-card class="modern-dialog">
        <!-- Dialog Header -->
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon icon="mdi-file-delimited" color="primary" size="24" />
            </div>
            <div class="header-text">
              <h2 class="dialog-title">Preview Import Data</h2>
              <p class="dialog-subtitle">Review {{ previewData.length }} records before importing</p>
            </div>
          </div>
          <v-btn 
            icon="mdi-close" 
            variant="text" 
            size="small" 
            @click="closePreview" 
            class="close-btn" 
          />
        </div>

        <v-divider />

        <!-- Preview Content -->
        <v-card-text class="preview-content">
          <!-- Validation Errors -->
          <v-alert 
            v-if="validationErrors.length > 0" 
            type="warning" 
            variant="tonal"
            class="mb-4"
          >
            <div class="error-title">Found {{ validationErrors.length }} validation errors:</div>
            <ul class="error-list">
              <li v-for="(error, index) in validationErrors.slice(0, 5)" :key="index">
                {{ error }}
              </li>
              <li v-if="validationErrors.length > 5">
                ... and {{ validationErrors.length - 5 }} more errors
              </li>
            </ul>
          </v-alert>

          <!-- Preview Table -->
          <div class="preview-table-wrapper">
            <v-table class="preview-table">
              <thead>
                <tr>
                  <th v-for="col in columns" :key="col.key" class="preview-header">
                    {{ col.header }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="(row, index) in previewData.slice(0, 10)" 
                  :key="index"
                  :class="{ 'error-row': row._hasError }"
                >
                  <td v-for="col in columns" :key="col.key" class="preview-cell">
                    {{ formatPreviewValue(row[col.key], col.format) }}
                  </td>
                </tr>
              </tbody>
            </v-table>
            <div v-if="previewData.length > 10" class="preview-footer">
              Showing 10 of {{ previewData.length }} records
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Dialog Actions -->
        <v-card-actions class="dialog-actions">
          <v-btn 
            variant="outlined" 
            @click="closePreview"
          >
            Cancel
          </v-btn>
          <v-btn 
            color="primary" 
            variant="flat" 
            @click="confirmImport"
            :disabled="validationErrors.length > 0 || importing"
            :loading="importing"
          >
            Import {{ previewData.length }} Records
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  validateRow: {
    type: Function,
    default: null
  },
  transformRow: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['import-start', 'import-complete', 'import-error'])

const fileInput = ref(null)
const previewDialog = ref(false)
const previewData = ref([])
const validationErrors = ref([])
const importing = ref(false)

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (!file) return

  emit('import-start')

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const csv = e.target.result
      parseCSV(csv)
    } catch (error) {
      console.error('CSV parse error:', error)
      emit('import-error', { error })
    }
  }
  reader.readAsText(file)
  
  // Reset file input
  event.target.value = ''
}

const parseCSV = (csv) => {
  const lines = csv.split('\n').filter(line => line.trim())
  if (lines.length < 2) {
    emit('import-error', { error: 'CSV file is empty or invalid' })
    return
  }

  // Parse headers
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
  
  // Parse rows
  const rows = []
  const errors = []

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i])
    const row = {}
    
    // Map CSV columns to data structure
    props.columns.forEach((col, index) => {
      let value = values[index] || ''
      
      // Transform value based on format
      if (col.format === 'number') {
        value = value ? parseInt(value) : null
      } else if (col.format === 'status') {
        value = value.toLowerCase() === 'active' ? 1 : 0
      } else if (col.format === 'boolean') {
        value = value.toLowerCase() === 'yes' || value.toLowerCase() === 'true' ? 1 : 0
      }
      
      row[col.key] = value
    })

    // Apply custom transform if provided
    if (props.transformRow) {
      Object.assign(row, props.transformRow(row))
    }

    // Validate row
    if (props.validateRow) {
      const validation = props.validateRow(row, i + 1)
      if (!validation.valid) {
        errors.push(`Row ${i + 1}: ${validation.error}`)
        row._hasError = true
      }
    }

    rows.push(row)
  }

  previewData.value = rows
  validationErrors.value = errors
  previewDialog.value = true
}

const parseCSVLine = (line) => {
  const values = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  values.push(current.trim())
  return values.map(v => v.replace(/^"|"$/g, ''))
}

const formatPreviewValue = (value, format) => {
  if (value === null || value === undefined || value === '') return '-'
  
  if (format === 'status') {
    return value === 1 ? 'Active' : 'Inactive'
  } else if (format === 'boolean') {
    return value ? 'Yes' : 'No'
  } else if (format === 'date') {
    return new Date(value).toLocaleDateString('en-US')
  }
  
  return value
}

const closePreview = () => {
  previewDialog.value = false
  previewData.value = []
  validationErrors.value = []
}

const confirmImport = async () => {
  importing.value = true
  
  try {
    // Filter out error rows
    const validRows = previewData.value.filter(row => !row._hasError)
    
    // Remove internal properties
    const cleanRows = validRows.map(row => {
      const { _hasError, ...cleanRow } = row
      return cleanRow
    })
    
    emit('import-complete', cleanRows)
    closePreview()
  } catch (error) {
    console.error('Import error:', error)
    emit('import-error', { error })
  } finally {
    importing.value = false
  }
}
</script>

<style scoped>
.modern-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 20px;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.modern-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modern-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
  flex: 1;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.dialog-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 2px 0 0 0;
  line-height: 1.4;
}

.close-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.04);
}

.preview-content {
  padding: 24px !important;
  max-height: 500px;
  overflow-y: auto;
}

.error-title {
  font-weight: 600;
  margin-bottom: 8px;
}

.error-list {
  margin: 0;
  padding-left: 20px;
}

.error-list li {
  margin: 4px 0;
}

.preview-table-wrapper {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.preview-table {
  width: 100%;
}

.preview-header {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
  padding: 12px 16px !important;
  border-bottom: 2px solid #e2e8f0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.preview-cell {
  padding: 12px 16px !important;
  color: #1e293b;
  font-size: 14px;
  border-bottom: 1px solid #f1f5f9;
}

.error-row {
  background-color: #fef2f2 !important;
}

.preview-footer {
  padding: 12px 16px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  text-align: center;
  color: #64748b;
  font-size: 14px;
  font-weight: 500;
}

.dialog-actions {
  padding: 20px 24px !important;
  gap: 12px;
  display: flex;
  justify-content: flex-end;
}

.dialog-actions .v-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 24px;
}
</style>