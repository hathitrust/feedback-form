// import './app.css'
// import App from "./App.svelte";

// const app = new App({
//   target: document.getElementById("app"),
// });

// export default app;

import FeedbackForm from "./lib/FeedbackForm.svelte";

const apps = [];

document.querySelectorAll("feedback-form").forEach((el) => {
  const app = new FeedbackForm({
    target: el,
  });
  apps.push(app);
});
