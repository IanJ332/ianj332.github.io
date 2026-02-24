import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = path.join(__dirname, '../public');
const REPO = 'sickn33/antigravity-awesome-skills';

async function updateStars() {
    try {
        console.log(`Fetching stars for ${REPO}...`);
        const response = await fetch(`https://api.github.com/repos/${REPO}`);
        const data = await response.json();

        if (!data.stargazers_count) {
            throw new Error('Could not find stargazers_count in response');
        }

        const count = data.stargazers_count;
        const formattedCount = count >= 1000 ? (count / 1000).toFixed(1) + 'k+' : count.toString();

        const shieldData = {
            schemaVersion: 1,
            label: "Total Stars",
            message: formattedCount,
            color: "FAD02C"
        };

        if (!fs.existsSync(PUBLIC_DIR)) {
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }

        const filePath = path.join(PUBLIC_DIR, 'stars.json');
        fs.writeFileSync(filePath, JSON.stringify(shieldData, null, 2));

        console.log(`Successfully updated ${filePath} with message: ${formattedCount}`);
    } catch (error) {
        console.error('Error updating stars:', error);
        process.exit(1);
    }
}

updateStars();
