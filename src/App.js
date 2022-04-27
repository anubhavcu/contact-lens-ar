import * as tf from '@tensorflow/tfjs';
import * as facemesh from '@tensorflow-models/facemesh';
import Webcam from 'react-webcam';
import { useCallback, useEffect, useRef, useState } from 'react';
import './App.scss';
import { drawBoundaries, drawEye } from './utilities';
import lenses from './Lenses';

const App = () => {
  let webcamRef = useRef(null);
  let canvasRef = useRef(null);
  const [image, setImage] = useState(null);
  const [currentLens, setCurrentLens] = useState(
    lenses[Object.keys(lenses)[0]]
  );
  let interval = useRef(null);
  let face = useRef(null);

  const detectImage = useCallback(
    async (net) => {
      if (webcamRef.current === null || canvasRef.current === null) return;
      if (
        typeof webcamRef.current !== 'undefined' &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // get video properties
        const video = webcamRef.current.video;

        // make detections

        try {
          face.current = await net.estimateFaces(video);
        } catch (err) {
          console.log('error bencho...', err);
          // throw err;
        } finally {
          // console.log(face);
          // get canvas context for drawing
          // console.log('promise resolved part 2 bencho...');
          const ctx = canvasRef.current.getContext('2d');
          ctx.canvas.width = 640;
          ctx.canvas.height = 480;
          ctx.drawImage(video, 0, 0);
          drawBoundaries(face.current, ctx);
          drawEye(face.current, ctx, currentLens);
        }
      }
    },
    [currentLens]
  );

  const runFaceMesh = useCallback(async () => {
    let net;
    try {
      net = await facemesh.load({
        inputResolution: { width: 640, height: 480 },
        scale: 0.8,
      });
    } catch (err) {
      console.log('err', err);
    } finally {
      // console.log('promises resolved bencho...');
      interval.current = setInterval(() => {
        detectImage(net);
      }, 100);
    }
  }, [detectImage]);
  //

  useEffect(() => {
    runFaceMesh();
  }, [currentLens, image, runFaceMesh]);

  const captureImage = useCallback(() => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
    webcamRef.current = null;
    canvasRef.current = null;
    // clearInterval(interval.current);
    console.log('face coordinates', face.current);
  }, [webcamRef, setImage, face]);

  // runFaceMesh();
  return (
    <div className='App'>
      <div>
        <h2>face landmark detection...</h2>

        {image === null ? (
          <Webcam muted={false} ref={webcamRef} screenshotFormat='image/jpeg' />
        ) : null}
        {image === null ? (
          <canvas ref={canvasRef} className='canvasContainer' />
        ) : (
          <img src={image} alt='bencho' />
        )}
      </div>
      {/* {image !== null && <img src={image} alt='bencho' />} */}
      {/* <button onClick={captureImage}>{buttonText}</button> */}

      {image === null ? (
        <button onClick={captureImage}>Capture image</button>
      ) : (
        <button onClick={() => setImage(null)}>Retake image</button>
      )}
      <div className='lens-container'>
        {Object.keys(lenses).map((item, idx) => (
          <div
            className='lens-image'
            key={idx}
            onClick={() => {
              console.log('current lens ', lenses[item]);
              const elem = document.getElementById('elem');
              if (elem) {
                console.log('elem hai', elem);
                elem.parentNode.removeChild(elem);
              }
              setCurrentLens(lenses[item]);
            }}
          >
            <img
              src={lenses[item]}
              alt='bencho'
              // onClick={setCurrentLens(lenses[item])}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
