const nodemailer = require('nodemailer')

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

exports.makeANiceEmail = text => `
    <div className="email" style="
       border: 1px solid black;
       padding: 20px;
       font-family: sans-serif;
       line-height: 2;
       font-size: 20px; 
       ">
       <h2>Hey There!</h2>
       <p>${text}</p>

       <p>All the best, Syllabi team</p>
        </div>
`
exports.emailAnnouncement = text => `
<!DOCTYPE html>
<html
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <title>Team Syllabi</title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    
  </head>

  <body
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;-ms-text-size-adjust: 100%;"
  >

      <div style="Margin:0px auto;max-width:600px;">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
        >
          <tbody>
            <tr>
              <td
                style="direction: ltr;font-size: 0px;padding: 20px 0;text-align: center;vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
              >

                <div
                  class="mj-column-per-60 outlook-group-fix"
                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                >
                 
                </div>        
                </div>

              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="Margin:0px auto;max-width:600px;">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
        >
          <tbody>
            <tr>
              <td
                style="direction: ltr;font-size: 0px;padding: 0px;text-align: center;vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
              >

                <div
                  class="mj-column-per-100 outlook-group-fix"
                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                    width="100%"
                  >
                    <tr>
                      <td
                        align="center"
                        style="font-size: 0px;padding: 10px 25px;word-break: break-word;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="border-collapse: collapse;border-spacing: 0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                        >
                          <tbody>
                            <tr>
                              <td
                                style="width: 550px;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                              >
                                <a
                                  href="https://recast.ai?ref=newsletter"
                                  target="_blank"
                                >
                                  <img
                                    height="auto"
                                    src='https://res.cloudinary.com/nikcochran/image/upload/v1559576139/iconfinder_set_of_three_books_1741315.png'
                                    style="border: 0;display: block;outline: none;margin: 0 auto;none;height: auto;width: auto;line-height: 100%;-ms-interpolation-mode: bicubic;"
                                    width="350"
                                  />
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="Margin:0px auto;max-width:600px;">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
        >
     
      <div style="Margin:0px auto;max-width:600px;">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
        >
          <tbody>
            <tr>
              <td
                style="direction: ltr;font-size: 0px;padding: 0px;text-align: center;vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
              >
                <div
                  class="mj-column-per-45 outlook-group-fix"
                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                    width="100%"
                  >
                    <tr>
                      <td
                        align="center"
                        style="font-size: 0px;padding: 0px;word-break: break-word;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <div
                          style="font-family:Roboto, Helvetica, sans-serif;font-size:18px;font-weight:500;line-height:24px;text-align:center;color:#616161;"
                        >
                          New Announcement
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="font-size: 0px;padding: 10px 25px;word-break: break-word;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <p
                          style="border-top: solid 2px #616161;font-size: 1;margin: 0px auto;width: 100%;display: block;"
                        ></p>
                      </td>
                    </tr>
                    <tr>
                      <td
                        style="font-size: 0px;padding: 10px 25px;word-break: break-word;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <p
                          style="border-top: solid 2px #616161;font-size: 1;margin: 0px auto;width: 45%;display: block;"
                        ></p>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="Margin:0px auto;max-width:600px;">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
        >
          <tbody>
            <tr>
              <td
                style="direction: ltr;font-size: 0px;padding: 0px;padding-top: 30px;text-align: center;vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
              >
                <div
                  class="mj-column-per-100 outlook-group-fix"
                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                    width="100%"
                  >
                    <tr>
                      <td
                        align="left"
                        style="font-size: 0px;padding: 10px 25px;word-break: break-word;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <div
                          style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:left;color:#616161;"
                        >
                          <p style="display: block;margin: 13px 0;">
                            ${text}
                          </p>                        
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style="Margin:0px auto;max-width:600px;">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
        >
          <tbody>
            <tr>
              <td
                style="direction: ltr;font-size: 0px;padding: 0px;text-align: center;vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
              >
                <div
                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                    width="100%"
                  >
                    <tr>
                      <td
                        align="left"
                        style="font-size: 0px;padding: 10px 25px;padding-right: 0px;padding-left: 25px;word-break: break-word;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          style="border-collapse: collapse;border-spacing: 0px;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                        >
                        
                        </table>
                      </td>
                    </tr>
                  </table>
                </div>

                <div
                  style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;"
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                    width="100%"
                  >
                    <tr>
                      <td
                        align="left"
                        style="font-size: 0px;padding: 0 25px;word-break: break-word;border-collapse: collapse;mso-table-lspace: 0pt;mso-table-rspace: 0pt;"
                      >
                        <div
                          style="font-family:Roboto, Helvetica, sans-serif;font-size:16px;font-weight:300;line-height:24px;text-align:left;color:#616161;"
                        >
                          <p
                            style="color: #BDBDBD;line-height: 9px;display: block;margin: 13px 0;"
                          >
                            Team Syllabi,
                            <a
                              href="https://gosyllabi.com"
                              style="color: #3498DB;"
                            >
                              GoSyllabi.com
                            </a>
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>        
</html>


`

exports.transport = transport
