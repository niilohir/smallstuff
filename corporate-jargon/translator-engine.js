// Rule-based Plain English → Corporate translator.
// 1. Exact match: if a sentence is already in the lists (data.js or EXACT_EXTRAS), use that translation.
//    Matching ignores case, punctuation, apostrophes ("dont" = "don't") and common contractions ("I am" = "I'm").
// 2. Otherwise: greedy longest-phrase swapping using the lists + SWAP_RULES below, then optional jargon padding.

// ---------------------------------------------------------------------------
// Swap rules. Format:  forms, separated, by, commas => form1 ; form2 ; form3
//   - left side forms map pairwise to right side forms (split by ";")
//   - "|" separates random alternatives (Re-roll picks a different one)
//   - a leading "@" means "only when the phrase is a whole clause" (e.g. "I don't know." but not "I don't know what")
//   - "#" lines are comments
// ---------------------------------------------------------------------------
const SWAP_RULES = `
# ---- Greetings & small talk ----
@hi, hello, hey, hiya, yo, heya => Hope this message finds you well | Hi team | Quick touchbase
@good morning, morning => Rise and grind, team ☀️ | Good morning, high performers
@good night, goodnight, gn => Logging off to recharge for tomorrow's deliverables
@goodbye, bye, bye bye, see ya, cya, later => Signing off for now | Logging off, let's circle back
see you tomorrow => looking forward to connecting next business day
see you => looking forward to connecting
see ya later, see ya, see you later, see you soon, talk to you later, talk later, ttyl => let's circle back offline | looking forward to our next touchpoint
thank you, thanks, thank u, ty, thx => thanks for your partnership on this | appreciate you 🙏 | grateful for your support
thank you so much, thanks so much, thanks a lot, thank you very much => I'm deeply grateful for your continued partnership 🙏
no problem, np, no worries => happy to support | always happy to add value
how are you, how are you doing, hows it going => how are you navigating this quarter | how's your bandwidth looking
whats up, sup, wassup => what's on your roadmap today
welcome => welcome aboard
sorry => apologies for any misalignment | I take full ownership
@sorry => Apologies for any misalignment | I take full ownership of that
@my bad => I take full ownership of that

# ---- Yes / no / reactions ----
yes, yeah, yep, yup, yea, ye => 100% aligned | directionally yes | fully bought in
@no, nope, nah => that's not something we can action right now | I'll have to push back on that
no way => that's a hard no from a strategic standpoint
of course, obviously => that's table stakes
@ok, okay, k, kk, alright, aight, okey => aligned | noted | sounds good, let's action it
ok, okay, alright => acceptable | within tolerance
sure => happy to support | absolutely
maybe, perhaps => potentially, pending further alignment | possibly, once we have more data points
probably => in all likelihood | directionally
definitely, absolutely => 100% | without a doubt
i agree => I'm fully aligned on this
i disagree => I'd like to offer an alternative perspective
@me too, same => +1 on this
youre right, you are right => you raise a great point
@i dont know, idk, no idea, dunno, i dunno => let me take that offline and circle back | I'll need to double-click on that and get back to you
i dont know, idk, no clue => I don't currently have visibility into
i dont care, idc => that's not a priority for me this quarter
@who cares => I'm not sure this moves the needle
@whatever => I'm agnostic on that
@oh no, oops, whoops, uh oh => that's a learning moment
@nice => love this 🔥
@cool => love that, very on-brand

# ---- Filler & internet speak ----
^honestly, to be honest, tbh, ngl, not gonna lie => in the spirit of radical transparency, | full transparency:
honestly, tbh, ngl => transparently
^basically => at a high level,
basically => essentially
literally => in a very real sense
^actually => to level-set,
actually => in actuality
^anyway, anyways => pivoting, | moving forward,
anyway, anyways => regardless
lol, haha, lmao, lmfao, hahaha, rofl, xd => 😅 | (laughs in synergy)
^omg, oh my god => huge moment for the team:
omg => remarkably
^wtf, what the hell => I'd love to understand the rationale here:
wtf => in what world
^btw, by the way => quick side note:
btw, by the way => as a side note
asap => at your earliest convenience (EOD at the latest)
^fyi => for your visibility,
fyi => for your visibility
^imo, in my opinion, imho => from where I'm sitting,
imo, imho => in my view
^um, uh, umm, uhh, hmm, erm => let me double-click on that...
um, uh, umm, uhh => strategically speaking
bruh, bro, dude => my valued connection
for real, fr, no cap, deadass => in all transparency
like literally => in a very real, very literal sense

# ---- Connectors ----
but => , however, | , that said,
because, cuz, bc, coz => due to the fact that
so that => in order to drive
^also => additionally,
also => additionally
and then => subsequently,
then => subsequently
instead => as an alternative approach
again => once again
please, pls, plz => kindly

# ---- Time ----
now, right now => at this point in time | in real time
today => EOD today | this business day
tomorrow => next business day
yesterday => last business day
tonight => after hours
this morning => earlier this business day
this week => this sprint
next week => next sprint
last week => last sprint
this year => this fiscal year
next year => next fiscal year
last year => last fiscal year
soon => in the near term | in the coming sprints
never => not on the current roadmap
always => consistently and at scale
sometimes => on an ad hoc basis
often => on a recurring cadence
every day, everyday, daily => on a daily cadence
every week, weekly => on a weekly cadence
week, weeks => sprint ; sprints
month, months => cycle ; cycles
year, years => fiscal year ; fiscal years
day, days => business day ; business days
hour, hours => billable hour ; billable hours
minute, minutes => quick sec ; quick secs
deadline, deadlines => delivery milestone ; delivery milestones
early => ahead of schedule
on time => on schedule and within scope
in a minute, in a sec, one sec, one second => in a quick moment, once I close out this action item
monday => the start-of-sprint kickoff
friday => end-of-sprint
weekends => out-of-office wellness windows
all weekend, the whole weekend => throughout the out-of-office wellness window
this weekend => this out-of-office wellness window
all day => end-to-end, all business day
all night => through the after-hours window

# ---- Degree & amount ----
fast, quick => agile | high-velocity
quickly => at velocity | in an agile way
slow => phased
slowly => in a phased approach
very, really, extremely, super, so so => incredibly | massively | exceptionally
kinda, kind of, sort of => directionally
a lot, lots, a ton, tons => a significant amount | a non-trivial amount
a lot of, lots of, tons of, a ton of, so many => a significant volume of | a non-trivial amount of
a little, a bit, a little bit => a marginal amount
too much => more than our current capacity allows
not enough => below target
enough => sufficient
almost => directionally
totally, completely, fully => fully and holistically
pretty good => directionally solid
not bad => trending in the right direction

# ---- People ----
everything => the full scope | everything, end-to-end
nothing => zero deliverables
something => an initiative
anything => any deliverable
everybody, everyone, all of us => all key stakeholders
nobody, no one => zero stakeholders
somebody, someone => a key stakeholder
people => stakeholders | talent
person => individual contributor
guys, you guys, yall, ya ll => team | fam
team => tiger team
mom, mum, mother, mommy, mama => my Chief Household Officer
dad, father, daddy, papa => my household CFO
parents => my board of directors
grandma, grandmother, grandpa, grandfather, granny => my founding advisor
grandparents => my founding advisory board
brother, sister, bro, sis => my legacy co-founder
siblings, brothers, sisters => my legacy co-founders
family => core stakeholders | my personal org chart
kid, child => junior team member
kids, children => junior team members
baby => our newest hire
friends => valued connections in my network | my personal network
best friend, bestie, bff => my most strategic partnership
boyfriend, girlfriend, bf, gf => my strategic partner
husband, wife, spouse, hubby => my co-founder in life
partner => strategic partner
crush => high-priority prospect
ex => former strategic partner
dog, puppy, doggo => four-legged stakeholder
dogs, puppies => four-legged stakeholders
cat, kitten, kitty => feline stakeholder
cats, kittens => feline stakeholders
pet, pets => non-human stakeholder ; non-human stakeholders
neighbor, neighbour => adjacent stakeholder
neighbors, neighbours => adjacent stakeholders
stranger, strangers => untapped network connection ; untapped network connections
enemy, rival => competitor
enemies, rivals => competitors
hater, haters => detractor ; detractors
customer, client => key account
customers, clients => key accounts
manager => my people leader
coworkers, colleagues => cross-functional partners
colleague => cross-functional partner
idiot => low performer
genius => visionary thought leader
goat => thought leader

# ---- School ----
teacher, professor, prof, tutor, sir, miss => leadership | senior leadership
teachers, professors => senior leadership
principal, headmaster, headteacher, dean => the C-suite
student => team member
students => team members
classmate, classmates => peer ; peers
homework, hw => after-hours deliverables
assignment, assignments => deliverable ; deliverables
project, projects => initiative ; initiatives
essay, essays => long-form written deliverable ; long-form written deliverables
paper => white paper
test, exam, quiz, midterm, final exam => assessment | performance audit
tests, exams, quizzes, finals => assessments
grade, grades => performance metric ; KPIs
class, course => learning session
classes, courses => learning sessions
lecture, lesson => knowledge transfer session
lectures, lessons => knowledge transfer sessions
school => my learning organization | the institution
college, university, uni => my upskilling accelerator
high school => the early-stage incubator
textbook, book => knowledge asset
textbooks, books => knowledge assets
notes => documentation
backpack, bag => mobile asset storage
pencil, pen => writing tool
calculator => computational tooling
library => knowledge hub
classroom => learning environment
cafeteria, canteen => on-site catering
semester, term => fiscal half
graduate, graduates, graduated, graduating => level up ; levels up ; leveled up ; leveling up
study, studies, studied, studying => upskill ; upskills ; upskilled ; upskilling
learn, learns, learned, learnt, learning => upskill ; upskills ; upskilled ; upskilled ; upskilling
teach, teaches, taught, teaching => enable ; enables ; enabled ; enabling
cram, crammed, cramming => run a knowledge-onboarding sprint ; ran a knowledge-onboarding sprint ; running a knowledge-onboarding sprint
cheat, cheats, cheated, cheating => leverage unconventional methods ; leverages unconventional methods ; leveraged unconventional methods ; leveraging unconventional methods
skip, skips, skipped, skipping => deprioritize ; deprioritizes ; deprioritized ; deprioritizing
math, maths => quantitative frameworks
science => R&D
history => historical learnings
english => communication skills
pe, gym class => the mandatory wellness program
bus stop => transit hub
uniform => dress code compliance attire
due => scheduled for delivery
failed => failed forward

# ---- Work & office ----
job => role
jobs => roles
my work => my output
at work => in the office | on the clock
work, works, worked, working => drive impact ; drives impact ; drove impact ; driving impact
work on, working on, worked on => drive ; driving ; drove
hard work => grind
work hard, working hard, worked hard => grind ; grinding ; grinded
office => HQ
meetings => alignment touchpoints | syncs
a call => a quick sync
calls => syncs
call me => let's hop on a quick call
emails => asynchronous touchbases
emailed => sent an async touchbase to
message, text => ping
messages, texts => pings
texted, messaged => pinged
texting, messaging => pinging
reply, replies, replied, replying => circle back ; circles back ; circled back ; circling back
ask, asks, asked, asking => reach out to ; reaches out to ; reached out to ; reaching out to
tell, tells, told, telling => communicate to ; communicates to ; communicated to ; communicating to
say, says, said, saying => articulate ; articulates ; articulated ; articulating
talk, talks, talked, talking => sync ; syncs ; synced ; syncing
talk to, talked to, talking to, speak to, spoke to => sync with ; synced with ; syncing with ; sync with ; synced with
explain, explains, explained, explaining => unpack ; unpacks ; unpacked ; unpacking
listen, listened, listening => actively listen ; actively listened ; actively listening
agree, agrees, agreed => align ; aligns ; aligned
argue, argues, argued, arguing => push back ; pushes back ; pushed back ; pushing back
fight, fights, fought, fighting => robust discussion ; robust discussions ; had a robust discussion ; having a robust discussion
complain, complains, complained, complaining => provide feedback ; provides feedback ; provided feedback ; providing feedback
yell, yelled, yelling, scream, screamed, screaming => escalate ; escalated ; escalating ; escalate ; escalated ; escalating
think about, thinking about, thought about => ideate on ; ideating on ; ideated on
@i think so => my hypothesis is yes
i think => my hypothesis is | from where I'm sitting, | I'd posit that
i feel like => my gut instinct is that
i guess => my data-informed hypothesis is
know, knows, knew => have visibility on ; has visibility on ; had visibility on
you know => as you're aware
@i know => I have full visibility on that
understand, understood => have alignment on ; had alignment on
@i understand, i get it, got it, gotcha => I hear you, let's action it | Understood, will action
forget, forgets, forgot, forgotten, forgetting => lose visibility on ; loses visibility on ; lost visibility on ; lost visibility on ; losing visibility on
remember, remembered => keep top of mind ; kept top of mind
try, tries, tried, trying => pilot ; pilots ; piloted ; piloting
try to, tried to, trying to => explore opportunities to ; explored opportunities to ; exploring opportunities to
fix, fixes, fixed, fixing => remediate ; remediates ; remediated ; remediating
broken => non-operational
broke => pre-revenue
build, builds, built, building => architect ; architects ; architected ; architecting
make, makes, made, making => build ; builds ; built ; building
create, creates, created, creating => spin up ; spins up ; spun up ; spinning up
get, gets, got, getting => secure ; secures ; secured ; securing
get up, got up, getting up, wake up, woke up, waking up => come online ; came online ; coming online ; come online ; came online ; coming online
give, gives, gave, given, giving => provide ; provides ; provided ; provided ; providing
buy, buys, bought, buying => invest in ; invests in ; invested in ; investing in
sell, sells, sold, selling => monetize ; monetizes ; monetized ; monetizing
spend, spends, spent, spending => deploy ; deploys ; deployed ; deploying
pay, pays, paid, paying => fund ; funds ; funded ; funding
win, wins, won, winning => crush it ; crushes it ; crushed it ; crushing it
lose, loses, lost, losing => experience a setback with ; experiences a setback with ; experienced a setback with ; experiencing a setback with
crushed it, killed it, nailed it, slayed => exceeded every KPI
slay => crush it
eat, eats, ate, eaten, eating => consume ; consumes ; consumed ; consumed ; consuming
drink, drank, drinking => hydrate with ; hydrated with ; hydrating with
a drink => a liquid refresh
cook, cooks, cooked, cooking => manufacture ; manufactures ; manufactured ; manufacturing
sleep, sleeps, slept, sleeping => recharge ; recharges ; recharged ; recharging
napping => running an offline recharge sprint
go home, went home, going home => log off for the day ; logged off for the day ; logging off for the day
@i have to go, i gotta go, gotta go, i need to go => I have a hard stop | I need to drop for another commitment
leave, leaves, leaving => exit ; exits ; exiting
play, plays, played, playing => engage in ; engages in ; engaged in ; engaging in
watch, watches, watched, watching => consume ; consumes ; consumed ; consuming
watch tv, watching tv, watched tv => consume long-form content ; consuming long-form content ; consumed long-form content
i want to => I'm looking to | my objective is to
i want => I'm targeting
want, wants, wanted => have an appetite for ; has an appetite for ; had an appetite for
want to, wants to, wanted to, wanna => have an appetite to ; has an appetite to ; had an appetite to ; have an appetite to
i need to => I have a critical action item to
need, needs, needed => require ; requires ; required
need to, needs to, needed to => have an action item to ; has an action item to ; had an action item to
i have to => I'm on the hook to
have to, has to, had to, gotta => have a mandate to ; has a mandate to ; had a mandate to ; have a mandate to
love, loves, loved, loving => deeply value ; deeply values ; deeply valued ; deeply valuing
@i love you, love you, ily => I see a lot of long-term value in our partnership
i love => I'm passionate about
i like => I see a lot of value in
i like to => I find a lot of value in being able to
i really like => I see massive value in
hate, hates, hated, hating => have strong feedback about ; has strong feedback about ; had strong feedback about ; having strong feedback about
help, helps, helped, helping => support ; supports ; supported ; supporting
help me => support me
can you => would you have the bandwidth to
could you => would you have capacity to
use, uses, used, using => leverage ; leverages ; leveraged ; leveraging
used to => historically would
start, starts, started, starting, begin, began => kick off ; kicks off ; kicked off ; kicking off ; kick off ; kicked off
finish, finishes, finished, finishing => wrap up ; wraps up ; wrapped up ; wrapping up
done => delivered | shipped
@im done, im finished, i am done => I've closed the loop on this
stop, stops, stopped, stopping => sunset ; sunsets ; sunsetted ; sunsetting
change, changes, changed, changing => pivot ; pivots ; pivoted ; pivoting
plan, plans, planned, planning => roadmap ; roadmaps ; roadmapped ; roadmapping
decide, decided => make a strategic call ; made a strategic call
choose, chose, pick, picked => prioritize ; prioritized ; prioritize ; prioritized
waiting => holding space
waited => held space
hurry => accelerate
@hurry up => let's accelerate timelines
look at, looked at, looking at => deep-dive into ; deep-dived into ; deep-diving into
look for, looked for, looking for => source ; sourced ; sourcing
check, checked, checking => audit ; audited ; auditing
find, finds, found, finding => surface ; surfaces ; surfaced ; surfacing
show, shows, showed, shown, showing => showcase ; showcases ; showcased ; showcased ; showcasing
share, shares, shared, sharing => cascade ; cascades ; cascaded ; cascading
steal, steals, stole, stolen, stealing => reallocate ; reallocates ; reallocated ; reallocated ; reallocating
borrow, borrowed => temporarily leverage ; temporarily leveraged
meet, met => connect with ; connected with
hang out, hung out, hanging out, chilling => connect offline ; connected offline ; connecting offline ; recharging
relax, relaxed, relaxing, chill => recharge ; recharged ; recharging ; recharge
cry, cries, cried, crying => process feedback ; processes feedback ; processed feedback ; processing feedback
laugh, laughed, laughing => lean into the culture ; leaned into the culture ; leaning into the culture
procrastinate, procrastinated, procrastinating => strategically defer ; strategically deferred ; strategically deferring
mess up, messed up, screw up, screwed up => create a learning opportunity ; created a learning opportunity ; create a learning opportunity ; created a learning opportunity
@i messed up, i screwed up => I've identified a key learning opportunity
improve, improved, improving => optimize ; optimized ; optimizing
move on, moved on, moving on => pivot ; pivoted ; pivoting
move, moved, moving => relocate ; relocated ; relocating
ghost, ghosted, ghosting => put on indefinite hold ; put on indefinite hold ; putting on indefinite hold
flex, flexing => showcase ; showcasing
quit, quits, quitting => step away from ; steps away from ; stepping away from
lying => framing an alternative narrative
lied => framed an alternative narrative
sick of => over-indexed on
fired => transitioned out
got fired => was transitioned to pursue other opportunities
laid off => impacted by a strategic restructuring

# ---- Adjectives ----
good => solid | high-impact | best-in-class
great => world-class | game-changing
awesome, amazing, incredible => next-level | game-changing
cool => on-brand | innovative
nice => solid
bad => suboptimal
terrible, awful, horrible, trash => significantly below expectations
worst => least optimized
best => best-in-class
better => more optimized
worse => less optimized
perfect => fully optimized
weird, strange, odd => non-standard | unconventional
crazy, insane, wild => disruptive
boring => low-engagement
fun => high-engagement | culture-positive
funny, hilarious => highly engaging
annoying => friction-heavy
cute => on-brand
ugly => in need of a brand refresh
pretty, beautiful, gorgeous => aesthetically on-brand
smart, clever => strategic | high-performing
stupid, dumb => suboptimal | not best-in-class
rude, mean => direct | low-empathy
happy, glad => energized | aligned
sad, upset, depressed => navigating headwinds
mad, pissed => passionate
exhausted => fully depleted of bandwidth
sleepy => low on bandwidth
hungry, starving => nutritionally under-resourced
stressed => at max capacity
scared, afraid => risk-averse
nervous => cautiously optimistic
excited, hyped => energized | fired up
worried => proactively risk-assessing
sick => operating at reduced capacity
fine => within acceptable parameters
rich => well-capitalized
poor => resource-constrained
free => zero-cost | complimentary
new => next-gen
old => legacy
simple => lean | straightforward
hard => challenging | high-effort
is hard, was hard => is a heavy lift ; was a heavy lift
is really hard, is so hard, is very hard => is a massive lift
was really hard, was so hard, was very hard => was a massive lift
difficult => high-effort
important => mission-critical
huge => massive-scale
tiny => micro
wrong => misaligned
correct, right => validated
true => validated
fake => not grounded in data
ready => primed for launch
messy => in an active iteration phase
dirty => in need of a refresh
clean => streamlined
full => at capacity
empty => under-utilized
loud => high-visibility
quiet => low-profile
favorite, favourite, fav => top-priority
lucky => strategically well-positioned
alone => operating independently
together => cross-functionally
lit, fire => high-impact
sus => not fully aligned
cringe => off-brand
lowkey => quietly
highkey => publicly and at scale
vibe, vibes => culture ; culture fit

# ---- Nouns ----
problem, problems => challenge | opportunity for growth ; challenges | opportunities for growth
issue, issues => headwind ; headwinds
mistake, mistakes => learning moment ; learning moments
failure, failures => learning opportunity ; learning opportunities
success => win
goal, goals => OKR | north star ; OKRs | north stars
result, results => outcome ; outcomes
ideas => value-add initiatives
questions => asks
answer => key takeaway
answers => learnings
reason, reasons => rationale ; rationales
thing => action item
things, stuff => action items | deliverables
cash => liquidity
bills => operating expenses
rent => real estate overhead
price, cost => investment
prices, costs => investments
salary, paycheck, wage => total compensation package
promotion => expanded scope
interview => culture-fit conversation
home => HQ | my remote HQ
at home => from my remote HQ
house => base of operations
room, bedroom => personal workspace
bed => horizontal workstation
couch, sofa => lounge-based ideation zone
kitchen => on-site catering hub
bathroom, toilet => wellness room
car => mobility solution
bus, train => mass transit solution
bike => sustainable mobility solution
phone => primary device
phones => devices
laptop, computer, pc => workstation
internet, wifi, wi fi => connectivity
game => engagement experience
games => engagement experiences
video games, videogames => interactive strategy simulations
tv, television => long-form content platform
movie, movies, netflix, youtube, tiktok => long-form content ; long-form content ; a content platform ; a content platform ; short-form content research
music => audio-based productivity enablement
social media => my personal brand channels
food => fuel
breakfast => morning fuel-up
dinner => end-of-day refuel
pizza => scalable team nutrition
water => hydration solution
beer, wine, alcohol, drinks => liquid alignment
gym => wellness center
vacation, holiday, holidays => PTO
trip => off-site
birthday => personal annual milestone
life => personal roadmap
world => global ecosystem
future => long-term roadmap
dream, dreams => vision ; long-term vision
experience => journey
weather => macro environment
rain => headwinds
sunny => full of tailwinds
drama => stakeholder misalignment
secret => need-to-know information
rules => governance framework
mess => active iteration phase
chores => operational backlog
lies => alternative narratives
truth => single source of truth
opinion => perspective | hot take
advice => mentorship
news => key updates
headache => cognitive bandwidth constraint
keys => access credentials
`;

