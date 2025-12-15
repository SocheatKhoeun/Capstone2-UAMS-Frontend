export const useExport = () => {
  /**
   * Export data to Excel format
   * @param {Array} data - Array of objects to export
   * @param {String} filename - Name of the file (without extension)
   */
  const exportToExcel = (data, filename = 'export') => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export')
      }

      // Get headers from first object
      const headers = Object.keys(data[0])
      
      // Create CSV content
      let csvContent = headers.join(',') + '\n'
      
      // Add data rows
      data.forEach(row => {
        const values = headers.map(header => {
          let value = row[header] || ''
          // Escape values containing commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            value = '"' + value.replace(/"/g, '""') + '"'
          }
          return value
        })
        csvContent += values.join(',') + '\n'
      })

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.csv`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return true
    } catch (error) {
      console.error('Export to Excel failed:', error)
      throw error
    }
  }

  /**
   * Export data to PDF format
   * @param {Array} data - Array of objects to export
   * @param {String} filename - Name of the file (without extension)
   */
  const exportToPDF = (data, filename = 'export') => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export')
      }

      // For now, we'll create a simple HTML table and trigger print
      // In production, you'd want to use a library like jsPDF or pdfmake
      
      const headers = Object.keys(data[0])
      
      // Create HTML table
      let htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #4CAF50; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
            h1 { color: #333; }
          </style>
        </head>
        <body>
          <h1>${filename.replace(/_/g, ' ').toUpperCase()}</h1>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${headers.map(h => `<td>${row[h] || ''}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
        </html>
      `

      // Open in new window and trigger print
      const printWindow = window.open('', '_blank')
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      setTimeout(() => {
        printWindow.print()
      }, 250)
      
      return true
    } catch (error) {
      console.error('Export to PDF failed:', error)
      throw error
    }
  }

  /**
   * Export data to JSON format
   * @param {Array} data - Array of objects to export
   * @param {String} filename - Name of the file (without extension)
   */
  const exportToJSON = (data, filename = 'export') => {
    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export')
      }

      const jsonContent = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      
      link.setAttribute('href', url)
      link.setAttribute('download', `${filename}.json`)
      link.style.visibility = 'hidden'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      return true
    } catch (error) {
      console.error('Export to JSON failed:', error)
      throw error
    }
  }

  return {
    exportToExcel,
    exportToPDF,
    exportToJSON
  }
}
