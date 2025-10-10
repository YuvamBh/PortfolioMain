// Initialize AOS
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});

// Custom Cursor
const cursorInner = document.querySelector(".cursor-inner");
const cursorOuter = document.querySelector(".cursor-outer");

// Mouse movement
document.addEventListener("mousemove", (e) => {
  cursorInner.style.left = e.clientX + "px";
  cursorInner.style.top = e.clientY + "px";

  setTimeout(() => {
    cursorOuter.style.left = e.clientX + "px";
    cursorOuter.style.top = e.clientY + "px";
  }, 20);
});

// Hover effects for interactive elements
document.querySelectorAll("a, button").forEach((element) => {
  element.addEventListener("mouseenter", () => {
    cursorInner.classList.add("cursor-hover");
    cursorOuter.classList.add("cursor-hover");
  });

  element.addEventListener("mouseleave", () => {
    cursorInner.classList.remove("cursor-hover");
    cursorOuter.classList.remove("cursor-hover");
  });
});

// Handle cursor visibility
document.addEventListener("mouseleave", () => {
  cursorInner.classList.add("cursor-hidden");
  cursorOuter.classList.add("cursor-hidden");
});

document.addEventListener("mouseenter", () => {
  cursorInner.classList.remove("cursor-hidden");
  cursorOuter.classList.remove("cursor-hidden");
});

// Handle cursor visibility when switching tabs
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cursorInner.classList.add("cursor-hidden");
    cursorOuter.classList.add("cursor-hidden");
  } else {
    cursorInner.classList.remove("cursor-hidden");
    cursorOuter.classList.remove("cursor-hidden");
  }
});

function initShatterEffect() {
  const words = document.querySelectorAll(".shatter-word");
  let currentIndex = 0;
  let previousIndex = -1;

  function splitWord(word) {
    return word.textContent
      .split("")
      .map((char) =>
        char === " " ? "<span>&nbsp;</span>" : `<span>${char}</span>`,
      )
      .join("");
  }

  // Initialize: Split all words into characters
  words.forEach((word) => {
    word.innerHTML = splitWord(word);
  });

  function getRandomIndex(max, exclude) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * max);
    } while (newIndex === exclude);
    return newIndex;
  }

  function animateNextWord() {
    // Get random index different from previous
    const nextIndex = getRandomIndex(words.length, currentIndex);
    const currentWord = words[currentIndex];
    const nextWord = words[nextIndex];
    const chars = currentWord.querySelectorAll("span");
    const nextChars = nextWord.querySelectorAll("span");

    // Animate out current word
    chars.forEach((char, i) => {
      setTimeout(() => {
        char.style.transition = "all 0.45s ease";
        char.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg)`;
        char.style.opacity = "0";
      }, i * 30);
    });

    // Show next word
    setTimeout(
      () => {
        currentWord.classList.remove("active");
        nextWord.classList.add("active");

        nextChars.forEach((char, i) => {
          const randomAngle = Math.random() * Math.PI * 2;
          const distance = 50 + Math.random() * 100;
          const x = Math.cos(randomAngle) * distance;
          const y = Math.sin(randomAngle) * distance;

          char.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 720 - 360}deg)`;
          char.style.opacity = "0";

          setTimeout(() => {
            char.style.transition = "all 0.45s ease";
            char.style.transform = "translate(0, 0) rotate(0deg)";
            char.style.opacity = "1";
          }, i * 30);
        });
      },
      chars.length * 30 + 300,
    );

    currentIndex = nextIndex;
  }

  // Show first word
  words[0].classList.add("active");

  // Start animation cycle
  setInterval(animateNextWord, 3700);
}

// Text reveal animation
function revealHeroText() {
  const heroText = document.querySelector(".hero-text");
  const text = heroText.textContent;
  heroText.textContent = "";

  text.split("").forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.opacity = "0";
    span.style.transform = "translateY(20px)";
    span.style.transition = `all 0.5s ease ${i * 0.04}s`;
    heroText.appendChild(span);
  });

  setTimeout(() => {
    heroText.querySelectorAll("span").forEach((span) => {
      span.style.opacity = "1";
      span.style.transform = "translateY(0)";
    });
  }, 100);
}

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

const menuButton = document.querySelector(".menu-button");
const closeButton = document.querySelector(".close-button");
const menuOverlay = document.querySelector(".menu-overlay");
const body = document.body;

// Open menu
menuButton.addEventListener("click", () => {
  menuOverlay.classList.add("active");
  body.classList.add("menu-active");
  body.style.overflow = "hidden";
});

// Close menu
closeButton.addEventListener("click", () => {
  menuOverlay.classList.remove("active");
  body.classList.remove("menu-active");
  body.style.overflow = "";
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    body.classList.contains("menu-active") &&
    !menuOverlay.contains(e.target) &&
    !menuButton.contains(e.target)
  ) {
    menuOverlay.classList.remove("active");
    body.classList.remove("menu-active");
    body.style.overflow = "";
  }
});

// Close menu when clicking menu links
document.querySelectorAll(".menu-links a").forEach((link) => {
  link.addEventListener("click", () => {
    menuOverlay.classList.remove("active");
    body.classList.remove("menu-active");
    body.style.overflow = "";
  });
});

function initTextReveal() {
  const textLines = document.querySelectorAll(".text-line");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
      rootMargin: "-50px",
    },
  );

  textLines.forEach((line) => {
    observer.observe(line);
  });
}

// Navigation background change on scroll
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  nav.style.background = window.scrollY > 50 ? "#000000" : "transparent";
});

