const fs = require('fs');
const path = require('path');

const talksFilePath = path.join(__dirname, 'src', 'talks.json');
const templateFilePath = path.join(__dirname, 'src', 'template.html');
const cssFilePath = path.join(__dirname, 'src', 'style.css');
const jsFilePath = path.join(__dirname, 'src', 'script.js');
const outputDirPath = path.join(__dirname, 'dist');
const outputFilePath = path.join(outputDirPath, 'index.html');

// Ensure output directory exists
if (!fs.existsSync(outputDirPath)) {
    fs.mkdirSync(outputDirPath);
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

async function buildWebsite() {
    try {
        const talksData = JSON.parse(fs.readFileSync(talksFilePath, 'utf8'));
        let htmlTemplate = fs.readFileSync(templateFilePath, 'utf8');
        const cssContent = fs.readFileSync(cssFilePath, 'utf8');
        const jsContent = fs.readFileSync(jsFilePath, 'utf8');

        let scheduleHtml = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0); // Start at 10:00 AM

        const talksPerSegment = 3; // For 3 talks then lunch
        const lunchBreakDuration = 60; // minutes

        for (let i = 0; i < talksData.length; i++) {
            const talk = talksData[i];
            const talkStartTime = new Date(currentTime);
            const talkEndTime = new Date(talkStartTime.getTime() + 60 * 60 * 1000); // 1 hour talk

            scheduleHtml += `
            <div class="talk-item">
                <p class="time">${formatTime(talkStartTime)} - ${formatTime(talkEndTime)}</p>
                <h3>${talk.title}</h3>
                <p class="speakers">Speakers: ${talk.speakers.join(', ')}</p>
                <p class="category">Category: ${talk.category.join(', ')}</p>
                <p class="description">${talk.description}</p>
            </div>`;

            currentTime = new Date(talkEndTime.getTime() + 10 * 60 * 1000); // 10 min transition

            // Add lunch break after a segment of talks
            if ((i + 1) % talksPerSegment === 0 && (i + 1) < talksData.length) {
                const lunchStartTime = new Date(currentTime);
                const lunchEndTime = new Date(lunchStartTime.getTime() + lunchBreakDuration * 60 * 1000);
                scheduleHtml += `
                <div class="talk-item lunch-break">
                    <p class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</p>
                    <h3>LUNCH BREAK</h3>
                </div>`;
                currentTime = new Date(lunchEndTime.getTime()); // Set current time to end of lunch for next talk
            }
        }

        htmlTemplate = htmlTemplate.replace('{{CSS}}', cssContent);
        htmlTemplate = htmlTemplate.replace('{{SCHEDULE_ITEMS}}', scheduleHtml);
        htmlTemplate = htmlTemplate.replace('{{JAVASCRIPT}}', jsContent);

        fs.writeFileSync(outputFilePath, htmlTemplate, 'utf8');
        console.log(`Website successfully generated at ${outputFilePath}`);

    } catch (error) {
        console.error('Error building website:', error);
    }
}

buildWebsite();
