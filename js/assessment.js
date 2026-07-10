const OPTIONS = [
    {
        v: 0,
        l: 'Not at all'
    },
    {
        v: 1,
        l: 'Several days'
    },
    {
        v: 2,
        l: 'More than half the days'
    },
    {
        v: 3,
        l: 'Nearly every day'
    }
];

const PHQ9 = [
    'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
    'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
    'Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?',
    'Over the last 2 weeks, how often have you felt tired or had little energy?',
    'Over the last 2 weeks, how often have you had poor appetite or been overeating?',
    'Over the last 2 weeks, how often have you felt bad about yourself — or that you are a failure or have let yourself or your family down?',
    'Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading or watching TV?',
    'Over the last 2 weeks, how often have you been moving or speaking so slowly that others noticed? Or been so fidgety or restless you moved more than usual?',
    'Over the last 2 weeks, how often have you had thoughts that you would be better off dead, or of hurting yourself?'
];

const GAD7 = [
    'Over the last 2 weeks, how often have you been bothered by feeling nervous, anxious, or on edge?',
    'Over the last 2 weeks, how often have you been bothered by not being able to stop or control worrying?',
    'Over the last 2 weeks, how often have you been bothered by worrying too much about different things?',
    'Over the last 2 weeks, how often have you been bothered by trouble relaxing?',
    'Over the last 2 weeks, how often have you been bothered by being so restless it is hard to sit still?',
    'Over the last 2 weeks, how often have you been bothered by becoming easily annoyed or irritable?',
    'Over the last 2 weeks, how often have you been bothered by feeling afraid as if something awful might happen?'
];

const ALL = [
    ...PHQ9.map(function (q, i) {
        return {
            q: q,
            section: 'PHQ-9',
            idx: i + 1,
            total: 9,
            step: 1
        };
    }),

    ...GAD7.map(function (q, i) {
        return {
            q: q,
            section: 'GAD-7',
            idx: i + 1,
            total: 7,
            step: 2
        };
    })
];

let cur = 0;
let answers = new Array(ALL.length).fill(null);

/* ── Session check ── */

const sess = JSON.parse(localStorage.getItem('mb_session') || 'null');

if (!sess) {
    const guestBanner = document.getElementById('guestBanner');

    if (guestBanner) {
        guestBanner.style.display = 'flex';
    }
} else {
    const userCard = document.getElementById('userCard');
    const userCardName = document.getElementById('userCardName');

    if (userCard) {
        userCard.style.display = 'block';
    }

    if (userCardName) {
        userCardName.textContent = sess.firstName + ' ' + sess.lastName;
    }

    loadHistory();
}

function doLogout(event) {
    event.preventDefault();

    localStorage.removeItem('mb_session');

    location.href = 'login.html';
}

/* ── Render question ── */

function render() {
    const d = ALL[cur];

    const qMeta = document.getElementById('qMeta');
    const qText = document.getElementById('qText');
    const progFill = document.getElementById('progFill');
    const optList = document.getElementById('optList');
    const btnNext = document.getElementById('btnNext');
    const btnPrev = document.getElementById('btnPrev');

    if (!d || !qMeta || !qText || !progFill || !optList || !btnNext || !btnPrev) {
        return;
    }

    qMeta.textContent = 'Question ' + d.idx + ' of ' + d.total + ' · ' + d.section;
    qText.textContent = d.q;
    progFill.style.width = (((d.idx - 1) / d.total) * 100) + '%';

    optList.innerHTML = '';

    OPTIONS.forEach(function (opt) {
        const label = document.createElement('label');

        label.className = 'option-label' + (answers[cur] === opt.v ? ' selected' : '');

        label.innerHTML =
            '<input type="radio" name="q' + cur + '" value="' + opt.v + '"' +
            (answers[cur] === opt.v ? ' checked' : '') +
            '>' +
            '<span class="radio-dot"></span>' +
            '<span>' + opt.l + '</span>';

        label.addEventListener('click', function () {
            choose(opt.v);
        });

        optList.appendChild(label);
    });

btnNext.disabled = answers[cur] === null;
btnPrev.style.visibility = cur === 0 ? 'hidden' : 'visible';

const sideProgressText = document.getElementById('sideProgressText');
const sideProgressPercent = document.getElementById('sideProgressPercent');
const sideProgressFill = document.getElementById('sideProgressFill');

const progressPercent = Math.round(((cur + 1) / ALL.length) * 100);

if (sideProgressText) {
    sideProgressText.textContent = 'Question ' + (cur + 1) + ' of ' + ALL.length;
}

if (sideProgressPercent) {
    sideProgressPercent.textContent = progressPercent + '%';
}

if (sideProgressFill) {
    sideProgressFill.style.width = progressPercent + '%';
}

updateSteps();

    
}


/* ── Choose answer ── */

function choose(value) {
    answers[cur] = value;

    const labels = document.querySelectorAll('.option-label');

    labels.forEach(function (label, index) {
        label.classList.toggle('selected', OPTIONS[index].v === value);
    });

    const btnNext = document.getElementById('btnNext');

    if (btnNext) {
        btnNext.disabled = false;
    }
}


/* ── Question navigation ── */

function nextQ() {
    if (answers[cur] === null) {
        return;
    }

    if (cur < ALL.length - 1) {
        cur++;
        render();
    } else {
        showResults();
    }
}

function prevQ() {
    if (cur > 0) {
        cur--;
        render();
    }
}

function retake() {
    cur = 0;
    answers.fill(null);

    const questionCard = document.getElementById('questionCard');
    const resultsPanel = document.getElementById('resultsPanel');

    if (questionCard) {
        questionCard.style.display = '';
    }

    if (resultsPanel) {
        resultsPanel.classList.remove('visible');
    }

    render();
}

