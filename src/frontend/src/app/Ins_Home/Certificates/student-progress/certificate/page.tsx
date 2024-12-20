'use client';
import React from "react";
import "./page.css";

const Page: React.FC = () => {
  const generateCertificate = () => {
    const institute = (document.getElementById("institute") as HTMLInputElement).value;
    const participant = (document.getElementById("participant") as HTMLInputElement).value;
    const grade = (document.getElementById("grade") as HTMLInputElement).value;
    const course = (document.getElementById("course") as HTMLInputElement).value;
    const certificateNumber = Math.floor(Math.random() * 1000000);

    const certificateContent = `
      <h1>Certificate of Achievement</h1>
      <p>This is to certify that</p>
      <h2>${participant}</h2>
      <p>has successfully completed the course</p>
      <h3>${course}</h3>
      <p>at</p>
      <h3>${institute}</h3>
      <p>with a grade of <strong>${grade}</strong></p>
      <p>Given this day, ${new Date().toLocaleDateString()}</p>
      <p>Certificate Number: ${certificateNumber}</p>
      <p>Best wishes for your future endeavors!</p>
    `;

    const printWindow = window.open("", "_blank");
    printWindow?.document.open();
    printWindow?.document.write(`
      <html>
      <head>
        <title>Certificate</title>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 0;
            background-color: transparent;
          }
          #certificate {
            width: 800px;
            margin: 20px auto;
            background-image: url('https://png.pngtree.com/png-vector/20221206/ourmid/pngtree-golden-blue-certificate-border-folio-f4-size-transparent-png-image_6514169.png');
            background-size: cover;
            padding: 100px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            position: relative;
          }
          #certificate h1, h2, h3 {
            text-align: center;
            color: #b80257;
          }
          #certificate p {
            text-align: center;
            color: #233142;
          }
          #certificate strong {
            color: #f95959;
          }
          #seal {
            position: absolute;
            top: 20px;
            right: 20px;
            color: #b80257;
            font-size: 36px;
          }
          #qr-code {
            position: absolute;
            bottom: 20px;
            left: 20px;
          }
        </style>
      </head>
      <body>
        <div id="certificate">${certificateContent}</div>
        <div id="seal">
          <i class="fas fa-seal"></i>
        </div>
      </body>
      </html>
    `);
    printWindow?.document.close();
    printWindow?.print();
  };

  return (
    <body>
      <div id="certificate">
        <h1>Certificate of Achievement</h1>
        <div className="field">
          <label htmlFor="institute">Institute Name:</label>
          <input type="text" id="institute" placeholder="Enter Institute Name" />
        </div>
        <div className="field">
          <label htmlFor="participant">Participant Name:</label>
          <input type="text" id="participant" placeholder="Enter Participant Name" />
        </div>
        <div className="field">
          <label htmlFor="grade">Grade:</label>
          <input type="text" id="grade" placeholder="Enter Grade" />
        </div>
        <div className="field">
          <label htmlFor="course">Course:</label>
          <input type="text" id="course" placeholder="Enter Course Name" />
        </div>
        <button className="btn" onClick={generateCertificate}>
          Generate Certificate
        </button>
      </div>

      <div id="seal">
        <i className="fas fa-seal"></i>
      </div>
    </body>
  );
};

export default Page;
