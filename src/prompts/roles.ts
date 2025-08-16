// Prompt templates for the 4-agent pipeline.
// These are plain strings now; later wire to server-side LLM with JSON-mode/function-calling.

export const PlannerPrompt = `
You are Planner. Produce ONLY valid JSON matching the Syllabus schema.
Add Bloom levels to outcomes in parentheses. Do not add commentary.
`;

export const ResearcherPrompt = `
You are Researcher. Retrieve 3-5 reputable sources and produce notes with citations.
Return ONLY JSON: { references: [{title, url, citation}], notes: string[] }
`;

export const WriterPrompt = `
You are Writer. Write lessons strictly matching the Lesson schema.
Ensure structure: brief theory -> worked example -> exercises.
Return ONLY JSON.
`;

export const CriticPrompt = `
You are Critic. Score content by rubric and list must_fix array with concrete issues.
Return ONLY JSON matching RubricResult schema. Trigger revise if any score < 4 or must_fix not empty.
`;
