
var config = {

   repo: process.env.GITHUB_REPO,

   weekDaysOff: [0,6],

   colorByDev: JSON.parse(process.env.COLORS),

   holidays: {},

   excludedMilestones: [ ],

   defaultDuration: 1 // in days

};