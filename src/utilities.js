import glass from './images/dot1.png';
export function drawBoundaries(predictions, ctx) {
  if (predictions.length > 0) {
    predictions.forEach((prediction) => {
      const bottomRight = prediction.boundingBox.bottomRight;
      const topLeft = prediction.boundingBox.topLeft;
      const faceInViewConfidence = prediction.faceInViewConfidence;

      ctx.beginPath();
      ctx.lineWidth = '4';
      ctx.strokeStyle = faceInViewConfidence < 0.8 ? 'red' : 'green';
      ctx.rect(
        topLeft[0],
        topLeft[1],
        bottomRight[0] - topLeft[0],
        bottomRight[1] - topLeft[1]
      );
      ctx.stroke();
    });
  }
}

export function drawEye(predictions, ctx, lens) {
  console.log('from utilities', lens);
  if (predictions.length < 1) return;
  let leftEyeUpper0, rightEyeUpper0;
  predictions.map((prediction) => {
    leftEyeUpper0 = prediction.annotations.leftEyeUpper0;
    rightEyeUpper0 = prediction.annotations.rightEyeUpper0;
  });
  //   const elem = document.getElementById('lens');
  //   if (elem) {
  //     console.log('elem hai...', elem);
  //     elem.parentNode.removeChild(elem);
  //   }
  const imageEl = document.createElement('img');
  imageEl.src = lens;
  imageEl.id = 'lens';

  ctx.drawImage(imageEl, leftEyeUpper0[4][0], leftEyeUpper0[4][1], 20, 20);
  ctx.drawImage(imageEl, rightEyeUpper0[2][0], rightEyeUpper0[2][1], 20, 20);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
}
