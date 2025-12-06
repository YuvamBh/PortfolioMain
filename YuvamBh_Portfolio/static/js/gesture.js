
const videoElement = document.getElementById('gesture-video');
const canvasElement = document.getElementById('gesture-canvas');
const canvasCtx = canvasElement.getContext('2d');
const gestureStatus = document.getElementById('gesture-status');

let lastGestureTime = 0;
let resumeOpened = false;
let camera = null;
let hands = null;

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                     {color: '#00FF00', lineWidth: 5});
      drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 2});
      
      if (detectThumbsUp(landmarks)) {
          gestureStatus.innerText = "👍 Thumbs Up Detected!";
          gestureStatus.style.opacity = "1";
          
          if (!resumeOpened) {
              const now = Date.now();
              // Debounce to prevent multiple opens
              if (now - lastGestureTime > 2000) {
                   lastGestureTime = now;
                   resumeOpened = true; 
                   
                   // Use a modal instead of window.open to avoid popup blockers
                   showResumeModal();
                   
                   // Reset flag after a delay
                   setTimeout(() => { resumeOpened = false; }, 5000);
              }
          }
      } else {
          gestureStatus.style.opacity = "0.5";
          gestureStatus.innerText = "Looking for gesture...";
      }
    }
  } else {
      gestureStatus.style.opacity = "0";
  }
  canvasCtx.restore();
}

function showResumeModal() {
    let modal = document.getElementById('resume-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'resume-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.8); z-index: 2000; display: flex;
            justify-content: center; align-items: center; opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            position: relative; width: 80%; height: 90%; background: rgb(19, 14, 14);
            border-radius: 20px; box-shadow: 0 4px 30px rgba(0,0,0,0.8);
            border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column;
        `;
        
        // Close Button
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = "&times;";
        closeBtn.style.cssText = `
            position: absolute; top: -15px; right: -15px; width: 35px; height: 35px;
            background: rgb(30, 30, 30); color: white; border: 1px solid rgba(255,255,255,0.2); 
            border-radius: 50%; font-size: 24px; cursor: pointer; display: flex; 
            align-items: center; justify-content: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            transition: all 0.2s; z-index: 10;
        `;
        closeBtn.onmouseover = () => closeBtn.style.transform = "scale(1.1)";
        closeBtn.onmouseout = () => closeBtn.style.transform = "scale(1)";
        closeBtn.onclick = () => {
            modal.style.opacity = '0';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        };
        
        const iframe = document.createElement('iframe');
        iframe.src = "/static/YuvamBhargav_Resume.pdf";
        iframe.style.cssText = "width: 100%; flex: 1; border: none; border-radius: 20px;";
        
        content.appendChild(closeBtn);
        content.appendChild(iframe);
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Force reflow
        void modal.offsetWidth;
    }
    
    modal.style.display = 'flex';
    // Small delay to allow display:flex to apply before opacity transition
    setTimeout(() => { modal.style.opacity = '1'; }, 10);
}

// Simple Thumbs Up Helper
function detectThumbsUp(landmarks) {
    // Landmark indices
    // 0: WRIST
    // 4: THUMB_TIP
    // 8: INDEX_FINGER_TIP
    // 12: MIDDLE_FINGER_TIP
    // 16: RING_FINGER_TIP
    // 20: PINKY_TIP
    // ... and intermediate joints

    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const thumbMCP = landmarks[2];
    
    const indexTip = landmarks[8];
    const indexMCP = landmarks[5];
    
    const middleTip = landmarks[12];
    const middleMCP = landmarks[9];
    
    const ringTip = landmarks[16];
    const ringMCP = landmarks[13];
    
    const pinkyTip = landmarks[20];
    const pinkyMCP = landmarks[17];

    // Check if fingers are curled (tip is below MCP in y-axis for upright hand, 
    // but users might have different orientations. 
    // Let's assume standard "Stop" hand facing camera).
    // Actually, for "Thumbs Up", the thumb points UP (lower y value) and others are curled.
    
    // Note: MediaPipe Y coordinates: 0 is top, 1 is bottom.
    
    // 1. Thumb should be extended upward (Tip y < IP y)
    const isThumbUp = thumbTip.y < thumbIP.y;
    
    // 2. Other fingers should be curled (Tip y > MCP y) 
    // This assumes hand is upright.
    const isIndexCurled = indexTip.y > indexMCP.y;
    const isMiddleCurled = middleTip.y > middleMCP.y;
    const isRingCurled = ringTip.y > ringMCP.y;
    const isPinkyCurled = pinkyTip.y > pinkyMCP.y;

    return isThumbUp && isIndexCurled && isMiddleCurled && isRingCurled && isPinkyCurled;
}

function startGestureRecognition() {
    document.getElementById('gesture-container').style.display = 'block';
    
    // Check for browser support and secure context
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        let msg = "Error: Camera API not available.";
        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
             msg = `Camera requires a secure connection. Try accessing via <a href="http://localhost:${window.location.port}" style="color: cyan; text-decoration: underline;">localhost</a> instead.`;
        } else {
             msg += " Please use HTTPS or localhost.";
        }
        gestureStatus.innerHTML = msg;
        gestureStatus.style.color = "red";
        return;
    }

    hands = new Hands({locateFile: (file) => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }});

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    camera = new Camera(videoElement, {
      onFrame: async () => {
        await hands.send({image: videoElement});
      },
      width: 320,
      height: 240
    });
    
    camera.start()
    .catch(err => {
        console.error("Camera start error:", err);
        gestureStatus.innerText = "Error starting camera: " + err.message;
        gestureStatus.style.color = "red";
    });
}

function stopGestureRecognition() {
     if (camera && camera.video) {
        // MediaPipe doesn't have a direct 'stop' method easily accessible,
        // but we can stop the tracks on the source stream if accessible,
        // or just hide the UI and pause.
        const stream = videoElement.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        videoElement.srcObject = null;
     }
     
     document.getElementById('gesture-container').style.display = 'none';
     document.getElementById('enable-gesture-btn').style.display = 'block';
}

// UI Event Binding
document.getElementById('enable-gesture-btn').addEventListener('click', () => {
    startGestureRecognition();
    document.getElementById('enable-gesture-btn').style.display = 'none';
});

document.getElementById('close-gesture-btn').addEventListener('click', () => {
    stopGestureRecognition();
});