/* ── Update step tracker ── */

function updateSteps() {
    const active = ALL[cur].step;

    for (let i = 1; i <= 4; i++) {
        const circle = document.getElementById('s' + i);
        const label = document.getElementById('sl' + i);

        if (!circle || !label) {
            continue;
        }

        circle.className = 'step-circle';
        label.className = 'step-label';

        if (i < active) {
            circle.classList.add('done');
            label.classList.add('done');
        } else if (i === active) {
            circle.classList.add('active');
            label.classList.add('active');
        }

        if (i < 4) {
            const line = document.getElementById('line' + i);

            if (line) {
                line.className = 'step-line' + (i < active ? ' done' : '');
            }
        }
    }
}


/* ── Score severity ── */

function getSeverity(score) {
    if (score <= 4) {
        return {
            label: 'Minimal or none',
            detail: 'Your responses suggest minimal depressive symptoms.',
            sev: 0
        };
    }

    if (score <= 9) {
        return {
            label: 'Mild',
            detail: 'Your responses suggest mild depressive symptoms. Consider talking to someone you trust.',
            sev: 1
        };
    }

    if (score <= 14) {
        return {
            label: 'Moderate',
            detail: 'Your responses suggest moderate symptoms. Speaking with a professional is recommended.',
            sev: 2
        };
    }

    if (score <= 19) {
        return {
            label: 'Moderately severe',
            detail: 'Your responses suggest moderately severe symptoms. Please reach out to a professional soon.',
            sev: 3
        };
    }

    return {
        label: 'Severe',
        detail: 'Your responses suggest severe symptoms. We strongly encourage you to seek professional support.',
        sev: 4
    };
}


/* ── Show results ── */

function showResults() {
    const questionCard = document.getElementById('questionCard');
    const resultsPanel = document.getElementById('resultsPanel');

    if (questionCard) {
        questionCard.style.display = 'none';
    }

    if (resultsPanel) {
        resultsPanel.classList.add('visible');
    }

    const phqScore = answers.slice(0, 9).reduce(function (total, value) {
        return total + (value ?? 0);
    }, 0);

    const severity = getSeverity(phqScore);

    const scoreNum = document.getElementById('scoreNum');
    const scoreLabel = document.getElementById('scoreLabel');
    const scoreDetail = document.getElementById('scoreDetail');

    if (scoreNum) {
        scoreNum.textContent = phqScore;
    }

    if (scoreLabel) {
        scoreLabel.textContent = severity.label;
    }

    if (scoreDetail) {
        scoreDetail.textContent = severity.detail;
    }

    for (let i = 1; i <= 3; i++) {
        const circle = document.getElementById('s' + i);
        const label = document.getElementById('sl' + i);
        const line = document.getElementById('line' + i);

        if (circle) {
            circle.className = 'step-circle done';
        }

        if (label) {
            label.className = 'step-label done';
        }

        if (line) {
            line.className = 'step-line done';
        }
    }

    const s4 = document.getElementById('s4');
    const sl4 = document.getElementById('sl4');

    if (s4) {
        s4.className = 'step-circle active';
    }

    if (sl4) {
        sl4.className = 'step-label active';
    }

    const savedNote = document.getElementById('savedNote');

    if (sess) {
        const key = 'mb_assessments_' + sess.username;
        const history = JSON.parse(localStorage.getItem(key) || '[]');

        history.unshift({
            date: new Date().toISOString(),
            phqScore: phqScore,
            severity: severity.label,
            sevLevel: severity.sev,
            answers: [...answers]
        });

        localStorage.setItem(key, JSON.stringify(history));

        if (savedNote) {
            savedNote.textContent = '✅ Results saved to your history.';
        }

        loadHistory();
    } else {
        if (savedNote) {
            savedNote.textContent = 'ℹ️ Log in to save your results and track your progress over time.';
        }
    }
}

/* ── Assessment history ── */

function loadHistory() {

    if (!sess) {
        return;
    }

    const key = "mb_assessments_" + sess.username;
    const history = JSON.parse(localStorage.getItem(key) || "[]");

    const section = document.getElementById("historySection");
    const content = document.getElementById("historyContent");

    if (!section || !content) {
        return;
    }

    section.style.display = "block";

    if (history.length === 0) {
        content.innerHTML =
            '<div class="no-history">' +
            'No assessments yet. Complete one above to see your history.' +
            '</div>';

        return;
    }

    const severityClasses = [
        "sev-0",
        "sev-1",
        "sev-2",
        "sev-3",
        "sev-4"
    ];

    let rows = "";

    history.forEach(function (item) {

        const date = new Date(item.date);

        const dateString = date.toLocaleDateString(
            "en-MY",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );

        const timeString = date.toLocaleTimeString(
            "en-MY",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        rows += `
            <tr>
                <td>
                    ${dateString}
                    <span style="color:#9ca3af;font-size:.8rem">
                        ${timeString}
                    </span>
                </td>

                <td>
                    ${item.phqScore} / 27
                </td>

                <td>
                    <span class="sev-badge ${severityClasses[item.sevLevel]}">
                        ${item.severity}
                    </span>
                </td>
            </tr>
        `;
    });

    content.innerHTML = `
        <table class="history-table">

            <thead>
                <tr>
                    <th>Date &amp; Time</th>
                    <th>PHQ-9 Score</th>
                    <th>Severity</th>
                </tr>
            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>
    `;
}


/* ── Initialize page ── */

document.addEventListener("DOMContentLoaded", function () {

    render();

    if (window.lucide) {
        lucide.createIcons();
    }

});