// Full-sentence translations that aren't on the category pages (still exact-matched).
const EXACT_EXTRAS = `
why => What's the business case here?
what => Could you unpack that a bit more?
how => What's the execution strategy here?
huh => Could you level-set for me?
whats up, sup, wassup => What's on your roadmap today?
how are you, how are you doing, hows it going => How are you navigating this quarter?
good morning => Rise and grind, team ☀️ Let's make today count.
good night => Logging off to recharge for tomorrow's deliverables 🌙
i quit => After much reflection, I've made the difficult decision to start my next chapter.
help me => Requesting cross-functional support at your earliest convenience.
im sorry => I take full ownership and I'm committed to doing better going forward.
shut up => Let's take this offline.
go away => I'm not taking new meetings at this time.
im tired => I'm currently running on very low bandwidth.
im bored => I'm actively seeking more stretch opportunities.
im busy => I'm at full capacity right now. Can we circle back?
im late => I'll be joining on a slightly adjusted timeline.
i dont care => That's not a priority for me this quarter.
its not my fault => I wasn't the directly responsible individual on that one.
who cares => I'm not sure this moves the needle.
youre fired => We've decided to move forward without you. Wishing you the best in your next chapter.
i got the job, i got a job, im hired => Thrilled to announce I'm starting a new position! 🎉
i love my job => I'm deeply passionate about the mission and grateful to drive impact every day 🙏
i need help => I could use some cross-functional support on this.
its fine => It's within acceptable parameters.
it doesnt matter => It's not a needle-mover.
i dont want to => That doesn't align with my current priorities.
no thanks, no thank you => I'll pass for now, but let's keep the door open.
im on my way, omw => I'm actively in transit to the touchpoint.
where are you => What's your current ETA to the touchpoint?
what time is it => Where are we in the business day?
im home => I've arrived at my remote HQ.
i have a headache => I'm experiencing some cognitive bandwidth constraints.
im at school => I'm currently on-site at my learning organization.
school is boring => My learning organization has some engagement challenges.
i hate school => I'm not fully aligned with my current learning organization's vision.
i hate mondays => I'm still optimizing my start-of-week ramp-up process.
this is boring => This initiative has low engagement metrics.
this is stupid => I'm not sure this aligns with best practices.
this sucks => This is presenting significant headwinds.
that sucks => That's a tough headwind. Sending positive energy 🙏
im stuck => I'm currently blocked.
i need a break => I'm requesting a brief recharge window to maximize long-term output.
lets go => Let's hit the ground running! 🚀
lets eat => Let's align on a refuel touchpoint.
im so done => I've fully reached capacity on this initiative.
i messed up, i screwed up => I've identified a key learning opportunity.
my bad => I take full ownership of that.
nice => Love this. 🔥
lol, haha, lmao => 😅 Love the energy here.
same, me too => +1, fully aligned.
deal => Let's lock in alignment.
whatever => I'm agnostic on that.
congrats, congratulations => Congrats on this incredible milestone! 🎉
good job, well done, nice job, great job, nice work, great work => Great job driving impact here! 🚀
what do you mean => Could you unpack that a bit further?
i dont get it => Could you help me get fully aligned on the context here?
can you repeat that => Could you level-set for those who missed it?
pay me => Let's discuss aligning my compensation with the value I'm driving.
is it friday yet => How close are we to the end of the sprint?
its friday => TGIF: closing out a high-impact sprint 🎯
its monday => Happy Monday! Excited to kick off a new sprint 🚀
i dont know => Let me take that offline and circle back with some data.
idk => Let me take that offline and circle back.
ok, okay, k => Aligned.
thanks, thank you => Thanks for your partnership on this 🙏
hi, hello, hey => Hope this message finds you well!
bye, goodbye => Signing off for now. Let's circle back soon!
no => That's not something we can action right now.
i forgot my homework => I lost visibility on my after-hours deliverables.
the test was hard => The assessment was a heavy lift.
the test was easy => The assessment was low-hanging fruit.
i finished my homework => I closed the loop on all after-hours deliverables ahead of schedule.
i have a test tomorrow => I have a performance audit scheduled for next business day.
i have so much homework => My after-hours deliverable pipeline is at capacity.
can i copy your homework => Would you be open to sharing your learnings so I can leverage best practices?
i hate my teacher => I have some misalignment with leadership that I'm working through.
i was absent => I was out of office.
i was sick => I was operating at reduced capacity and prioritizing wellness.
im failing => I'm currently below target on key performance metrics.
i passed => I successfully cleared the assessment and hit all KPIs 🎯
i got detention => I've been enrolled in a post-hours reflection workshop.
im going to sleep => I'm logging off to optimize tomorrow's performance.
i cant sleep => I'm experiencing some after-hours ideation overflow.
im cold => My thermal resources are currently under-allocated.
im hot => I'm running above optimal operating temperature.
im sick of this => I'm ready to pivot to a new initiative.
its raining => Weather conditions are presenting headwinds.
i need coffee => I require liquid productivity enablement to stay at peak performance.
`;

