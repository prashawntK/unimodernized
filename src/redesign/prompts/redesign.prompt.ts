export const REDESIGN_PROMPT = `You are a university website redesign expert.
Based on the content analysis and brand profile of this university webpage, generate a targeted redesign recommendation.

URL: {url}

Content analysis:
{content_analysis}

Use the colors and fonts from the Brand Profile as a baseline. You may modernize colors and fonts while keeping the brand identity.
Brand Profile:
{brand}

Respond with only valid JSON in this exact shape:
{
  "pageType": "HOMEPAGE | DEPARTMENT | COURSE_LISTING | FACULTY_DIRECTORY | FACULTY_PROFILE | EVENT_CALENDAR | NEWS_ARTICLE | ADMISSIONS | ABOUT | CONTACT | GENERIC",
  "layout": "hero-centered | hero-with-sidebar | card-grid | full-width-prose | two-column",
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
