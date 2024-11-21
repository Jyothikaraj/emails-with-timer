// Send the email request directly to Google Apps Script
async function sendEmails() {
    const formData = new URLSearchParams();
    formData.append('action', 'sendEmails'); // The action to trigger sending emails

    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbx7V0Ta4TlrE48mTdG7GZW0Lwgb5JOtH4Xx5q7QGzwTkgRp-vEVERp4WAB6P_O1chr2/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
        alert('Error occurred: ' + error.message);
    }
}

// Start the offer timer and handle countdown
async function startOfferTimer() {
    try {

        // Fetch the timestamp from the Google Apps Script backend
        const response = await fetch(`https://script.google.com/macros/s/AKfycbx7V0Ta4TlrE48mTdG7GZW0Lwgb5JOtH4Xx5q7QGzwTkgRp-vEVERp4WAB6P_O1chr2/exec?action=getTimestamp`);
        const data = await response.json();

        if (data.success) {
            const startTime = new Date(data.startTime);  // Parse the ISO string into a Date object
            const offerDuration = 3 * 60 * 60 * 1000;  // Offer duration (3 hours in milliseconds)
            const timeLeft = offerDuration - (new Date().getTime() - startTime.getTime());

            if (timeLeft <= 0) {
                document.getElementById('offer-form').style.display = 'none';
                document.getElementById('offer-expired').style.display = 'block';
            } else {
                let countdown = timeLeft / 1000;  // Convert milliseconds to seconds

                const timerInterval = setInterval(() => {
                    if (countdown <= 0) {
                        clearInterval(timerInterval);
                        document.getElementById('offer-form').style.display = 'none';
                        document.getElementById('offer-expired').style.display = 'block';
                    } else {
                        const hours = Math.floor(countdown / 3600);
                        const minutes = Math.floor((countdown % 3600) / 60);
                        const seconds = Math.floor(countdown % 60);
                        document.getElementById('time-left').textContent = `${hours}:${minutes}:${seconds}`;
                        countdown--;
                    }
                }, 1000);
            }
        } else {
            alert('Could not retrieve offer timestamp.');
        }
    } catch (error) {
        console.error('Error starting countdown:', error);
        alert('Error loading timer.');
    }
}

// Run the timer when the page is loaded
window.onload = function() {
    startOfferTimer();
}