// Single words from data.js that are too ambiguous to swap mid-sentence (still exact-matched alone).
const MIDSENTENCE_SKIP = new Set(["do", "no", "wait", "think", "guess", "copy", "lie"]);

// Clause boundary words: a clause-only phrase can sit next to these.
const CONJ = new Set(["and", "but", "so", "because", "cuz", "bc", "lol", "haha", "lmao", "though", "or", "then",
  "when", "while", "if", "tbh", "honestly", "today", "yesterday", "tomorrow", "again", "now", "too", "already",
  "anyway", "anyways", "also", "um", "uh", "well", "ok", "okay", "yeah", "yes", "no", "like", "omg", "btw", "ngl"]);

// Unchanged words get their apostrophes restored for polish.
const POLISH = {
  i: "I", im: "I'm", ive: "I've", dont: "don't", cant: "can't", wont: "won't", didnt: "didn't", doesnt: "doesn't",
  isnt: "isn't", wasnt: "wasn't", arent: "aren't", werent: "weren't", couldnt: "couldn't", shouldnt: "shouldn't",
  wouldnt: "wouldn't", havent: "haven't", hasnt: "hasn't", thats: "that's", whats: "what's", youre: "you're",
  theyre: "they're", lets: "let's", hes: "he's", shes: "she's", theres: "there's", u: "you", ur: "your",
  gonna: "going to", wanna: "want to", cuz: "because", r: "are",
};

