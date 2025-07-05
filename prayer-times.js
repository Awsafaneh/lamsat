// Prayer times functionality
document.addEventListener('DOMContentLoaded', () => {
    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchPrayerTimes(latitude, longitude);
            },
            (error) => {
                console.error('Error getting location:', error);
                // Default to Amman, Jordan coordinates if location access is denied
                fetchPrayerTimes(31.9539, 35.9106);
            }
        );
    } else {
        // Default to Amman, Jordan coordinates if geolocation is not supported
        fetchPrayerTimes(31.9539, 35.9106);
    }
});

async function fetchPrayerTimes(latitude, longitude) {
    try {
        const date = new Date();
        const response = await fetch(
            `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=4`
        );
        const data = await response.json();
        
        if (data.code === 200) {
            updatePrayerTimes(data.data.timings);
            updateNextPrayer(data.data.timings);
        }
    } catch (error) {
        console.error('Error fetching prayer times:', error);
    }
}

function updatePrayerTimes(timings) {
    document.getElementById('fajrTime').textContent = timings.Fajr;
    document.getElementById('dhuhrTime').textContent = timings.Dhuhr;
    document.getElementById('asrTime').textContent = timings.Asr;
    document.getElementById('maghribTime').textContent = timings.Maghrib;
    document.getElementById('ishaTime').textContent = timings.Isha;
}

function updateNextPrayer(timings) {
    const prayers = [
        { name: 'Fajr', time: timings.Fajr },
        { name: 'Dhuhr', time: timings.Dhuhr },
        { name: 'Asr', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isha', time: timings.Isha }
    ];

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    let nextPrayer = null;
    for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerTime = hours * 60 + minutes;
        
        if (prayerTime > currentTime) {
            nextPrayer = prayer;
            break;
        }
    }

    // If no next prayer found for today, set to Fajr of next day
    if (!nextPrayer) {
        nextPrayer = prayers[0];
    }

    document.getElementById('nextPrayerName').textContent = nextPrayer.name;
    document.getElementById('nextPrayerTime').textContent = nextPrayer.time;

    // Update time remaining every minute
    updateTimeRemaining(nextPrayer.time);
    setInterval(() => updateTimeRemaining(nextPrayer.time), 60000);
}

function updateTimeRemaining(prayerTime) {
    const now = new Date();
    const [hours, minutes] = prayerTime.split(':').map(Number);
    const prayerDateTime = new Date(now);
    prayerDateTime.setHours(hours, minutes, 0, 0);

    // If prayer time has passed for today, set to next day
    if (prayerDateTime < now) {
        prayerDateTime.setDate(prayerDateTime.getDate() + 1);
    }

    const timeDiff = prayerDateTime - now;
    const hoursRemaining = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesRemaining = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    document.getElementById('timeRemaining').textContent = 
        `${hoursRemaining} hours and ${minutesRemaining} minutes remaining`;
} 