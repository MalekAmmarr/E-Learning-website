'use client';
import React from "react";
import html2canvas from "html2canvas"; // Library to capture screenshot
import "./page.css";

const Page: React.FC = () => {

  // Function to compress the captured image
  const compressImage = (canvas: HTMLCanvasElement) => {
    return new Promise<string>((resolve) => {
      const compressedCanvas = document.createElement("canvas");
      const context = compressedCanvas.getContext("2d");

      if (!context) {
        throw new Error("Failed to get 2D context");
      }

      const maxWidth = 800; // Adjust the size here
      const maxHeight = 600;

      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        compressedCanvas.width = img.width * ratio;
        compressedCanvas.height = img.height * ratio;
        context.drawImage(img, 0, 0, compressedCanvas.width, compressedCanvas.height);
        
        // Resolve with the base64 string for the compressed image
        resolve(compressedCanvas.toDataURL("image/jpeg", 0.8)); // Compress to 80% quality
      };
      img.src = canvas.toDataURL("image/jpeg"); // Create base64 image
    });
  };

  const generateCertificate = async () => {
    const institute = (document.getElementById("institute") as HTMLInputElement).value;
    const participant = (document.getElementById("participant") as HTMLInputElement).value;
    const grade = (document.getElementById("grade") as HTMLInputElement).value;
    const course = (document.getElementById("course") as HTMLInputElement).value;
    const certificateNumber = Math.floor(Math.random() * 1000000);

    // Certificate content
    const certificateContent = `
      <h1>Certificate of Achievement</h1>
      <p>This is to certify that</p>
      <h2>${participant}</h2>
      <p>has successfully completed the course</p>
      <h3>${course}</h3>
      <p>with prof: </p>
      <h3>${institute}</h3>
      <p>with a grade of <strong>${grade}</strong></p>
      <p>Given this day, ${new Date().toLocaleDateString()}</p>
      <p>Certificate Number: ${certificateNumber}</p>
      <p>Best wishes for your future endeavors!</p>
    `;

    // Create a certificate in a div for rendering
    const certificateDiv = document.createElement("div");
    certificateDiv.id = "generatedCertificate";
    certificateDiv.innerHTML = certificateContent;
    certificateDiv.style.cssText = `
      width: 800px;
      margin: 20px auto;
      background-image: url('/assets/images/certificate-border.jpeg');
      background-size: cover;
      padding: 100px;
      text-align: center;
      font-family: 'Montserrat', sans-serif;
    `;

    // Append it to the body (hidden)
    document.body.appendChild(certificateDiv);

    // Capture the screenshot using html2canvas
    const canvas = await html2canvas(certificateDiv, {
      useCORS: true, // Enable cross-origin resource sharing for the background image
    });

    // Compress the image before sending it
    const compressedImage = await compressImage(canvas);

    // Remove the hidden certificate div after capturing the image
    document.body.removeChild(certificateDiv);

    // Extract base64 string (remove the "data:image/jpeg;base64," part)
    const base64Image = compressedImage.split(',')[1]; // Get the base64 part without the data URI prefix
    console.log("Base64 Image Data:", base64Image);  // Debugging log for base64 data

    // Prepare data for the backend
    const certificateData = {
      name: participant,
      courseTitle: course,
      certificateImage: `data:image/jpeg;base64,${base64Image}`, // Send only the base64 string
    };

    // Send the data to the backend using fetch
    try {
      const response = await fetch("http://localhost:3000/certificate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Sending JSON data
        },
        body: JSON.stringify(certificateData), // Send JSON payload with certificate data
      });

      if (!response.ok) {
        throw new Error("Failed to save certificate.");
      }

      alert("Certificate saved successfully!");
    } catch (error) {
      console.error("Error saving certificate:", error);
      alert("Failed to save certificate.");
    }

    // Provide a download option for the user
    const link = document.createElement("a");
    link.href = compressedImage; // Use the compressed image for download
    link.download = `${participant}_Certificate.jpeg`;
    link.click();
  };

  return (
    <body>
      <div id="certificateForm">
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
    </body>
  );
};

export default Page;