// Token-level slang normalisation (applied to both dictionary keys and input, so they always agree).
const SLANG = { u: "you", ur: "your", r: "are", pls: "please", plz: "please", thx: "thanks", gonna: "going to",
  wanna: "want to", gotta: "got to", yall: "you all", cos: "because", coz: "because" };

// Phrase-level contraction normalisation: "I am" == "I'm" == "Im".
const CONTRACTIONS = [
  ["i am", "im"], ["do not", "dont"], ["does not", "doesnt"], ["did not", "didnt"], ["cannot", "cant"],
  ["can not", "cant"], ["will not", "wont"], ["is not", "isnt"], ["are not", "arent"], ["was not", "wasnt"],
  ["were not", "werent"], ["have not", "havent"], ["has not", "hasnt"], ["could not", "couldnt"],
  ["would not", "wouldnt"], ["should not", "shouldnt"], ["it is", "its"], ["that is", "thats"],
  ["what is", "whats"], ["you are", "youre"], ["they are", "theyre"], ["we are", "were"], ["i have", "ive"],
  ["let us", "lets"], ["there is", "theres"], ["he is", "hes"], ["she is", "shes"], ["how is", "hows"],
].map(([a, b]) => [new RegExp(`(^| )${a}(?= |$)`, "g"), `$1${b}`]);