// Initialize animations after DOM content loads
document.addEventListener("DOMContentLoaded", () => {
  initShatterEffect();
  revealHeroText();
  initTextReveal();
  initMenuHighlight();
  initializeCounters();
  document.getElementById("current-year").textContent =
    new Date().getFullYear();
});

function initMenuHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const menuLinks = document.querySelectorAll(".menu-links a");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;

          // Remove active class from all links
          menuLinks.forEach((link) => {
            link.classList.remove("active");

            // Add active class to current section link
            if (link.getAttribute("href") === `#${currentId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of section is visible
    },
  );

  sections.forEach((section) => observer.observe(section));
}

/* AI Chat Integration */
document.addEventListener("DOMContentLoaded", () => {
  const queryBox = document.querySelector(".ai-query-box");
  const sendButton = document.querySelector(".send-button");
  const overlay = document.querySelector(".site-overlay");
  const chatDisplay = document.querySelector(".chat-display");
  const messagesContainer = document.querySelector(".messages-container");
  let chatHistory = [];
  let isUserScrolling = false;
  let scrollTimeout;
  let hasShownWelcome = false;

  // iOS scroll fix variables
  let originalScrollY = 0;
  let isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  let lastTouchY = 0;
  let touchStarted = false;

  // Force layout recalculation to ensure proper rendering
  const forceReflow = (element) => {
    // Reading offsetHeight triggers a reflow
    void element.offsetHeight;
  };

  // Fix for preventing scroll jumps on iOS when clicking/touching
  document.addEventListener(
    "touchstart",
    function (e) {
      // Store touch position and scroll position
      lastTouchY = e.touches[0].clientY;
      touchStarted = true;
      originalScrollY = window.scrollY;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchend",
    function (e) {
      touchStarted = false;

      // Prevent scroll jumps by checking if we jumped to top after touch
      setTimeout(() => {
        if (window.scrollY < 10 && originalScrollY > 50) {
          // Restore previous scroll position if we detect a jump to top
          window.scrollTo(0, originalScrollY);
        }
      }, 50);
    },
    { passive: true },
  );

  // Fix for iOS scroll position maintenance
  if (isIOS) {
    // Add a throttled scroll handler to maintain position
    let ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking && !touchStarted) {
          window.requestAnimationFrame(function () {
            // Only save position when not actively touching
            if (!touchStarted) {
              originalScrollY = window.scrollY;
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true },
    );
  }

  // Modified preventScrolling to only operate on overlay
  const preventScrolling = (e) => {
    if (
      overlay &&
      overlay.classList.contains("active") &&
      chatDisplay &&
      !chatDisplay.contains(e.target) &&
      queryBox &&
      !queryBox.contains(e.target) &&
      sendButton &&
      !sendButton.contains(e.target)
    ) {
      e.preventDefault();
    }
  };

  // Add event listeners to prevent scrolling
  document.addEventListener("wheel", preventScrolling, { passive: false });
  document.addEventListener("touchmove", preventScrolling, { passive: false });
  document.addEventListener(
    "keydown",
    (e) => {
      // Prevent page scroll via keyboard when chat is open
      if (
        overlay.classList.contains("active") &&
        (e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "PageDown" ||
          e.key === "PageUp" ||
          e.key === "Home" ||
          e.key === "End" ||
          e.key === " ") &&
        !chatDisplay.contains(e.target) &&
        !queryBox.contains(e.target)
      ) {
        e.preventDefault();
      }

      // Close chat when Escape key is pressed
      if (e.key === "Escape" && overlay.classList.contains("active")) {
        resetChatState();
      }
    },
    { passive: false },
  );

  const maintainMessageLimit = () => {
    const messages = messagesContainer.querySelectorAll(".message");
    if (messages.length > 4) {
      for (let i = 0; i < messages.length - 4; i++) {
        messages[i].remove();
      }
    }
  };

  const addThinkingAnimation = () => {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message message-ai thinking";

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";

    messageContent.innerHTML = `
                <div class="thinking-container">
                    <div class="gradient-flow">
                        <div class="flow-line"></div>
                    </div>
                </div>
            `;

    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);

    // Force a reflow to ensure animation works
    forceReflow(messageDiv);

    return messageDiv;
  };

  const addMessage = (text, sender, animate = true) => {
    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `message message-${sender}`;

    if (animate) {
      messageDiv.classList.add("fade-in");
    }

    const messageContent = document.createElement("div");
    messageContent.className = "message-content";
    messageContent.textContent = text;

    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);

    maintainMessageLimit();

    // Force a reflow before scrolling to ensure the message is rendered
    forceReflow(messagesContainer);

    // Make sure chatDisplay is visible before scrolling
    if (!chatDisplay.classList.contains("active")) {
      chatDisplay.classList.add("active");
      // Force another reflow after making visible
      forceReflow(chatDisplay);
    }

    // Apply animation if needed
    if (animate) {
      setTimeout(() => {
        messageDiv.classList.add("visible");
        // Scroll to the latest message if user isn't manually scrolling
        if (!isUserScrolling) {
          chatDisplay.scrollTop = chatDisplay.scrollHeight;
        }
      }, 10);
    } else {
      // Scroll to the latest message if user isn't manually scrolling
      if (!isUserScrolling) {
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
      }
    }

    return messageDiv;
  };

  // Track when user is manually scrolling within chat
  chatDisplay.addEventListener("scroll", () => {
    clearTimeout(scrollTimeout);
    isUserScrolling = true;

    // The scrollDiff determines if we're close to the bottom
    const scrollDiff =
      chatDisplay.scrollHeight -
      chatDisplay.scrollTop -
      chatDisplay.clientHeight;

    // If we're close to the bottom (within 50px), consider it "at bottom"
    if (scrollDiff < 50) {
      isUserScrolling = false;
    } else {
      // Reset the flag after a brief pause in scrolling
      scrollTimeout = setTimeout(() => {
        // Only automatically resume scrolling if we're at the bottom
        const newScrollDiff =
          chatDisplay.scrollHeight -
          chatDisplay.scrollTop -
          chatDisplay.clientHeight;
        if (newScrollDiff < 50) {
          isUserScrolling = false;
        }
      }, 1000); // Wait 1 second after scrolling stops
    }
  });

  const updateInputState = () => {
    if (queryBox.value.trim()) {
      queryBox.classList.add("has-content");
    } else {
      queryBox.classList.remove("has-content");
    }
  };

  const resetChatState = () => {
    queryBox.value = "";
    queryBox.classList.remove("has-content");
    overlay.classList.remove("active");
    chatDisplay.classList.remove("active");
    queryBox.style.transform = "";

    // Restore body position for iOS
    if (isIOS) {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      window.scrollTo(0, originalScrollY);
    }

    // Give a slight delay to allow for CSS transitions
    setTimeout(() => {
      messagesContainer.innerHTML = "";
    }, 300);

    queryBox.blur();
  };

  // Create a typing effect for AI responses
  const typeText = (element, text, speed = 25) => {
    return new Promise((resolve) => {
      let i = 0;
      element.textContent = "";
      element.classList.add("typing-effect");

      function typeNextChar() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          setTimeout(typeNextChar, speed);
        } else {
          element.classList.remove("typing-effect");
          resolve();
        }
      }

      typeNextChar();
    });
  };

  // Turn URLs/emails into <a> links and replace [[GET_RESUME]] with a button
// Turn URLs/emails into <a> links and replace [[GET_RESUME[:url]]] with a button or link
function enhanceMessage(element) {
  const text = element.textContent;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  const tokenRegex = /\[\[GET_RESUME(?::([^\]]+))?\]\]/;

  // 1) Linkify URLs & emails
  let html = text
    .replace(urlRegex, (u) => `<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`)
    .replace(emailRegex, (m) => `<a href="mailto:${m}">${m}</a>`);

  // 2) Render the resume button (download link if URL provided)
  if (tokenRegex.test(html)) {
    html = html.replace(tokenRegex, (_, rawUrl) => {
      const url = (rawUrl || "").trim();
      if (url) {
        // Use an <a> so it works everywhere and triggers download/open
        return `<a class="resume-btn" href="${url}" target="_blank" rel="noopener noreferrer">Get Resume</a>`;
      }
      // Fallback: open email compose if no URL was passed
      const match = text.match(emailRegex);
      const email = match ? match[0] : "hi@yuvambhargav.com";
      return `<button class="resume-btn" data-email="${email}">Get Resume</button>`;
    });
  }

  element.innerHTML = html;
}

// If a fallback button is used (without URL), open mailto compose
document.addEventListener("click", (e) => {
  const btn = e.target.closest(".resume-btn");
  if (!btn || btn.tagName.toLowerCase() === "a") return; // links don't need JS
  const email = btn.dataset.email || "hi@yuvambhargav.com";
  const subject = encodeURIComponent("Resume request");
  const body = encodeURIComponent("Hi Yuvam, please share your resume. Thanks!");
  window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
});



  // Improved message sending with enhanced animations
  const sendMessage = async () => {
    const question = queryBox.value.trim();
    if (question) {
      // Clear input field first for better UX
      queryBox.value = "";
      updateInputState();

      // Immediately add user message to chat with animation
      addMessage(question, "user", true);

      // Ensure chat display is visible immediately
      chatDisplay.classList.add("active");
      forceReflow(chatDisplay);

      // Add "thinking" animation from AI
      const thinkingMessage = addThinkingAnimation();

      try {
        // Send message to backend
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question,
            messages: chatHistory,
          }),
        });

        const data = await response.json();

        // Smoothly fade out the thinking animation
        thinkingMessage.style.transition = "opacity 0.3s ease";
        thinkingMessage.style.opacity = "0";

        // Remove the thinking indicator after fade and add response
        setTimeout(async () => {
          thinkingMessage.remove();

          if (data.message) {
            // Create AI response message
            const aiMessage = document.createElement("div");
            aiMessage.className = "message message-ai fade-in";

            const messageContent = document.createElement("div");
            messageContent.className = "message-content";

            aiMessage.appendChild(messageContent);
            messagesContainer.appendChild(aiMessage);

            // Force reflow and make visible
            forceReflow(aiMessage);
            aiMessage.classList.add("visible");

            // Reset user scrolling to allow automatic scroll for new message
            isUserScrolling = false;
            chatDisplay.scrollTop = chatDisplay.scrollHeight;

            // Type the text with animation effect
            await typeText(messageContent, data.message, 10);
            enhanceMessage(messageContent)

            // Update chat history for context in future queries
            chatHistory.push({ role: "user", content: question });
            chatHistory.push({ role: "assistant", content: data.message });

            // Limit history to last 10 messages
            if (chatHistory.length > 10) {
              chatHistory = chatHistory.slice(chatHistory.length - 10);
            }
          } else {z
            throw new Error("Invalid response");
          }
        }, 300);
      } catch (error) {
        console.error("Error:", error);
        thinkingMessage.remove();
        addMessage(
          "Unable to process your request. Please try again later.",
          "ai",
        );
      }
    }
  };

  // Show welcome message on first focus with animation
  queryBox.addEventListener("focus", () => {
    // iOS scroll fix
    if (isIOS) {
      originalScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${originalScrollY}px`;
    }

    overlay.classList.add("active");
    queryBox.style.transform = "translateY(-10px)";

    // Only show welcome message the first time
    if (!hasShownWelcome && messagesContainer.children.length === 0) {
      hasShownWelcome = true;
      setTimeout(async () => {
        chatDisplay.classList.add("active");
        forceReflow(chatDisplay);

        // Create welcome message with animation
        const welcomeMsg = document.createElement("div");
        welcomeMsg.className = "message message-ai fade-in";

        const messageContent = document.createElement("div");
        messageContent.className = "message-content";

        welcomeMsg.appendChild(messageContent);
        messagesContainer.appendChild(welcomeMsg);

        // Force reflow and trigger animation
        forceReflow(welcomeMsg);
        welcomeMsg.classList.add("visible");

        // Type the welcome message
        await typeText(
          messageContent,
          "Hello! I'm Yuvam. How can I help you today?",
          20,
        );
      }, 200);
    } else if (messagesContainer.children.length > 0) {
      chatDisplay.classList.add("active");
      forceReflow(chatDisplay);
    }
  });

  sendButton.addEventListener("click", (e) => {
    e.stopPropagation();
    sendMessage();
  });

  queryBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  queryBox.addEventListener("input", updateInputState);

  document.addEventListener("click", (e) => {
    const isClickInsideInput = queryBox.contains(e.target);
    const isClickOnSendButton = sendButton.contains(e.target);
    const isClickInsideChat = chatDisplay.contains(e.target);
    if (!isClickInsideInput && !isClickOnSendButton && !isClickInsideChat) {
      resetChatState();
    }
  });

  chatDisplay.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  const connectSection = document.querySelector("#connect");
  const aiQueryContainer = document.querySelector(".ai-query-container");
  if (connectSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aiQueryContainer.style.opacity = "0";
            aiQueryContainer.style.pointerEvents = "none";
            chatDisplay.classList.remove("active");
            overlay.classList.remove("active");
            resetChatState();
          } else {
            aiQueryContainer.style.opacity = "1";
            aiQueryContainer.style.pointerEvents = "auto";
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(connectSection);
  }
});

