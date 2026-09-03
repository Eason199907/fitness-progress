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
  globalThis.workouts = { sessions, latestMonth, sessionsForMonth, latestDayForMonth, findSession, calendarDaysForMonth, calendarTone, shiftMonth, currentCalendarMonth, MonthNavigator };
`, context);
const data = context.workouts;

test("keeps August records and separates September from August", () => {
  assert.equal(data.sessions.length, 13);
  assert.equal(new Set(data.sessions.map((s) => s.date)).size, 13);
  assert.equal(data.sessionsForMonth(8).length, 11);
  assert.equal(data.sessionsForMonth(9).length, 2);
  assert.equal(data.findSession(8, 1), undefined);
  assert.equal(data.findSession(9, 1).date, "09.01");
  assert.equal(data.latestMonth, 9);
  assert.equal(data.latestDayForMonth(8), 28);
  assert.equal(data.latestDayForMonth(9), 3);
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

test("September 3 chest workout preserves all screenshot sets and rest times", () => {
  const workout = data.findSession(9, 3);
  assert.equal(workout.time, "13:00–14:00");
  assert.equal(workout.intensity, 60);
  assert.equal(workout.sleep, "良好");
  assert.equal(workout.warmup, "胸椎灵活 · 前锯肌激活 · 肩袖热身");
  assert.equal(workout.actions.length, 5);
  assert.match(workout.actions[0].sets, /4组 12次×30kg · 间歇60秒/);
  assert.match(workout.actions[1].sets, /4组 15次×7.5kg · 间歇60秒/);
  assert.match(workout.actions[2].sets, /1组 12次×10kg；3组 15次×10kg · 间歇90秒/);
  assert.match(workout.actions[3].sets, /2组 12次×60kg · 间歇90秒/);
  assert.match(workout.actions[4].sets, /3组 15次×10kg · 间歇60秒/);
  assert.equal(workout.feeling, undefined);
  assert.equal(data.calendarTone(workout), "coral");
});

test("month navigation handles year boundaries, leap years and empty months without repeating records", () => {
  const next = data.shiftMonth(2026, 12, 1);
  const previous = data.shiftMonth(2026, 1, -1);
  assert.equal(next.year, 2027);
  assert.equal(next.month, 1);
  assert.equal(previous.year, 2025);
  assert.equal(previous.month, 12);
  assert.equal(data.calendarDaysForMonth(2, 2028).filter(Boolean).length, 29);
  assert.equal(data.calendarDaysForMonth(2, 2027).filter(Boolean).length, 28);
  assert.equal(data.sessionsForMonth(9, 2027).length, 0);
  assert.equal(data.findSession(9, 3, 2027), undefined);
  assert.equal(data.latestDayForMonth(9, 2027), 1);
  assert.equal(data.sessionsForMonth(10, 2026).length, 0);
  const current = data.currentCalendarMonth(new Date(2026, 8, 3));
  assert.equal(current.year, 2026);
  assert.equal(current.month, 9);
});

test("initial page shows latest workout with arrows, direct month selection and return to current month", () => {
  const html = renderToStaticMarkup(createElement(context.exports.default));
  const text = html.replace(/<[^>]*>/g, "");
  assert.match(text, /9月训练月历/);
  assert.match(text, /13:00–14:00/);
  assert.match(text, /蝴蝶机夹胸/);
  assert.match(text, /60%/);
  assert.match(text, /累计完成13次训练/);
  assert.match(html, /aria-label="上个月"/);
  assert.match(html, /aria-label="下个月"/);
  assert.match(html, /class="month-title"[^>]*aria-label="2026年9月，选择年月"/);
  assert.match(html, /aria-label="选择年份"/);
  assert.match(html, /value="2026" selected=""/);
  for (let month = 1; month <= 12; month++) {
    assert.ok(html.includes(`aria-label="2026年${month}月" aria-pressed="${month === 9}"`));
  }
  assert.match(text, /回到本月/);
  assert.match(html, /aria-label="2026年9月3日胸部训练，查看训练细节"/);
  assert.doesNotMatch(html, /aria-label="2026年9月31日/);
});

test("navigator disables year boundary arrows and leaves only the selected month pressed", () => {
  const first = renderToStaticMarkup(createElement(data.MonthNavigator, { year: 1900, month: 1, onChange() {} }));
  const last = renderToStaticMarkup(createElement(data.MonthNavigator, { year: 2100, month: 12, onChange() {} }));
  assert.match(first, /aria-label="上个月" disabled=""/);
  assert.match(first, /aria-label="上一年" disabled=""/);
  assert.match(last, /aria-label="下个月" disabled=""/);
  assert.match(last, /aria-label="下一年" disabled=""/);
  assert.equal((first.match(/aria-pressed="true"/g) || []).length, 1);
  assert.equal((last.match(/aria-pressed="true"/g) || []).length, 1);
});