const OPENERS_MILD = ["Circling back on this,", "Just to level-set,", "From a strategic standpoint,",
  "To provide some visibility,", "Big picture,", "From a holistic perspective,", "Quick update:",
  "Looping everyone in:", "Taking a 30,000-foot view,", "Per my last message,"];
const OPENERS_HYPE = ["I'm humbled to share that", "Unpopular opinion:", "Here's what nobody tells you:",
  "Today I learned something powerful:", "I'm thrilled to announce that", "Story time 🧵:",
  "This is a hard post to write, but", "I never thought I'd post this, but", "Hot take:",
  "In the spirit of radical candor,"];
const CLOSERS = ["going forward", "at the end of the day", "to move the needle", "to drive synergy",
  "in a scalable way", "to unlock value", "with full alignment from key stakeholders", "to maximize ROI",
  "in this ever-evolving landscape", "for maximum impact", "across all verticals", "per our north star",
  "as we double-click on our core competencies", "while staying agile"];
const POST_ENDINGS = ["And that's what leadership looks like.", "Agree? 👇", "Thoughts? 💭", "Let that sink in.",
  "What would you have done? 👇", "Grateful for the journey. 🙏", "This is the future of work."];
const EMOJIS = ["🚀", "💡", "🙏", "📈", "🔥", "💪", "✨", "🎯"];
const HASHTAGS = ["#Leadership", "#GrowthMindset", "#Synergy", "#Hustle", "#ThoughtLeadership", "#Innovation",
  "#Grateful", "#Agile", "#FutureOfWork", "#Blessed", "#KPIs", "#Disruption", "#PersonalBranding",
  "#MondayMotivation", "#OpenToWork", "#Learnings"];

