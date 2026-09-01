import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const source = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const context = { require: createRequire(import.meta.url), exports: {} };
vm.runInNewContext(compiled + `
  globalThis.workouts = { sessions, latestMonth, sessionsForMonth, latestDayForMonth, findSession, calendarDaysForMonth, calendarTone };
`, context);
const data = context.workouts;

test("keeps August records and separates September from August", () => {
  assert.equal(data.sessions.length, 12);
  assert.equal(new Set(data.sessions.map((s) => s.date)).size, 12);
  assert.equal(data.sessionsForMonth(8).length, 11);
  assert.equal(data.sessionsForMonth(9).length, 1);
  assert.equal(data.findSession(8, 1), undefined);
  assert.equal(data.findSession(9, 1).date, "09.01");
  assert.equal(data.latestMonth, 9);
  assert.equal(data.latestDayForMonth(8), 28);
  assert.equal(data.latestDayForMonth(9), 1);
});

test("Sunday-first calendars put September 1 on Tuesday and keep month lengths", () => {
  const august = data.calendarDaysForMonth(8);
  const september = data.calendarDaysForMonth(9);
  assert.equal(august.indexOf(1), 6);
  assert.equal(september.indexOf(1), 2);
  assert.equal(august.filter(Boolean).length, 31);
  assert.equal(september.filter(Boolean).length, 30);
  assert.equal(august.length % 7, 0);
  assert.equal(september.length % 7, 0);
  assert.equal(september.includes(31), false);
});

test("September workout preserves screenshot values without adding cardio or stretching", () => {
  const workout = data.findSession(9, 1);
  assert.equal(workout.time, "13:00–14:00");
  assert.equal(workout.intensity, 75);
  assert.equal(workout.sleep, "良好");
  assert.equal(workout.feeling, "适中");
  assert.match(workout.warmup, /悬垂控腹30秒×2组/);
  assert.equal(workout.actions.length, 5);
  assert.match(workout.actions[0].sets, /4组 15次×助力65kg/);
  assert.match(workout.actions[1].sets, /4组 12次×自重/);
  assert.match(workout.actions[2].sets, /4组 8次 · 重量未记录/);
  assert.match(workout.actions[3].sets, /3组 15次×10kg/);
  assert.match(workout.actions[4].sets, /3组 15次×20kg；1组 15次×15kg/);
  assert.equal(data.calendarTone(workout), "blue");
  assert.match(data.calendarTone(data.findSession(8, 28)), /stretch-session/);
  assert.match(data.calendarTone(data.findSession(8, 19)), /cardio-session/);
});

test("initial page shows September workout and a month selector with August retained", () => {
  const html = renderToStaticMarkup(createElement(context.exports.default));
  const text = html.replace(/<[^>]*>/g, "");
  assert.match(text, /9月训练月历/);
  assert.match(text, /13:00–14:00/);
  assert.match(text, /训练感受适中/);
  assert.match(text, /累计完成12次训练/);
  assert.match(html, /value="8"[^>]*>2026年8月/);
  assert.match(html, /value="9" selected=""/);
  assert.match(html, /aria-label="9月1日背部训练，查看训练细节"/);
  assert.doesNotMatch(html, /aria-label="9月31日/);
});
