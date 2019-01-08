import React, { Component, PropTypes } from 'react'
import html2canvas from 'html2canvas'
import * as jsPDF from 'jspdf'
import MyCourses from './MyCourses'

export default class SchedulePDF extends Component {
  downloadDocument() {
    const input = document.getElementById('divToDownload')
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'JPEG', 0, 0)
      // pdf.output('dataurlnewwindow');
      pdf.save('download.pdf')
    })
  }

  render() {
    return (
      <>
        <div className="mb5">
          <button onClick={this.downloadDocument}>
            Download Schedule as PDF
          </button>
        </div>
        <div id="divToDownload" className="mt4">
          <MyCourses />
        </div>
      </>
    )
  }
}