// ---------------------------------------------------------------------------
const WORD_RE = /[\p{L}\p{N}'’‘`]+/gu;

function normPhrase(text) {
  let s = text.toLowerCase().replace(/['’‘`]/g, "").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
  if (!s) return "";
  s = s.split(" ").map(w => SLANG[w] || w).join(" ");
  for (const [re, rep] of CONTRACTIONS) s = s.replace(re, rep);
  return s;
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function parseRules(text, onEntry) {
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const mode = line[0] === "@" ? "clause" : line[0] === "^" ? "start" : "free";
    const [lhs, rhs] = line.replace(/^[@^]/, "").split("=>");
    if (!rhs) continue;
    const forms = lhs.split(",").map(s => s.trim()).filter(Boolean);
    const outs = rhs.split(";").map(s => s.split("|").map(a => a.trim()).filter(Boolean));
    forms.forEach((f, i) => onEntry(f, outs[i] || outs[outs.length - 1], mode));
  }
}

// Build dictionaries ---------------------------------------------------------
const EXACT = new Map();   // normalized sentence -> { text, category }
const SWAPS = new Map();   // normalized phrase   -> { free: [alts], clause: [alts] }
let MAX_WORDS = 1;

function addSwap(phrase, alts, mode) {
  const key = normPhrase(phrase);
  if (!key) return;
  const e = SWAPS.get(key) || {};
  e[mode] = alts;
  SWAPS.set(key, e);
  MAX_WORDS = Math.max(MAX_WORDS, phrase.split(/\s+/).length + 1);
}

for (const cat of CATEGORIES) {
  for (const [plain, corp] of cat.entries) {
    const key = normPhrase(plain);
    if (!EXACT.has(key)) EXACT.set(key, { text: corp, category: `${cat.emoji} ${cat.name}` });
    const words = key.split(" ");
    if (words.length > 1) addSwap(plain, [corp], "clause");
    else if (!MIDSENTENCE_SKIP.has(key)) addSwap(plain, [corp], "free");
  }
}
parseRules(SWAP_RULES, addSwap);
parseRules(EXACT_EXTRAS, (form, alts) => {
  const key = normPhrase(form);
  if (!EXACT.has(key)) EXACT.set(key, { text: alts[0], category: "🤖 Translator extras" });
});

// Translation ----------------------------------------------------------------
const PUNCT_BOUNDARY = /[,;:.!?()"“”—–]/;

function lowerFirst(s) {
  if (/^(I\b|I'|[A-Z][^a-z\s]|[A-Z][a-z]*[A-Z])/.test(s)) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function capFirst(s) {
  const i = s.search(/[\p{L}\p{N}]/u);
  return i < 0 ? s : s.slice(0, i) + s.charAt(i).toUpperCase() + s.slice(i + 1);
}

function fixArticles(s) {
  return s.replace(/\b([Aa])(n?)(\s+)([\p{L}\p{N}]+)/gu, (m, a, n, sp, w) => {
    const vowel = (/^[aeiou]/i.test(w) && !/^(uni|use|usu|eu|one|once)/i.test(w)) ||
                  /^(hour|honest|honor|heir)/i.test(w) || /^[AEFHILMNORSX][A-Z]/.test(w);
    return a + (vowel ? "n" : "") + sp + w;
  });
}

function tidy(s) {
  return s
    .replace(/([,:;])(\s*[,:;])+/g, "$1")
    .replace(/,(\s*[.!?])/g, "$1")
    .replace(/:\s*([.!?])/g, "$1")
    .replace(/\s+([,.!?;:])(?!\S*[)])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\b(the|a|an|your|our|his|her|their|my)\s+(my|the|our)\s/gi, "$2 ")
    .replace(/^[,;:\s]+/, "")
    .trim();
}

function translateSentence(sentence, idx, level, seed) {
  const key = normPhrase(sentence);
  if (!key) return { text: sentence, exact: false, swaps: 0 };
  const hit = EXACT.get(key);
  if (hit) return { text: hit.text, exact: true, category: hit.category, swaps: 0 };

  const words = [], gaps = [];
  let last = 0, m;
  WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(sentence))) {
    gaps.push(sentence.slice(last, m.index));
    words.push(m[0]);
    last = m.index + m[0].length;
  }
  gaps.push(sentence.slice(last));
  const n = words.length;
  const tok = w => normPhrase(w);
  const startOK = i => i === 0 || PUNCT_BOUNDARY.test(gaps[i]) || CONJ.has(tok(words[i - 1]));
  const endOK = j => j === n || PUNCT_BOUNDARY.test(gaps[j]) || CONJ.has(tok(words[j]));
  const pick = (alts, salt) => alts[hash(seed + "|" + salt) % alts.length];

  let out = "", swaps = 0, i = 0;
  while (i < n) {
    let maxJ = i + 1;
    while (maxJ < n && maxJ - i < MAX_WORDS && /^[\s-]+$/.test(gaps[maxJ])) maxJ++;
    let found = null;
    for (let j = maxJ; j > i; j--) {
      const e = SWAPS.get(normPhrase(words.slice(i, j).join(" ")));
      if (!e) continue;
      const alts = (e.clause && startOK(i) && endOK(j)) ? e.clause : (e.start && startOK(i)) ? e.start : e.free;
      if (alts) { found = { j, alts, k: words.slice(i, j).join(" ").toLowerCase() }; break; }
    }
    if (found) {
      const rep = pick(found.alts, found.k);
      out += gaps[i] + (i === 0 ? rep : lowerFirst(rep));
      swaps++;
      i = found.j;
    } else {
      const w = words[i], t = w.toLowerCase().replace(/['’‘`]/g, "");
      out += gaps[i] + (POLISH[t] && !/['’]/.test(w) ? POLISH[t] : w === "i" ? "I" : w);
      i++;
    }
  }
  out += gaps[n];
  out = tidy(fixArticles(out));

  // Jargon padding --------------------------------------------------------
  const rnd = salt => hash(seed + "|" + idx + "|" + salt) / 4294967296;
  const ends = out.match(/([.!?…]+)\s*$/);
  let body = ends ? out.slice(0, ends.index).trimEnd() : out;
  const QUESTION = /^(can|could|would|will|do|does|did|is|are|was|were|should|what|whats|why|how|hows|where|when|who|whos|which|may|have|has)\b/;
  let end = ends ? ends[1] : QUESTION.test(key) ? "?" : ".";
  const addOpener = list => { body = list[Math.floor(rnd("op") * list.length)] + " " + lowerFirst(body); };
  const addCloser = () => { if (end !== "?") body += " " + CLOSERS[Math.floor(rnd("cl") * CLOSERS.length)]; };

  if (level === 1) {
    if (swaps === 0) addOpener(OPENERS_MILD);
  } else if (level === 2) {
    if (swaps === 0 || (idx === 0 && rnd("o?") < 0.5)) addOpener(OPENERS_MILD);
    if (rnd("c?") < 0.45) addCloser();
  } else {
    if (idx === 0) addOpener(OPENERS_HYPE);
    else if (swaps === 0) addOpener(OPENERS_MILD);
    if (rnd("c?") < 0.7) addCloser();
    if (rnd("e?") < 0.6) end += " " + EMOJIS[Math.floor(rnd("em") * EMOJIS.length)];
  }
  return { text: capFirst(tidy(body) + end), exact: false, swaps };
}

function translate(text, level = 2, seed = 0) {
  const result = { text: "", exactMatches: [], swaps: 0, sentences: 0 };
  if (!text.trim()) return result;

  // Whole input matches a known entry exactly → return it untouched.
  const whole = EXACT.get(normPhrase(text));
  if (whole) {
    result.text = whole.text;
    result.exactMatches.push(whole.category);
    result.sentences = 1;
    return result;
  }

  let idx = 0, anyNonExact = false;
  const lines = text.split("\n").map(line => {
    const parts = line.split(/(?<=[.!?…])\s+/).filter(p => p.trim());
    return parts.map(p => {
      const r = translateSentence(p.trim(), idx++, level, seed);
      result.sentences++;
      result.swaps += r.swaps;
      if (r.exact) result.exactMatches.push(r.category); else anyNonExact = true;
      return r.text;
    }).join(" ");
  });
  result.text = lines.join("\n").trim();

  if (level === 3 && anyNonExact) {
    const r = k => hash(seed + "|post|" + k);
    const tags = [];
    for (let k = 0; tags.length < 3 && k < 20; k++) {
      const t = HASHTAGS[r(k) % HASHTAGS.length];
      if (!tags.includes(t)) tags.push(t);
    }
    result.text += "\n\n" + POST_ENDINGS[r("end") % POST_ENDINGS.length] + "\n\n" + tags.join(" ");
  }
  return result;
}

const DICTIONARY_SIZE = { exact: EXACT.size, swaps: SWAPS.size };
