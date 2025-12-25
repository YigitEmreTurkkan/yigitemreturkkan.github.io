Want to talk to my digital twin? My AI-powered portfolio is ready to answer questions about my background and technical stack.

## About

Hi — I'm Yigit Emre Turkkan. This repository hosts an AI-driven portfolio that acts as a conversational interface to my CV and projects. Ask it about my experience, education, technical skills, or specific projects and it will respond with concise, contextual answers.

## Features

- Conversational access to CV data and project summaries.
- Context-aware answers about skills, timelines, and roles.
- Quick links to projects, contact info, and social profiles.
- Lightweight, privacy-conscious design — no external analytics by default.

## How to use

- Open the site and type a question like: "What backend frameworks do you use?" or "Tell me about the X project."
- The assistant reads structured CV data from `cv-data.json` and returns clear, sourced responses.
- For best results, ask specific questions (role, year, technology, or project name).

## Technical stack

- Frontend: HTML, CSS, and minimal JavaScript for the chat UI.
- Assistant logic: Client-side prompt logic using `gemini-chat.js` and structured data from `cv-data.json`.
- Data: `cv-data.json` contains experience, education, and skills in machine-readable format.

## Developer notes

- The chat UI is intentionally simple to keep focus on answers and performance.
- To update personal info or projects, edit `cv-data.json`.
- To tweak assistant phrasing or behavior, modify `gemini-chat.js` prompts and logic.

## Deploying locally

1. Clone the repository.
2. Serve the folder with a static server, for example:

```bash
python -m http.server
```

3. Open `index.html` in your browser and interact with the digital twin.

## Contributing

- Contributions are welcome for UI improvements, prompt tuning, or adding optional server-side enhancements.
- Please open an issue or submit a pull request with a clear description of changes.

## Privacy & Data

- The site uses only the data in this repository to answer questions.
- No third-party tracking is included by default.

## Contact

For collaboration or questions about the implementation, open an issue or use the contact links on the site.

---

If you'd like changes to tone, length, or additional sections (examples, screenshots, or badges), tell me and I will update the README.
