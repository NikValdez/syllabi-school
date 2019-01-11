import React, { Component, PropTypes } from 'react'
import html2canvas from 'html2canvas'
import * as jsPDF from 'jspdf'
import Schedule from './Schedule'
import Button from './styles/Button'

export default class SchedulePDF extends Component {
  downloadDocument() {
    const input = document.getElementById('divToDownload')
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'JPEG', 10, 10, 180, 150)
      pdf.save('download.pdf')
    })
  }

  render() {
    return (
      <>
        <div className="mb5">
          <Button onClick={this.downloadDocument} style={{ marginTop: '1rem' }}>
            Export as PDF 📄
          </Button>
        </div>
        <div id="divToDownload" className="mt4">
          <Schedule />
        </div>
      </>
    )
  }
}
