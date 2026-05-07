export const ANALYSIS_PROMPT = `Analyze this university webpage for accessibility, content quality, and design issues.
URL: {url}
HTML (truncated to first 5000 chars): {html}

Respond with only valid JSON in this exact shape:
{
    "accessibility": { "score": <0-100>, "issues": ["..."] },
    "content": { "score": <0-100>, "pageType": "...", "issues": ["..."] },
    "design": { "score": <0-100>, "issues": ["..."] }
}`;
