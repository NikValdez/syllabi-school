import html2canvas from 'html2canvas'
import * as jsPDF from 'jspdf'
import React, { Component } from 'react'
import Schedule from './Schedule'
import Button from './styles/Button'

export default class SchedulePDF extends Component {
  downloadDocument() {
    const input = document.getElementById('divToDownload')
    html2canvas(input, { scale: '2' }).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      pdf.addImage(imgData, 'PNG', 5, 5, 190, 190)
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
          <h1 style={{ textAlign: 'center' }}>My Schedule</h1>
          <Schedule />
        </div>
      </>
    )
  }
}