// Project Section with Glide.js - Single Project Display with Infinite Loop

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Glide.js carousel
  const projectsGlide = new Glide(".projects-glide", {
    type: "carousel",
    startAt: 0,
    perView: 1,
    gap: 0,
    animationDuration: 600,
    animationTimingFunc: "cubic-bezier(0.4, 0, 0.2, 1)",
    rewind: true, // Enable rewinding to create loop effect
    autoplay: false, // Set to a number in milliseconds to enable autoplay (e.g., 5000 for 5 seconds)
  });

  // Mount Glide
  projectsGlide.mount();

  // Fix for mobile scroll issue
  const arrowButtons = document.querySelectorAll(".glide__arrow");

  arrowButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Prevent default behavior
      e.preventDefault();
      // Stop event propagation
      e.stopPropagation();
      // Return false to prevent additional handling
      return false;
    });
  });

  // Custom cursor interaction for project cards (if you're using custom cursor)
  const projectCards = document.querySelectorAll(".project-card");
  const projectLinks = document.querySelectorAll(".project-link");
  const navigationArrows = document.querySelectorAll(".glide__arrow");

  // Only apply if cursor outer/inner elements exist (from your existing cursor code)
  const cursorOuter = document.querySelector(".cursor-outer");
  const cursorInner = document.querySelector(".cursor-inner");

  if (cursorOuter && cursorInner) {
    // For project cards
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        cursorOuter.classList.add("cursor-hover");
        cursorInner.classList.add("cursor-hover");
      });

      card.addEventListener("mouseleave", () => {
        cursorOuter.classList.remove("cursor-hover");
        cursorInner.classList.remove("cursor-hover");
      });
    });

    // For project links
    projectLinks.forEach((link) => {
      link.addEventListener("mouseenter", () => {
        cursorOuter.classList.add("cursor-hover");
        cursorInner.classList.add("cursor-hover");
      });

      link.addEventListener("mouseleave", () => {
        cursorOuter.classList.remove("cursor-hover");
        cursorInner.classList.remove("cursor-hover");
      });
    });

    // For navigation arrows
    navigationArrows.forEach((arrow) => {
      arrow.addEventListener("mouseenter", () => {
        cursorOuter.classList.add("cursor-click");
        cursorInner.classList.add("cursor-click");
      });

      arrow.addEventListener("mouseleave", () => {
        cursorOuter.classList.remove("cursor-click");
        cursorInner.classList.remove("cursor-click");
      });
    });
  }

  // Add animation when slides change
  projectsGlide.on("run.before", function () {
    document
      .querySelectorAll(".glide__slide--active .project-card")
      .forEach((card) => {
        card.style.animation = "fadeOut 0.3s ease-out forwards";
      });
  });

  projectsGlide.on("run.after", function () {
    setTimeout(() => {
      document
        .querySelectorAll(".glide__slide--active .project-card")
        .forEach((card) => {
          card.style.animation = "fadeIn 0.5s ease-out forwards";
        });
    }, 50);
  });
});

