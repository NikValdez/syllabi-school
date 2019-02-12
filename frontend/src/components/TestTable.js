import jsPDF from 'jspdf'
import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { Col, Row, Table } from 'react-bootstrap'
import { SINGLE_COURSE_QUERY } from './SingleCoursePDF'

const margins = {
  top: 70,
  bottom: 40,
  left: 30,
  width: 550
}

class TestTable extends Component {
  generate = () => {
    const pdf = new jsPDF('p', 'pt', 'a4')
    pdf.setFontSize(18)
    pdf.fromHTML(
      document.getElementById('html-2-pdfwrapper'),
      margins.left, // x coord
      margins.top,
      {
        // y coord
        width: margins.width // max width of content on PDF
      },
      //   function(dispose) {
      //     headerFooterFormatting(pdf, pdf.internal.getNumberOfPages())
      //   },
      margins
    )

    const iframe = document.createElement('iframe')
    iframe.setAttribute(
      'style',
      'position:absolute;right:0; top:0; bottom:0; height:100%; width:650px; padding:20px;'
    )
    document.body.appendChild(iframe)

    iframe.src = pdf.output('datauristring')
  }
  //   headerFooterFormatting = (doc, totalPages) => {
  //     for (var i = totalPages; i >= 1; i--) {
  //       doc.setPage(i)
  //       //header
  //       header(doc)

  //       footer(doc, i, totalPages)
  //       doc.page++
  //     }
  //   }

  //   header = doc => {
  //     doc.setFontSize(30)
  //     doc.setTextColor(40)
  //     doc.setFontStyle('normal')

  //     // if (base64Img) {
  //     //   doc.addImage(base64Img, 'JPEG', margins.left, 10, 40, 40)
  //     // }

  //     doc.text('Report Header Template', margins.left + 50, 40)
  //     doc.setLineCap(2)
  //     doc.line(3, 70, margins.width + 43, 70) // horizontal line
  //   }

  // You could either use a function similar to this or pre convert an image with for example http://dopiaza.org/tools/datauri
  // http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
  // function imgToBase64(url, callback, imgVariable) {

  //     if (!window.FileReader) {
  //         callback(null);
  //         return;
  //     }
  //     var xhr = new XMLHttpRequest();
  //     xhr.responseType = 'blob';
  //     xhr.onload = function() {
  //         var reader = new FileReader();
  //         reader.onloadend = function() {
  // 			imgVariable = reader.result.replace('text/xml', 'image/jpeg');
  //             callback(imgVariable);
  //         };
  //         reader.readAsDataURL(xhr.response);
  //     };
  //     xhr.open('GET', url);
  //     xhr.send();
  // };

  //   footer = (doc, pageNumber, totalPages) => {
  //     var str = 'Page ' + pageNumber + ' of ' + totalPages

  //     doc.setFontSize(10)
  //     doc.text(str, margins.left, doc.internal.pageSize.height - 20)
  //   }

  render() {
    return (
      <Query
        query={SINGLE_COURSE_QUERY}
        variables={{
          id: 'cjrsf0xz70ilj0a373rjmvhwu'
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <p>Error</p>
          if (loading) return <p>Loading...</p>

          const course = data.course

          return (
            <div>
              <button onClick={this.generate}>Generate PDF</button>
              <div id="html-2-pdfwrapper">
                <h1 style={{ fontFamily: 'cursive' }}>
                  Syllabus/Course Information
                </h1>
                <p>
                  This demo uses Html2Canvas.js to render HTML. <br />
                  Instead of using an HTML canvas however, a canvas wrapper
                  using jsPDF is substituted. The <em>context2d</em> provided by
                  the wrapper calls native PDF rendering methods.
                </p>
                <p>
                  A PDF of this page will be inserted into the right margin.
                </p>

                <h2 style={{ color: 'red' }}>Colors</h2>

                <Row>
                  <Col md={6} xs={6}>
                    <Table bordered responsive>
                      <tbody>
                        <tr>
                          <th style={{ background: 'white' }}>Title</th>
                          <td>{course.title}</td>
                        </tr>
                        <tr>
                          <th>Course Code</th>
                          <td>{course.courseCode}</td>
                        </tr>
                        <tr>
                          <th>Credits</th>
                          <td>{course.credits}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                <h2>Text Alignment</h2>

                <p>
                  This demo uses Html2Canvas.js to render HTML. <br />
                  Instead of using an HTML canvas however, a canvas wrapper
                  using jsPDF is substituted. The <em>context2d</em> provided by
                  the wrapper calls native PDF rendering methods.
                </p>
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}

export default TestTable
