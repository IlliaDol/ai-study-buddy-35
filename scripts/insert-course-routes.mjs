import fs from 'fs';

const appCandidates = ['src/App.tsx', 'src/App.jsx'];
const appPath = appCandidates.find(p => fs.existsSync(p));

if (!appPath) {
  console.log('ℹ️  No src/App.(t|j)sx found — skipping routes patch.');
  process.exit(0);
}

let code = fs.readFileSync(appPath, 'utf8');

function ensureImport(src, spec) {
  if (code.includes(spec)) return;
  // insert after the last import
  const lines = code.split('\n');
  let lastImportIdx = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ')) lastImportIdx = i;
  }
  const ins = `import ${src}\n`;
  if (lastImportIdx >= 0) {
    lines.splice(lastImportIdx + 1, 0, ins.trimEnd());
  } else {
    lines.unshift(ins.trimEnd());
  }
  code = lines.join('\n');
}

ensureImport("CourseOverview from './pages/course/CourseOverview';", "./pages/course/CourseOverview");
ensureImport("CourseItemPage from './pages/course/CourseItemPage';", "./pages/course/CourseItemPage");
ensureImport("CourseGrades from './pages/course/CourseGrades';", "./pages/course/CourseGrades");
ensureImport("CourseDiscussions from './pages/course/CourseDiscussions';", "./pages/course/CourseDiscussions");

if (!code.includes('/course/:id')) {
  // inject routes before </Routes>
  const ROUTES = [
    `<Route path="/course/:id" element={<CourseOverview />} />`,
    `<Route path="/course/:id/lesson/:itemId" element={<CourseItemPage />} />`,
    `<Route path="/course/:id/grades" element={<CourseGrades />} />`,
    `<Route path="/course/:id/discussions" element={<CourseDiscussions />} />`,
  ].join('\n        ');

  const routesClose = code.indexOf('</Routes>');
  const routesOpen = code.indexOf('<Routes');
  if (routesOpen !== -1 && routesClose !== -1) {
    // find the end of opening <Routes ...>
    const afterOpen = code.indexOf('>', routesOpen);
    if (afterOpen !== -1 && afterOpen < routesClose) {
      code = code.slice(0, routesClose) + `\n        ${ROUTES}\n      ` + code.slice(routesClose);
      fs.writeFileSync(appPath, code, 'utf8');
      console.log(`✅ Patched course routes in ${appPath}`);
      process.exit(0);
    }
  }
  console.log('ℹ️  Could not safely inject into <Routes>…</Routes>. Please add routes manually (see script).');
} else {
  console.log('ℹ️  Course routes already present — nothing to do.');
}
