const validCodes = ["Yqcne2", "Omv46U", "L3v2I0", "fxFl6s", "ZlO3Gy", "t760kv", "006I09", "7cu2ZG", "U9P0Nl", "mjzRK3", "XXXXXX", "dadish3", "bob", "Michael", "6767", "67", "rjgiorjgio"];

// --- Redirection Logic ---
if (window.location.pathname.endsWith("blocked.html") && localStorage.getItem("accessGranted") === "true") {
  window.location.href = "/";
} else if (!window.location.pathname.endsWith("blocked.html") && localStorage.getItem("accessGranted") !== "true") {
  window.location.href = "blocked.html";
}

// --- Event Listeners for the Access Page ---
document.addEventListener('DOMContentLoaded', () => {
    const inviteCodeInput = document.getElementById('invite-code');
    const submitBtn = document.getElementById('submit-btn');
    
    if (inviteCodeInput && submitBtn) {
        submitBtn.addEventListener('click', checkInviteCode);
        inviteCodeInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                checkInviteCode();
            }
        });
    }
});

// --- Core Function to Check Code ---
function checkInviteCode() {
    const inviteCodeInput = document.getElementById("invite-code");
    const errorMessage = document.getElementById('error-message');
    const inputCode = inviteCodeInput.value.replace(/\s/g, '').trim();
    const iframe = document.getElementById("myIframe");

    if (validCodes.includes(inputCode)) {
        // Correct code: Grant access and redirect.
        localStorage.setItem("accessGranted", "true");
        window.location.href = "/";
    } else if (inputCode === "") {
        // Blank input: Do nothing.
        return;
    } else {
        // !!! BLUE SCREEN LOGIC TRIGGER !!!
        // Incorrect code: Show error, make iframe fullscreen, and start the sequence.
        if (errorMessage) errorMessage.style.display = 'block';
        
        if (iframe) {
            toggleFullscreen();
            // Send a message to banana.html to start the blue screen animation.
            setTimeout(() => {
                iframe.contentWindow.postMessage('startSequence', '*');
            }, 100);
        }
    }
}

// --- Fullscreen and Iframe Communication ---
function toggleFullscreen() {
    const iframe = document.getElementById("myIframe");
    if (!iframe) return;
    if (iframe.requestFullscreen) iframe.requestFullscreen();
    else if (iframe.webkitRequestFullscreen) iframe.webkitRequestFullscreen();
    else if (iframe.mozRequestFullscreen) iframe.mozRequestFullscreen();
    else if (iframe.msRequestFullscreen) iframe.msRequestFullscreen();
}

// Listen for messages from banana.html to know when to exit fullscreen.
window.addEventListener('message', function(event) {
    if (event.data === 'sequenceFinished') {
        if (document.fullscreenElement) document.exitFullscreen();
    }
});

// Listen for the user manually exiting fullscreen (e.g., pressing Esc).
document.addEventListener('fullscreenchange', function() {
    const iframe = document.getElementById("myIframe");
    if (!document.fullscreenElement && iframe) {
        // Tell banana.html to reset its animation.
        iframe.contentWindow.postMessage('resetSequence', '*');
    }
});





