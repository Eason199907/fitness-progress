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
  globalThis.workouts = { sessions, latestMonth, sessionsForMonth, latestDayForMonth, findSession, calendarDaysForMonth, calendarTone, shiftMonth, currentCalendarMonth, MonthNavigator, bodyAssessment, composition, segmentalFat };
`, context);
const data = context.workouts;

test("keeps August records and separates September from August", () => {
  assert.equal(data.sessions.length, 17);
  assert.equal(new Set(data.sessions.map((s) => s.date)).size, 17);
  assert.equal(data.sessionsForMonth(8).length, 11);
  assert.equal(data.sessionsForMonth(9).length, 6);
  assert.equal(data.findSession(8, 1), undefined);
  assert.equal(data.findSession(9, 1).date, "09.01");
  assert.equal(data.latestMonth, 9);
  assert.equal(data.latestDayForMonth(8), 28);
  assert.equal(data.latestDayForMonth(9), 11);
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

test("September 4 leg workout preserves screenshot values and breathing note", () => {
  const workout = data.findSession(9, 4);
  assert.equal(workout.part, "腿");
  assert.equal(workout.time, "15:00–16:00");
  assert.equal(workout.intensity, 80);
  assert.equal(workout.sleep, "良好");
  assert.equal(workout.feeling, "比较累");
  assert.equal(workout.warmup, "筋膜松解 · 动态伸展 · 毛毛虫");
  assert.equal(workout.groups, "腿部力量＋腿部拉伸");
  assert.equal(workout.extraSession, "14:00–15:00 拉伸课 · 腿部筋膜刀");
  assert.equal(workout.stretchSession, "14:00–15:00 拉伸课 · 腿部筋膜刀");
  assert.equal(workout.actions.length, 4);
  assert.match(workout.actions[0].sets, /4组 12次×50kg · 间歇90秒/);
  assert.match(workout.actions[1].sets, /4组 8次×50kg · 间歇90秒/);
  assert.match(workout.actions[2].sets, /3组 10次×7.5kg×2 · 间歇90秒/);
  assert.match(workout.actions[3].sets, /2组 10次×80kg · 间歇120秒 · 第二组做完头痛，呼吸需调整/);
  assert.match(data.calendarTone(workout), /lime stretch-session/);
});

test("September 9 records lower-body strength followed by a one-hour stretching class", () => {
  const workout = data.findSession(9, 9);
  assert.equal(workout.part, "腿");
  assert.equal(workout.groups, "腿部力量＋拉伸");
  assert.equal(workout.time, "18:30–19:30");
  assert.equal(workout.intensity, 70);
  assert.equal(workout.sleep, "一般");
  assert.equal(workout.feeling, "适中");
  assert.equal(workout.warmup, "筋膜松解 · 动态伸展");
  assert.equal(workout.extraSession, "19:30–20:30 拉伸课 · 1小时");
  assert.equal(workout.stretchSession, "19:30–20:30 拉伸课 · 1小时");
  assert.equal(workout.actions.length, 5);
  assert.match(workout.actions[0].sets, /12 \/ 10次×46.8kg/);
  assert.match(workout.actions[0].sets, /头皮疼，松解斜角肌并调整呼吸/);
  assert.match(workout.actions[1].sets, /3组 12次×10kg · 间歇90秒/);
  assert.match(workout.actions[2].sets, /4组 12次×46.8kg · 间歇90秒/);
  assert.match(workout.actions[3].sets, /3组 10次×12.5kg×2 · 间歇90秒/);
  assert.match(workout.actions[4].sets, /20 \/ 20 \/ 15 \/ 15次；20 \/ 20 \/ 20kg \/ 空/);
  assert.match(data.calendarTone(workout), /lime stretch-session/);
});

test("September 10 records chest and shoulder strength followed by incline cardio", () => {
  const workout = data.findSession(9, 10);
  assert.equal(workout.part, "胸");
  assert.equal(workout.groups, "胸部＋肩部＋有氧");
  assert.equal(workout.time, "18:15–19:15");
  assert.equal(workout.cardioTime, "19:15–19:45");
  assert.equal(workout.intensity, 75);
  assert.equal(workout.sleep, "良好");
  assert.equal(workout.feeling, "比较累");
  assert.equal(workout.warmup, "胸椎灵活 · 前锯肌激活 · 胸小肌松解 · 肩袖热身");
  assert.equal(workout.actions.length, 6);
  assert.match(workout.actions[0].sets, /4组 12次×25kg · 间歇60秒/);
  assert.match(workout.actions[1].sets, /12次×10 \/ 10 \/ 12.5 \/ 12.8kg · 间歇90秒/);
  assert.match(workout.actions[2].sets, /4组 12次×12.5kg · 间歇90秒/);
  assert.match(workout.actions[3].sets, /4组 12次×12.5kg · 间歇90秒/);
  assert.match(workout.actions[4].sets, /4组 12次×30kg · 间歇60秒/);
  assert.match(workout.actions[5].sets, /3组 12次×空杆 · 间歇60秒/);
  assert.equal(workout.cardio, "爬坡 · 30分钟 · 坡度12 · 速度3.5");
  assert.match(data.calendarTone(workout), /coral cardio-session/);
});

test("September 11 records back and forearm training without cardio or stretching", () => {
  const workout = data.findSession(9, 11);
  assert.equal(workout.part, "背");
  assert.equal(workout.groups, "背部＋小臂");
  assert.equal(workout.time, "08:30–09:30");
  assert.equal(workout.intensity, 75);
  assert.equal(workout.sleep, "良好");
  assert.equal(workout.feeling, "比较累");
  assert.equal(workout.warmup, "筋膜松解 · 肩袖激活");
  assert.equal(workout.actions.length, 6);
  assert.match(workout.actions[0].sets, /2组 15次 · 重量未记录/);
  assert.match(workout.actions[1].sets, /2组 30秒 · 与TRX Y形肩交叉进行/);
  assert.match(workout.actions[2].sets, /4组 10次×9档 · 间歇90秒/);
  assert.match(workout.actions[3].sets, /4组 12次×30kg · 间歇90秒/);
  assert.match(workout.actions[4].sets, /4组 15次×20kg · 间歇90秒/);
  assert.match(workout.actions[5].sets, /2组 2回合×1.25kg · 正反手交替 · 间歇60秒/);
  assert.equal(workout.cardio, null);
  assert.equal(workout.stretchSession, undefined);
  assert.equal(data.calendarTone(workout), "blue");
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
  assert.match(text, /08:30–09:30/);
  assert.match(text, /TRX Y形肩/);
  assert.match(text, /站姿卷绳/);
  assert.match(text, /75%/);
  assert.match(text, /累计完成17次训练/);
  assert.doesNotMatch(html, /cardio-dot/);
  assert.match(html, /aria-label="上个月"/);
  assert.match(html, /aria-label="下个月"/);
  assert.match(html, /class="month-title"[^>]*aria-label="2026年9月，选择年月"/);
  assert.match(html, /aria-label="选择年份"/);
  assert.match(html, /value="2026" selected=""/);
  for (let month = 1; month <= 12; month++) {
    assert.ok(html.includes(`aria-label="2026年${month}月" aria-pressed="${month === 9}"`));
  }
  assert.match(text, /回到本月/);
  assert.match(html, /aria-label="2026年9月11日背部训练，查看训练细节"/);
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

test("September 4 body assessment keeps the complete Visbody snapshot and comparison", () => {
  assert.equal(data.bodyAssessment.date, "2026.09.04");
  assert.equal(data.bodyAssessment.time, "14:47");
  assert.equal(data.bodyAssessment.comparedWith, "2026.08.16");
  assert.equal(data.bodyAssessment.bodyScore, 69);
  assert.equal(data.bodyAssessment.postureScore, 83);
  assert.equal(data.composition.length, 15);
  const metric = (name) => data.composition.find((item) => item.name === name);
  assert.equal(metric("体重").value, "69.3");
  assert.equal(metric("体重").change, "↓0.2");
  assert.equal(metric("体脂率").value, "22.8");
  assert.equal(metric("肌肉量").value, "50.4");
  assert.equal(metric("骨骼肌").value, "31.2");
  assert.equal(metric("总水分").value, "38.6");
  assert.equal(metric("基础代谢").value, "1567.5");
  assert.equal(metric("腰臀比").value, "0.88");
  assert.deepEqual(Array.from(data.segmentalFat, (item) => Array.from(item)), [
    ["右上肢", "0.8"], ["左上肢", "0.9"], ["躯干", "8.3"], ["右下肢", "2.4"], ["左下肢", "2.4"],
  ]);
});
