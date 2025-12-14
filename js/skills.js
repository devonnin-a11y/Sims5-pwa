import { playSound } from "./sound.js";
import { showPopup } from "./ui.js";

export function gainSkillXp(sim, skill, amount) {
  sim.skills = sim.skills || {};
  sim.skills[skill] = sim.skills[skill] || { level: 1, xp: 0 };

  const s = sim.skills[skill];
  s.xp += amount;

  if (s.xp >= 100) {
    s.xp -= 100;
    s.level += 1;

    playSound("stamp");
    showPopup({
      title: "Skill Up!",
      message: `${skill} reached Level ${s.level}`,
      icon: "⭐️"
    });
  }
}
