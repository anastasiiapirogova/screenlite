import { writeFileSync } from 'fs';
import { features } from './features.js';

function flattenFeatures(featuresByStatus) {
	const rows = [];
	for (const [status, features] of Object.entries(featuresByStatus)) {
		for (const feature of features) {
			rows.push([feature, status]);
		}
	}
	return rows;
}

function generateTableSection(title, rows) {
	const tableRows = rows
		.map(([feature, status]) => `\t\t<tr><td>${feature}</td><td>${status}</td></tr>`)
		.join('\n');

	return `
## ${title}

<table width="100%">
\t<thead>
\t\t<tr>
\t\t\t<th align="left" width="500px">Feature</th>
\t\t\t<th align="left" width="500px">Status</th>
\t\t</tr>
\t</thead>
\t<tbody>
${tableRows}
\t</tbody>
</table>`;
}

function generateHTMLContent(featureSections) {
	let content = '# Screenlite Features\n';
	content += '> **Note:** Several features are partially implemented on the backend but are not listed here.\n\n';
	for (const { section, features } of featureSections) {
		const rows = flattenFeatures(features);
		content += generateTableSection(section, rows) + '\n';
	}
	return content;
}

const output = generateHTMLContent(features);

writeFileSync('../../FEATURES.md', output);

console.log('✅ FEATURES.md generated successfully.');
