export const ANALYSIS_PROMPT = `You are a university website content analyst.

URL: {url}

Page metadata:
{metadata}

Page content (main text):
{content}

Classify this page and evaluate its content quality.

Respond with only valid JSON in this exact shape:
{
  "content": {
    "pageType": "HOMEPAGE | DEPARTMENT | COURSE_LISTING | FACULTY_DIRECTORY | FACULTY_PROFILE | EVENT_CALENDAR | NEWS_ARTICLE | ADMISSIONS | ABOUT | CONTACT | GENERIC",
    "score": <0-100>,
    "issues": ["specific content issue 1", "specific content issue 2"]
  }
}`;
