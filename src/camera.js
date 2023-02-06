import React from "react";
import Webcam from "react-webcam";
import jsPDF from "jspdf";

// The dimensions are in millimeters.
const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

// Calculates the best possible position of an image on the A4 paper format,
// so that the maximal area of A4 is used and the image ratio is preserved.
const imageDimensionsOnA4 = (dimensions) => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  // If the image is in landscape, the full width of A4 is used.
  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  // If the image is in portrait and the full height of A4 would skew
  // the image ratio, we scale the image dimensions.
  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  // The full height of A4 can be used without skewing the image ratio.
  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

// Creates a PDF document containing all the uploaded images.
const generatePdfFromImages = (images) => {
    // Default export is A4 paper, portrait, using millimeters for units.
    const doc = new jsPDF();
  
    // We let the images add all pages,
    // therefore the first default page can be removed.
    doc.deletePage(1);
  
    images.forEach((image) => {
      const imageDimensions = imageDimensionsOnA4({
        width: 500,
        height: 500,
      });
  
      doc.addPage();
      doc.addImage(
        image,
        'jpeg',
        // Images are vertically and horizontally centered on the page.
        (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
        (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
        imageDimensions.width,
        imageDimensions.height
      );
    });
  
    // Creates a PDF and opens it in a new browser tab.
    const pdfURL = doc.output("bloburl");
    window.open(pdfURL, "_blank");
  };

export const WebcamCapture = () => {
  const webcamRef = React.useRef(null);
  const [imageSrc, setImageSrc] = React.useState([]);
  const capture = React.useCallback(() => {
    const imageSrcTemp = webcamRef.current.getScreenshot();
    setImageSrc((imgArr) => [...imgArr, imageSrcTemp]);
  }, [webcamRef]);
  return (
    <>
      <Webcam
        audio={false}
        height={720}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={1280}
        videoConstraints={videoConstraints}
      />
      <button onClick={capture}>Capture photo</button>
      <button onClick={() => generatePdfFromImages(imageSrc)}>Convert to PDF</button>
      {imageSrc.map((img, i) => (
        <img src={img} alt={`sample - ${i}`} width={"300px"} height={"300px"} />
      ))}
    </>
  );
};
