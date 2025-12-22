
const videoElement = document.getElementById('gesture-video');
const canvasElement = document.getElementById('gesture-canvas');
const canvasCtx = canvasElement.getContext('2d');
const gestureStatus = document.getElementById('gesture-status');

let lastGestureTime = 0;
let resumeOpened = false;
let camera = null;
let hands = null;

// Status updates 
// Status updates 
function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    for (const landmarks of results.multiHandLandmarks) {
      const now = Date.now();
      
      // 1. Victory Gesture -> Resume
      if (detectVictory(landmarks)) {
          gestureStatus.innerText = "✌️ Victory! Opening Resume...";
          gestureStatus.style.color = "rgb(190, 138, 95)";
          
          if (!resumeOpened && (now - lastGestureTime > 2000)) {
               lastGestureTime = now;
               resumeOpened = true; 
               showResumeModal();
               setTimeout(() => { resumeOpened = false; }, 5000);
          }
      } 
      // 2. Pointing Up -> AI Chat
      else if (detectPointingUp(landmarks)) {
          gestureStatus.innerText = "☝️ Pointing Up! Opening AI Chat...";
          gestureStatus.style.color = "rgb(100, 200, 255)";

          // Simple debounce for AI chat trigger
          if (now - lastGestureTime > 2000) {
              lastGestureTime = now;
              const queryBox = document.querySelector('.ai-query-box');
              if (queryBox) {
                  queryBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => queryBox.focus(), 500); // Wait for scroll
              }
          }
      }
      // 3. Thumbs Up -> LinkedIn
      else if (detectThumbsUp(landmarks)) {
          gestureStatus.innerText = "👍 Thumbs Up! Connecting on LinkedIn...";
          gestureStatus.style.color = "rgb(0, 119, 181)"; // LinkedIn Blue

          // Stronger debounce for window.open to prevent popup blast
          if (now - lastGestureTime > 3000) {
              lastGestureTime = now;
              window.open('https://www.linkedin.com/in/yuvam-bh/', '_blank');
          }
      }
      else {
          gestureStatus.innerText = "👀 Scanning... (✌️Resume | ☝️AI | 👍LinkedIn)";
          gestureStatus.style.color = "rgba(255, 255, 255, 0.9)";
      }
    }
  } else {
      gestureStatus.innerText = "👋 Show hand... (✌️Resume | ☝️AI | 👍LinkedIn)";
      gestureStatus.style.color = "rgba(255, 255, 255, 0.5)";
  }
}

function showResumeModal() {
    let modal = document.getElementById('resume-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'resume-modal';
        modal.className = 'resume-modal';
        
        const content = document.createElement('div');
        content.className = 'resume-content';

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = "&times;";
        closeBtn.className = 'resume-close-btn';
        
        closeBtn.onclick = () => {
            modal.style.opacity = '0';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        };
        
        const iframe = document.createElement('iframe');
        iframe.src = "/static/YuvamBhargav_Resume.pdf";
        iframe.className = 'resume-iframe';
        
        content.appendChild(closeBtn);
        content.appendChild(iframe);
        modal.appendChild(content);
        document.body.appendChild(modal);

        void modal.offsetWidth;
    }
    
    modal.style.display = 'flex';
    setTimeout(() => { modal.style.opacity = '1'; }, 10);
}

function detectVictory(landmarks) {
    // Index and Middle Extended
    const indexTip = landmarks[8];
    const indexMCP = landmarks[5];
    const isIndexExtended = indexTip.y < indexMCP.y;

    const middleTip = landmarks[12];
    const middleMCP = landmarks[9];
    const isMiddleExtended = middleTip.y < middleMCP.y;

    // Ring and Pinky Curled
    const ringTip = landmarks[16];
    const ringMCP = landmarks[13];
    const isRingCurled = ringTip.y > ringMCP.y;

    const pinkyTip = landmarks[20];
    const pinkyMCP = landmarks[17];
    const isPinkyCurled = pinkyTip.y > pinkyMCP.y;

    return isIndexExtended && isMiddleExtended && isRingCurled && isPinkyCurled;
}

function detectPointingUp(landmarks) {
    // Index Extended
    const indexTip = landmarks[8];
    const indexMCP = landmarks[5];
    const isIndexExtended = indexTip.y < indexMCP.y;

    // Others Curled
    const middleTip = landmarks[12];
    const middleMCP = landmarks[9];
    const isMiddleCurled = middleTip.y > middleMCP.y;

    const ringTip = landmarks[16];
    const ringMCP = landmarks[13];
    const isRingCurled = ringTip.y > ringMCP.y;

    const pinkyTip = landmarks[20];
    const pinkyMCP = landmarks[17];
    const isPinkyCurled = pinkyTip.y > pinkyMCP.y;
    
    return isIndexExtended && isMiddleCurled && isRingCurled && isPinkyCurled;
}

function detectThumbsUp(landmarks) {
    // Thumb Extended Upward
    const thumbTip = landmarks[4];
    const thumbIP = landmarks[3];
    const thumbMCP = landmarks[2];
    
    // Check if thumb is strictly pointing up (Tip highest, decreasing Y)
    // Note: Y coordinates increase downwards
    const thumbIsVertical = (thumbTip.y < thumbIP.y) && (thumbIP.y < thumbMCP.y);
    
    // Check horizontal alignment of thumb (Tip shouldn't drastically deviate from MCP on X-axis)
    // This ensures it's "upright" and not slanted
    const thumbIsUpright = Math.abs(thumbTip.x - thumbMCP.x) < 0.1; // Strict X deviation check

    // Others Curled
    const indexTip = landmarks[8];
    const indexMCP = landmarks[5];
    const isIndexCurled = indexTip.y > indexMCP.y;

    const middleTip = landmarks[12];
    const middleMCP = landmarks[9];
    const isMiddleCurled = middleTip.y > middleMCP.y;

    const ringTip = landmarks[16];
    const ringMCP = landmarks[13];
    const isRingCurled = ringTip.y > ringMCP.y;

    const pinkyTip = landmarks[20];
    const pinkyMCP = landmarks[17];
    const isPinkyCurled = pinkyTip.y > pinkyMCP.y;

    return thumbIsVertical && thumbIsUpright && isIndexCurled && isMiddleCurled && isRingCurled && isPinkyCurled;
}

function startGestureRecognition() {
    document.getElementById('gesture-container').style.display = 'flex';
    
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