//Experiences
document.addEventListener('DOMContentLoaded', function() {
    const experienceCards = document.querySelectorAll('.experience-card');
    const upButton = document.querySelector('.up-btn');
    const downButton = document.querySelector('.down-btn');
    const dots = document.querySelectorAll('.experience-nav-dots .dot');
    
    if (!experienceCards.length) return;
    
    let currentIndex = 0;
    const totalCards = experienceCards.length;
    
    // Initial state
    updateNavigation();
    
    // Update navigation state
    function updateNavigation() {
      // Update active card
      experienceCards.forEach((card, index) => {
        if (index === currentIndex) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
      
      // Update dots
      dots.forEach((dot, index) => {
        if (index === currentIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
      
      // Update button states
      upButton.disabled = currentIndex === 0;
      upButton.style.opacity = currentIndex === 0 ? '0.5' : '1';
      
      downButton.disabled = currentIndex === totalCards - 1;
      downButton.style.opacity = currentIndex === totalCards - 1 ? '0.5' : '1';
    }
    
    // Navigate to previous card
    function navigateUp() {
      if (currentIndex > 0) {
        currentIndex--;
        updateNavigation();
      }
    }
    
    // Navigate to next card
    function navigateDown() {
      if (currentIndex < totalCards - 1) {
        currentIndex++;
        updateNavigation();
      }
    }
    
    // Button click events
    upButton.addEventListener('click', navigateUp);
    downButton.addEventListener('click', navigateDown);
    
    // Dot navigation
    dots.forEach(dot => {
      dot.addEventListener('click', function() {
        currentIndex = parseInt(this.getAttribute('data-index'));
        updateNavigation();
      });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
      // Only respond to keys when experience section is in viewport
      const section = document.querySelector('.experience-section');
      const rect = section.getBoundingClientRect();
      const isInView = (
        rect.top <= window.innerHeight / 2 &&
        rect.bottom >= window.innerHeight / 2
      );
      
      if (isInView) {
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
          e.preventDefault();
          navigateUp();
        } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
          e.preventDefault();
          navigateDown();
        }
      }
    });
  });  

function openCalendly() {
  // Replace this URL with your actual Calendly link
  const calendlyURL = "https://calendly.com/ybharga2-asu/30min";
  window.open(calendlyURL, "_blank");
}

// Add this to your script.js
function lockBodyScroll() {
  if (isIOS) {
    originalScrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${originalScrollY}px`;
  } else {
    document.body.style.overflow = "hidden";
  }
}

function unlockBodyScroll() {
  if (isIOS) {
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.top = "";
    window.scrollTo(0, originalScrollY);
  } else {
    document.body.style.overflow = "";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Ensure these variables are defined
  let overlay = document.querySelector(".overlay");
  let chatDisplay = document.querySelector(".chat-display");
  let queryBox = document.querySelector(".query-box");
  let sendButton = document.querySelector(".send-button");

  // Get all sections for scroll optimization
  const allSections = document.querySelectorAll("section");

  // Remove any scroll interruption
  let isScrolling = false;
  let scrollTimeout;

  // Enhanced smooth scroll behavior
  function enableSmoothScroll() {
    // Apply smooth scrolling to the entire document
    document.documentElement.style.scrollBehavior = "smooth";

    // Remove any scroll snap that might be causing the stopping
    document.documentElement.style.scrollSnapType = "none";
    allSections.forEach((section) => {
      section.style.scrollSnapAlign = "none";
    });

    // Optimize scroll performance
    allSections.forEach((section) => {
      section.style.willChange = "transform";
      section.style.transform = "translateZ(0)";
    });
  }

  // Call this immediately and on orientation change
  enableSmoothScroll();
  window.addEventListener("orientationchange", enableSmoothScroll);

  // Enhanced scroll detection
  window.addEventListener(
    "scroll",
    function () {
      if (!isScrolling) {
        document.body.classList.add("is-scrolling");
        isScrolling = true;
      }

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(function () {
        document.body.classList.remove("is-scrolling");
        isScrolling = false;
      }, 100);
    },
    { passive: true },
  );

  // Fix for iOS touch events
  let touchStartY = 0;
  let touchEndY = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  document.addEventListener(
    "touchstart",
    function (e) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      // Don't interfere with natural scrolling
      touchEndY = e.touches[0].clientY;
      touchEndX = e.touches[0].clientX;

      // Only handle horizontal scrolling ourselves
      const isHorizontalScroll =
        Math.abs(touchEndX - touchStartX) > Math.abs(touchEndY - touchStartY);

      if (
        isHorizontalScroll &&
        overlay &&
        !overlay.classList.contains("active")
      ) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // Fix any scroll anchors that might interrupt scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      // Get the target element
      const targetId = this.getAttribute("href");
      if (targetId === "#") {
        e.preventDefault();
        return;
      }

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();

        // Calculate offset to account for fixed header if needed
        const headerHeight = document.querySelector("header")
          ? document.querySelector("header").offsetHeight
          : 0;

        const offsetTop =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;

        // Smooth scroll to the element
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Check and fix any interrupted scrolling
  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    function () {
      const st = window.pageYOffset || document.documentElement.scrollTop;

      // If scrolling stops unexpectedly (not at top or bottom)
      if (Math.abs(st - lastScrollTop) > 10) {
        // We're actively scrolling, do nothing
      } else if (
        st > 100 &&
        st < document.body.scrollHeight - window.innerHeight - 100
      ) {
        // We might have stopped in the middle - check if we need to continue
        // This timeout allows for natural pauses in scrolling
        setTimeout(() => {
          const newSt =
            window.pageYOffset || document.documentElement.scrollTop;
          if (Math.abs(newSt - st) < 5) {
            // Scroll has stopped - let's optimize rendering
            allSections.forEach((section) => {
              const rect = section.getBoundingClientRect();

              // If this section is in view or near view
              if (
                rect.top < window.innerHeight * 1.5 &&
                rect.bottom > -window.innerHeight * 0.5
              ) {
                section.style.willChange = "transform";
              } else {
                section.style.willChange = "auto";
              }
            });
          }
        }, 200);
      }

      lastScrollTop = st <= 0 ? 0 : st;
    },
    { passive: true },
  );

  // Performance optimization for scrolling
  function optimizeForScroll() {
    document.body.classList.add("optimize-scroll");
    setTimeout(() => {
      document.body.classList.remove("optimize-scroll");
    }, 500);
  }

  // Optimize when scrolling starts
  let scrollStartTimeout;
  window.addEventListener("scrollstart", optimizeForScroll, { passive: true });
  window.addEventListener(
    "scroll",
    function () {
      clearTimeout(scrollStartTimeout);
      scrollStartTimeout = setTimeout(optimizeForScroll, 100);
    },
    { passive: true },
  );
});

// Simple, lightweight carousel implementation
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.carousel');
  const dots = document.querySelectorAll('.nav-dot');
  let autoplayTimer;
  
  // Initially add the animation class
  carousel.classList.add('animated');
  
  // Function to update the active dot
  function updateActiveDot(index) {
    document.querySelector('.nav-dot.active').classList.remove('active');
    dots[index].classList.add('active');
  }
  
  // Function to move to a specific slide
  function moveToSlide(index) {
    // Remove animation
    carousel.classList.remove('animated');
    
    // Move to the slide
    carousel.style.transform = `translateX(-${index * 25}%)`;
    
    // Update dots
    updateActiveDot(index);
    
    // Clear any existing timer
    clearTimeout(autoplayTimer);
    
    // Set timer to restart animation
    autoplayTimer = setTimeout(() => {
      // Reset transform to first position to sync with animation
      carousel.style.transform = 'translateX(0)';
      
      // Wait for transition to complete before adding animation
      setTimeout(() => {
        carousel.classList.add('animated');
        updateActiveDot(0); // Reset active dot to first
      }, 500);
    }, 10000); // Restart animation after 10 seconds
  }
  
  // Set up click handlers for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      moveToSlide(index);
    });
  });
  
  // Handle auto-rotation with dot syncing
  function syncDotsWithAnimation() {
    if (!carousel.classList.contains('animated')) return;
    
    // Compute current slide from transform
    const transformValue = window.getComputedStyle(carousel).getPropertyValue('transform');
    if (transformValue && transformValue !== 'none') {
      const matrix = new DOMMatrix(transformValue);
      const translateX = matrix.m41;
      const slideWidth = carousel.offsetWidth / 4;
      const currentIndex = Math.abs(Math.round(translateX / slideWidth));
      
      // Update active dot
      updateActiveDot(currentIndex % 4);
    }
    
    requestAnimationFrame(syncDotsWithAnimation);
  }
  
  // Start syncing dots with animation
  syncDotsWithAnimation();
});

// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
  // Initialize project cards animation
  const projectCards = document.querySelectorAll('.project-card');
  
  const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });

  projectCards.forEach(card => {
    projectObserver.observe(card);
  });

  // Add hover effect for tech stack items
  document.querySelectorAll('.tech-stack span').forEach(tech => {
    tech.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.1)';
    });

    tech.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });

  // Add click handlers for project links
  document.querySelectorAll('.project-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      // Add your link handling logic here
      
      // Example animation for click feedback
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1)';
      }, 100);
    });
  });
});

// Optional: Add mouse parallax effect
document.addEventListener('mousemove', function(e) {
  const projects = document.querySelectorAll('.project-card');
  const mouseX = e.clientX;
  const mouseY = e.clientY;

  projects.forEach(project => {
    const rect = project.getBoundingClientRect();
    const projectX = rect.left + rect.width / 2;
    const projectY = rect.top + rect.height / 2;

    const deltaX = (mouseX - projectX) / 30;
    const deltaY = (mouseY - projectY) / 30;

    project.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  });
});



// Add this to your existing JavaScript
document.addEventListener('DOMContentLoaded', function() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      // Add active class to clicked button and corresponding content
      btn.classList.add('active');
      const tabId = btn.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
});


document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });

  // Observe all experience cards
  document.querySelectorAll('.experience-card').forEach(card => {
    observer.observe(card);
  });

  // Optional: Add hover effect for achievement items
  document.querySelectorAll('.achievement-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('.achievement-icon').style.transform = 'scale(1.2)';
    });

    item.addEventListener('mouseleave', function() {
      this.querySelector('.achievement-icon').style.transform = 'scale(1)';
    });
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateX(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px'
  });

  // Observe all experience cards
  document.querySelectorAll('.experience-card').forEach(card => {
    observer.observe(card);
  });

  // Optional: Add hover effect for achievement items
  document.querySelectorAll('.achievement-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.querySelector('.achievement-icon').style.transform = 'scale(1.2)';
    });

    item.addEventListener('mouseleave', function() {
      this.querySelector('.achievement-icon').style.transform = 'scale(1)';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const slides = document.querySelectorAll('.event-slide');
  const dots = document.querySelectorAll('.page-dot');
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  
  let currentSlide = 0;
  const totalSlides = slides.length;

  // Initialize
  function showSlide(index) {
      // Hide all slides
      slides.forEach(slide => {
          slide.style.opacity = '0';
          slide.style.display = 'none';
      });

      // Show current slide with fade-in
      slides[index].style.display = 'grid';
      setTimeout(() => {
          slides[index].style.opacity = '1';
      }, 50);

      // Update dots
      dots.forEach(dot => dot.classList.remove('active'));
      dots[index].classList.add('active');

      // Update buttons
      prevBtn.style.opacity = index === 0 ? '0.5' : '1';
      nextBtn.style.opacity = index === totalSlides - 1 ? '0.5' : '1';
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === totalSlides - 1;
  }

  // Event Listeners
  prevBtn.addEventListener('click', () => {
      if (currentSlide > 0) {
          currentSlide--;
          showSlide(currentSlide);
      }
  });

  nextBtn.addEventListener('click', () => {
      if (currentSlide < totalSlides - 1) {
          currentSlide++;
          showSlide(currentSlide);
      }
  });

  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          currentSlide = index;
          showSlide(currentSlide);
      });
  });

  // Add these styles dynamically
  slides.forEach(slide => {
      slide.style.transition = 'opacity 0.5s ease-in-out';
      slide.style.opacity = '0';
  });

  // Show first slide
  showSlide(0);
});

// Add this to your JavaScript file
document.addEventListener('DOMContentLoaded', () => {
  const eventsWrapper = document.querySelector('.events-wrapper');
  const events = document.querySelectorAll('.event-card');
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  const dots = document.querySelectorAll('.page-dot');
  
  let currentIndex = 0;

  // Update navigation buttons state
  const updateNavButtons = () => {
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === events.length - 1;
  };

  // Update active state
  const updateActiveState = (index) => {
      events.forEach(event => event.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      events[index].classList.add('active');
      dots[index].classList.add('active');
      
      updateNavButtons();
  };

  // Navigation button clicks
  prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
          currentIndex--;
          updateActiveState(currentIndex);
      }
  });

  nextBtn.addEventListener('click', () => {
      if (currentIndex < events.length - 1) {
          currentIndex++;
          updateActiveState(currentIndex);
      }
  });

  // Dot navigation
  dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
          currentIndex = index;
          updateActiveState(currentIndex);
      });
  });

  // Initialize
  updateNavButtons();
});

//leadership tiles
document.addEventListener('DOMContentLoaded', () => {
    const menuButtons = document.querySelectorAll('.menu-btn');
    const cards = document.querySelectorAll('.leadership-card');

    // Initialize with current positions
    filterCards('current');

    menuButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            menuButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter cards
            filterCards(button.dataset.filter);
        });
    });

    function filterCards(filter) {
        cards.forEach(card => {
            if (card.dataset.position === filter) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });
    }

    // Existing card hover effects
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
  const menuButtons = document.querySelectorAll('.menu-btn');
  const cards = document.querySelectorAll('.leadership-card');

  // Initialize with current positions
  filterCards('current');

  menuButtons.forEach(button => {
      button.addEventListener('click', () => {
          // Remove active class from all buttons
          menuButtons.forEach(btn => btn.classList.remove('active'));
          // Add active class to clicked button
          button.classList.add('active');
          // Filter cards
          filterCards(button.dataset.filter);
      });
  });

  function filterCards(filter) {
      cards.forEach(card => {
          if (card.dataset.position === filter) {
              card.classList.remove('hidden');
              // Force a reflow to ensure proper animation
              void card.offsetWidth;
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
          } else {
              card.classList.add('hidden');
              card.style.opacity = '0';
              card.style.transform = 'translateY(20px)';
          }
      });

      // Force grid reflow
      const grid = document.querySelector('.leadership-grid');
      void grid.offsetHeight;
  }

  // Existing card hover effects
  cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          card.style.setProperty('--mouse-x', `${x}px`);
          card.style.setProperty('--mouse-y', `${y}px`);
      });
  });
});

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Initialize animations for about section
  initAboutSection();
});

function initAboutSection() {
  
  // Add hover effects for focus items
  initFocusItems();
  
  // Add parallax effect to profile image
  initProfileParallax();
  
  // Initialize intersection observer for scroll animations
  initScrollAnimations();

  // Add hover effect for stat items
  const statItems = document.querySelectorAll('.stat-item');
  statItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
          const icon = item.querySelector('i');
          icon.style.transform = 'scale(1.2) rotate(10deg)';
      });
      
      item.addEventListener('mouseleave', () => {
          const icon = item.querySelector('i');
          icon.style.transform = 'scale(1) rotate(0deg)';
      });
  });
}

function animateValue(element, start, end, duration) {
  let startTimestamp = null;
  
  function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const currentValue = Math.floor(progress * (end - start) + start);
      
      element.textContent = currentValue + '+';
      
      if (progress < 1) {
          window.requestAnimationFrame(step);
      }
  }
  
  window.requestAnimationFrame(step);
}

// Enhanced hover effects for focus items
function initFocusItems() {
  const focusItems = document.querySelectorAll('.focus-item');
  
  focusItems.forEach(item => {
      item.addEventListener('mouseenter', (e) => {
          // Add glow effect
          item.style.boxShadow = '0 0 20px rgba(var(--accent-color-rgb), 0.2)';
          
          // Animate icon
          const icon = item.querySelector('i');
          icon.style.transform = 'scale(1.2)';
          icon.style.color = 'var(--accent-color)';
      });
      
      item.addEventListener('mouseleave', (e) => {
          item.style.boxShadow = 'none';
          const icon = item.querySelector('i');
          icon.style.transform = 'scale(1)';
          icon.style.color = '';
      });
  });
}

// Parallax effect for profile image
function initProfileParallax() {
  const profileImage = document.querySelector('.profile-image-container');
  const decoration = document.querySelector('.image-decoration');
  
  document.addEventListener('mousemove', (e) => {
      if (!profileImage) return;
      
      const rect = profileImage.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const moveX = (e.clientX - centerX) / 30;
      const moveY = (e.clientY - centerY) / 30;
      
      // Subtle movement for the image
      profileImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
      
      // Opposite movement for decoration
      if (decoration) {
          decoration.style.transform = `translate(${10 - moveX}px, ${10 - moveY}px)`;
      }
  });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
  const options = {
      threshold: 0.2,
      rootMargin: '0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
              observer.unobserve(entry.target);
          }
      });
  }, options);
  
  // Observe elements
  const elements = document.querySelectorAll('.bio-section, .focus-item, .goals-list li, .interest-tag');
  elements.forEach(el => {
      el.classList.add('animate-ready');
      observer.observe(el);
  });
}

// Add event listeners for profile image hover effect
function initProfileHover() {
  const profileContainer = document.querySelector('.profile-image-container');
  
  if (profileContainer) {
      profileContainer.addEventListener('mouseenter', () => {
          const image = profileContainer.querySelector('.profile-image');
          if (image) {
              image.style.transform = 'scale(1.05)';
          }
      });
      
      profileContainer.addEventListener('mouseleave', () => {
          const image = profileContainer.querySelector('.profile-image');
          if (image) {
              image.style.transform = 'scale(1)';
          }
      });
  }
}

// Initialize stagger animations
function initStaggerAnimations() {
  // Add index to goals list items
  document.querySelectorAll('.goals-list li').forEach((item, index) => {
      item.style.setProperty('--item-index', index);
  });
  
  // Add index to interest tags
  document.querySelectorAll('.interest-tag').forEach((tag, index) => {
      tag.style.setProperty('--item-index', index);
  });
}

// Disable typing effect for the About Me section (instant reveal)
function initTypingEffect() {
  const bioText = document.querySelector('.bio-text');
  if (!bioText) return;
  // ensure text displays instantly without animation
  bioText.style.opacity = '1';
  bioText.style.visibility = 'visible';
}


// Initialize everything
window.addEventListener('load', () => {
  initAboutSection();
  initProfileHover();
  initStaggerAnimations();
  initTypingEffect();
});

// ===== Skill Spotlight =====
const skillsData = [
  {
    key: "python", name: "Python", level: 5,
    proof: [
      "Processed 700+ survey responses (ELDAAS, Fall ’23)",
      "Built data workflows & prototypes (Futurristic, Summer ’24)"
    ]
  },
  {
    key: "ml", name: "Machine Learning", level: 5,
    proof: [
      "Model tuning & evaluation; deployed small demos",
      "Applied CV (OpenCV) for analysis; AR/VR integration context"
    ]
  },
  {
    key: "javascript", name: "JavaScript", level: 4,
    proof: [
      "Interactive toddler learning game (JS/HTML/CSS)",
      "Portfolio front-end & AI chat integration"
    ]
  },
  {
    key: "sql", name: "SQL", level: 4,
    proof: [
      "Managed 10+ DBs; write/verify queries (Platinum, Spring ’24)",
      "Built update/verification procedures for transactional data"
    ]
  },
  {
    key: "vrar", name: "AR / VR", level: 3,
    proof: [
      "Integrated A-Frame & AR.js into prototypes (Futurristic ’24)",
      "Collaborated on immersive features + data flow"
    ]
  }
];

// If you already have a profile JSON loaded in JS, you can map from there instead.

(function initSkillSpotlight() {
  const chipsWrap = document.getElementById("ss-chips");
  const gauge = document.getElementById("ss-gauge-fg");
  const nameEl = document.getElementById("ss-skill-name");
  const levelEl = document.getElementById("ss-skill-level");
  const evList = document.getElementById("ss-evidence");
  if (!chipsWrap || !gauge || !nameEl || !levelEl || !evList) return;

  // Build chips
  skillsData.forEach((s, idx) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "ss-chip";
    chip.textContent = s.name;
    chip.setAttribute("data-key", s.key);
    chip.addEventListener("click", () => selectSkill(s.key));
    chipsWrap.appendChild(chip);
    if (idx === 0) chip.classList.add("active");
  });

  function setGauge(level) {
    // Circle length: 2πr with r=52 → ~327
    const total = 327;
    const maxLevel = 5;
    const filled = total * (level / maxLevel);
    gauge.style.strokeDashoffset = String(total - filled);
  }

  function renderProof(items) {
    evList.innerHTML = "";
    items.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      evList.appendChild(li);
    });
  }

  function selectSkill(key) {
    // activate chip
    [...chipsWrap.children].forEach(c => c.classList.toggle("active", c.getAttribute("data-key") === key));
    // update panel
    const s = skillsData.find(x => x.key === key) || skillsData[0];
    nameEl.textContent = s.name;
    levelEl.textContent = `${s.level} / 5`;
    setGauge(s.level);
    renderProof(s.proof);
  }

  // initial
  const first = skillsData[0];
  nameEl.textContent = first.name;
  levelEl.textContent = `${first.level} / 5`;
  setGauge(first.level);
  renderProof(first.proof);
})();

// Prevent right-click context menu
document.addEventListener("contextmenu", event => event.preventDefault());

(function loadGitHubCalendar() {
  const mount = document.getElementById("gh-calendar");
  if (!mount) return;

  const username = "YuvamBh"; // <-- change if needed
  fetch(`/github/contributions?u=${encodeURIComponent(username)}`)
    .then((r) => (r.ok ? r.text() : Promise.reject(r.status)))
    .then((svg) => {
      mount.innerHTML = svg;

      // optional: remove top legend & footer notes from GitHub SVG
      const legend = mount.querySelector('svg .ContributionCalendar-legend');
      if (legend) legend.remove();
      const srOnly = mount.querySelector('svg .sr-only');
      if (srOnly) srOnly.remove();

      // Make SVG responsive
      const svgEl = mount.querySelector("svg");
      if (svgEl) {
        svgEl.removeAttribute("width");
        svgEl.setAttribute("width", "100%");
        svgEl.setAttribute("height", "auto");
        svgEl.style.maxWidth = "100%";
      }
    })
    .catch(() => {
      mount.innerHTML = '<p class="muted">Couldn’t load GitHub activity.</p>';
    });
})();





