<template>
  <v-menu offset-y>
    <template v-slot:activator="{ props }">
      <v-btn 
        class="modern-btn export-btn" 
        prepend-icon="mdi-upload" 
        variant="outlined" 
        v-bind="props"
      >
        Export
        <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
      </v-btn>
    </template>
    <v-list class="modern-menu">
      <v-list-item @click="exportExcel" class="menu-item">
        <template v-slot:prepend>
          <v-icon icon="mdi-file-excel" color="success" />
        </template>
        <v-list-item-title>Export to Excel</v-list-item-title>
      </v-list-item>
      <v-list-item @click="exportPDF" class="menu-item">
        <template v-slot:prepend>
          <v-icon icon="mdi-file-pdf-box" color="error" />
        </template>
        <v-list-item-title>Export to PDF</v-list-item-title>
      </v-list-item>
      <v-list-item @click="exportCSV" class="menu-item">
        <template v-slot:prepend>
          <v-icon icon="mdi-file-delimited" color="info" />
        </template>
        <v-list-item-title>Export to CSV</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  filename: {
    type: String,
    default: 'export'
  },
  columns: {
    type: Array,
    required: true,
    default: () => []
  }
})

const emit = defineEmits(['export-start', 'export-complete', 'export-error'])

// Export to Excel
const exportExcel = () => {
  try {
    emit('export-start', 'excel')
    
    // Prepare data for export
    const exportData = props.data.map(item => {
      const row = {}
      props.columns.forEach(col => {
        row[col.header] = formatValue(item[col.key], col.format)
      })
      return row
    })

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // Set column widths
    const colWidths = props.columns.map(col => ({ wch: col.width || 15 }))
    ws['!cols'] = colWidths

    // Create workbook
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')

    // Save file
    XLSX.writeFile(wb, `${props.filename}.xlsx`)
    
    emit('export-complete', 'excel')
  } catch (error) {
    console.error('Excel export error:', error)
    emit('export-error', { type: 'excel', error })
  }
}

// Export to PDF
const exportPDF = () => {
  try {
    emit('export-start', 'pdf')
    
    const doc = new jsPDF('l', 'mm', 'a4')
    
    // Add title
    doc.setFontSize(16)
    doc.text(props.filename, 14, 15)
    
    // Prepare table data
    const headers = props.columns.map(col => col.header)
    const body = props.data.map(item => 
      props.columns.map(col => formatValue(item[col.key], col.format))
    )

    // Add table
    doc.autoTable({
      head: [headers],
      body: body,
      startY: 25,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 2
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      }
    })

    // Save PDF
    doc.save(`${props.filename}.pdf`)
    
    emit('export-complete', 'pdf')
  } catch (error) {
    console.error('PDF export error:', error)
    emit('export-error', { type: 'pdf', error })
  }
}

// Export to CSV
const exportCSV = () => {
  try {
    emit('export-start', 'csv')
    
    // Prepare CSV content
    const headers = props.columns.map(col => col.header).join(',')
    const rows = props.data.map(item => {
      return props.columns.map(col => {
        const value = formatValue(item[col.key], col.format)
        // Escape commas and quotes in CSV
        return `"${String(value).replace(/"/g, '""')}"`
      }).join(',')
    })

    const csv = [headers, ...rows].join('\n')

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    
    link.setAttribute('href', url)
    link.setAttribute('download', `${props.filename}.csv`)
    link.style.visibility = 'hidden'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    emit('export-complete', 'csv')
  } catch (error) {
    console.error('CSV export error:', error)
    emit('export-error', { type: 'csv', error })
  }
}

// Format value based on column format
const formatValue = (value, format) => {
  if (value === null || value === undefined) return ''
  
  if (format === 'date') {
    return new Date(value).toLocaleDateString('en-US')
  } else if (format === 'datetime') {
    return new Date(value).toLocaleString('en-US')
  } else if (format === 'status') {
    return value === 1 ? 'Active' : 'Inactive'
  } else if (format === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  
  return value
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

.modern-menu {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

.menu-item {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 4px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f8fafc;
}
</style>
