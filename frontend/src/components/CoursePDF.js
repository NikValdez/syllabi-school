import html2canvas from 'html2canvas'
import * as jsPDF from 'jspdf'
import React, { Component } from 'react'
import SingleCoursePDF from './SingleCoursePDF'
import Button from './styles/Button'

export default class CoursePDF extends Component {
  downloadDocument() {
    const input = document.getElementById('divToDownload')
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF()
      pdf.addImage(imgData, 'JPEG', 10, 10, 180, 180)
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
          <SingleCoursePDF id={this.props.id} />
        </div>
      </>
    )
  }
}
