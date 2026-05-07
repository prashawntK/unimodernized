export const REDESIGN_PROMPT = `You are a university website redesign expert.
Based on the HTML and analysis of this university webpage, generate a targeted redesign recommendation.

URL: {url}
HTML (truncated to first 5000 chars): {html}

Analysis results:
{analysis}

Respond with only valid JSON in this exact shape:
{
  "pageType": "HOMEPAGE | DEPARTMENT | COURSE_LISTING | FACULTY_DIRECTORY | FACULTY_PROFILE | EVENT_CALENDAR | NEWS_ARTICLE | ADMISSIONS | ABOUT | CONTACT | GENERIC",
  "layout": "short description of the best layout e.g. card-grid, hero-with-sidebar, full-width-table",
  "colors": {
    "primary": "#hexcode",
    "background": "#hexcode",
    "text": "#hexcode"
  },
  "typography": {
    "heading": "font name",
    "body": "font name"
  },
  "fixes": ["specific actionable fix 1", "specific actionable fix 2"]
}`;
