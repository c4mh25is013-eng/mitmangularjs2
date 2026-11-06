/**
 * UniRoll Academic Attendance & Shortage Warning System
 * Complete Vanilla JS Implementation for VS Code & Live Server
 */
var API_URL="https://yiijyfwleunmnekjydtq.supabase.co/rest/v1/attendance";
var API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpaWp5ZndsZXVubW5la2p5ZHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NTk2NDYsImV4cCI6MjEwOTMzNTY0Nn0.aHRI3OtMuwjlhyKj6Mjr-QuO8qXFDVdYg1PRXiLmGRU";
// ==================== 1. DATA STORE ====================
const APP_DATA = {
  activeTab: 'faculty',
  selectedBranch: 'CS',
  selectedSemester: 5,
  selectedSection: 'A',
  selectedSubjectId: 'sub-cs501',
  plannerSubjectId: 'sub-cs501',
  plannerGoalPct: 75,
  prospectiveSchedule: [
    { id: 'p1', day: 'Mon', date: '2026-11-09', status: 'P' },
    { id: 'p2', day: 'Tue', date: '2026-11-10', status: 'P' },
    { id: 'p3', day: 'Wed', date: '2026-11-11', status: 'P' },
    { id: 'p4', day: 'Thu', date: '2026-11-12', status: 'P' },
    { id: 'p5', day: 'Fri', date: '2026-11-13', status: 'P' },
    { id: 'p6', day: 'Mon', date: '2026-11-16', status: 'P' },
    { id: 'p7', day: 'Tue', date: '2026-11-17', status: 'P' },
  ],
  selectedDate: '2026-11-05',
  activeFilter: 'all',
  searchKeyword: '',

  // Registered Subjects
  subjects: [
    { id: 'sub-cs501', code: 'CS501', name: 'Operating Systems & Concurrency', faculty: 'Dr. Aris Thorne' },
    { id: 'sub-cs502', code: 'CS502', name: 'Database Management Systems', faculty: 'Prof. Meenakshi Sundaram' },
    { id: 'sub-cs503', code: 'CS503', name: 'Computer Networks & Protocols', faculty: 'Dr. Rajiv Menon' },
    { id: 'sub-cs504', code: 'CS504', name: 'Design & Analysis of Algorithms', faculty: 'Prof. Sunita Deshmukh' },
    { id: 'sub-cs505', code: 'CS505', name: 'Software Engineering & Agile Ops', faculty: 'Prof. Vikramaditya Rao' }
  ],

  // Sample Students
  students: [
    { id: 's1', studentId: 'CS01', name: 'Dev Patel', rollNo: '21CS101', pastAttended: 28, pastTotal: 32, phone: '+91 98201 11201' },
    { id: 's2', studentId: 'CS02', name: 'Riya Sen', rollNo: '21CS102', pastAttended: 21, pastTotal: 32, phone: '+91 98201 11202' },
    { id: 's3', studentId: 'CS03', name: 'Aarav Sharma', rollNo: '21CS103', pastAttended: 31, pastTotal: 32, phone: '+91 98201 11203' },
    { id: 's4', studentId: 'CS04', name: 'Ananya Iyer', rollNo: '21CS104', pastAttended: 23, pastTotal: 32, phone: '+91 98201 11204' },
    { id: 's5', studentId: 'CS05', name: 'Rohan Gupta', rollNo: '21CS105', pastAttended: 19, pastTotal: 32, phone: '+91 98201 11205' },
    { id: 's6', studentId: 'CS06', name: 'Tanvi Joshi', rollNo: '21CS106', pastAttended: 27, pastTotal: 32, phone: '+91 98201 11206' },
    { id: 's7', studentId: 'CS07', name: 'Vikram Rao', rollNo: '21CS107', pastAttended: 20, pastTotal: 32, phone: '+91 98201 11207' },
    { id: 's8', studentId: 'CS08', name: 'Meera Nambiar', rollNo: '21CS108', pastAttended: 29, pastTotal: 32, phone: '+91 98201 11208' },
    { id: 's9', studentId: 'CS09', name: 'Kabir Khan', rollNo: '21CS109', pastAttended: 24, pastTotal: 32, phone: '+91 98201 11209' },
    { id: 's10', studentId: 'CS10', name: 'Sneha Verma', rollNo: '21CS110', pastAttended: 28, pastTotal: 32, phone: '+91 98201 11210' },
    { id: 's11', studentId: 'CS11', name: 'Arjun Reddy', rollNo: '21CS111', pastAttended: 18, pastTotal: 32, phone: '+91 98201 11211' },
    { id: 's12', studentId: 'CS12', name: 'Pooja Mehta', rollNo: '21CS112', pastAttended: 26, pastTotal: 32, phone: '+91 98201 11212' }
  ],

  // Today's Status State: studentId -> 'P' | 'A' | 'E'
  currentStatus: {},

  // Historical dates matching screenshot
  pastDates: ['2026-11-05', '2026-11-04', '2026-11-02', '2026-10-31', '2026-10-29']
};

// ==================== 2. INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  initDefaults();
  populateDropdowns();
  renderHistoricalChips();
  renderRoster();
  updateMetrics();
  renderWeeklyTrends();
  renderDistribution();
  renderShortageTable();
  renderStudentPortal();
  renderWaiversAndAlerts();
});

function initDefaults() {
  // Preset match to screenshot: 7 Present, 5 Absent
  APP_DATA.students.forEach((st, idx) => {
    // Indices [1, 4, 6, 8, 10] are absent to form 5 absent and 7 present
    if ([1, 4, 6, 8, 10].includes(idx)) {
      APP_DATA.currentStatus[st.id] = 'A';
    } else {
      APP_DATA.currentStatus[st.id] = 'P';
    }
  });
}

function populateDropdowns() {
  const subSelect = document.getElementById('subjectSelect');
  subSelect.innerHTML = '';
  APP_DATA.subjects.forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.id;
    opt.textContent = `${sub.code} - ${sub.name}`;
    subSelect.appendChild(opt);
  });
  subSelect.value = APP_DATA.selectedSubjectId;

  const stPicker = document.getElementById('studentPicker');
  stPicker.innerHTML = '';
  APP_DATA.students.forEach(st => {
    const opt = document.createElement('option');
    opt.value = st.id;
    opt.textContent = `${st.studentId} - ${st.name}`;
    stPicker.appendChild(opt);
  });
}
const pSelect = document.getElementById('plannerSubject');
  if (pSelect) {
    pSelect.innerHTML = '';
    APP_DATA.subjects.forEach(sub => {
      pSelect.add(new Option(`${sub.code} - ${sub.name}`, sub.id));
    });
    pSelect.value = APP_DATA.plannerSubjectId || APP_DATA.selectedSubjectId;
  }
function renderHistoricalChips() {
  const container = document.getElementById('chipsContainer');
  container.innerHTML = '';
  APP_DATA.pastDates.forEach(date => {
    const btn = document.createElement('button');
    btn.className = `date-chip ${APP_DATA.selectedDate === date ? 'active' : ''}`;
    btn.textContent = date;
    btn.onclick = () => {
      APP_DATA.selectedDate = date;
      document.getElementById('sessionDate').value = date;
      renderHistoricalChips();
      renderRoster();
      updateMetrics();
    };
    container.appendChild(btn);
  });
}

// ==================== 3. ROSTER COMPUTATION & RENDERING ====================
function computeStudentMetrics(student) {
  const todayStatus = APP_DATA.currentStatus[student.id] || 'P';
  const attended = student.pastAttended + (todayStatus === 'P' || todayStatus === 'E' ? 1 : 0);
  const total = student.pastTotal + 1;
  const pct = parseFloat(((attended / total) * 100).toFixed(1));

  // Needed classes to hit 75%: (attended + x)/(total + x) >= 0.75 => x = (0.75*total - attended)/0.25
  let classesNeeded = 0;
  if (pct < 75.0) {
    classesNeeded = Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));
  }

  // Safe classes can miss: attended / (total + y) >= 0.75 => y = (attended - 0.75*total)/0.75
  let safeBunks = 0;
  if (pct >= 75.0) {
    safeBunks = Math.max(0, Math.floor((attended - 0.75 * total) / 0.75));
  }

  return { attended, total, pct, classesNeeded, safeBunks, todayStatus };
}

function renderRoster() {
  const tbody = document.getElementById('rosterTableBody');
  tbody.innerHTML = '';

  const activeSub = APP_DATA.subjects.find(s => s.id === APP_DATA.selectedSubjectId);
  document.getElementById('tableCourseTitle').textContent = `${activeSub.code} - ${activeSub.name} (Section A)`;

  APP_DATA.students.forEach(student => {
    const metrics = computeStudentMetrics(student);

    // Search filter
    const matchesSearch = student.name.toLowerCase().includes(APP_DATA.searchKeyword.toLowerCase()) ||
                          student.studentId.toLowerCase().includes(APP_DATA.searchKeyword.toLowerCase()) ||
                          student.rollNo.toLowerCase().includes(APP_DATA.searchKeyword.toLowerCase());
    if (!matchesSearch) return;

    // Category Filter
    if (APP_DATA.activeFilter === 'risk' && metrics.pct >= 75.0) return;
    if (APP_DATA.activeFilter === 'absent' && metrics.todayStatus !== 'A') return;

    const tr = document.createElement('tr');
    if (metrics.pct < 70.0) tr.classList.add('row-critical');
    else if (metrics.pct < 75.0) tr.classList.add('row-warning');

    tr.innerHTML = `
      <td><strong>${student.studentId}</strong></td>
      <td>
        <div style="font-weight:700;color:#0f172a">${student.name}</div>
        <div style="font-size:11px;color:#64748b;font-family:var(--font-mono)">Roll: ${student.rollNo}</div>
      </td>
      <td class="text-center">
        <div class="status-toggles">
          <button class="status-btn btn-p ${metrics.todayStatus === 'P' ? 'active' : ''}" onclick="setStatus('${student.id}', 'P')">P</button>
          <button class="status-btn btn-a ${metrics.todayStatus === 'A' ? 'active' : ''}" onclick="setStatus('${student.id}', 'A')">A</button>
          <button class="status-btn btn-e ${metrics.todayStatus === 'E' ? 'active' : ''}" onclick="setStatus('${student.id}', 'E')">E</button>
        </div>
      </td>
      <td class="text-center font-mono"><strong>${metrics.attended}</strong> / ${metrics.total}</td>
      <td class="text-center">
        <div class="pct-column">
          <span class="pct-value ${metrics.pct < 70 ? 'pct-red' : metrics.pct < 75 ? 'pct-amber' : 'pct-green'}">${metrics.pct}%</span>
          <div class="pct-meter">
            <div class="pct-fill ${metrics.pct < 70 ? 'fill-red' : metrics.pct < 75 ? 'fill-amber' : 'fill-green'}" style="width: ${Math.min(metrics.pct, 100)}%"></div>
          </div>
        </div>
      </td>
      <td>
        ${metrics.pct < 70
          ? `<span class="badge-risk risk-critical">✕ Critical Shortage (Barred)</span>`
          : metrics.pct < 75
          ? `<span class="badge-risk risk-warning">⚠ At Risk (&lt;75%) • Need ${metrics.classesNeeded} classes</span>`
          : `<span class="badge-risk risk-eligible">✓ Eligible for Hall Ticket</span>`}
      </td>
      <td class="text-right">
        <button class="btn-inspect" onclick="openInspectModal('${student.id}')">Card</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function setStatus(studentId, status) {
  APP_DATA.currentStatus[studentId] = status;
  renderRoster();
  updateMetrics();
  renderShortageTable();
  renderDistribution();
}

function markAll(status) {
  APP_DATA.students.forEach(st => {
    APP_DATA.currentStatus[st.id] = status;
  });
  renderRoster();
  updateMetrics();
  renderShortageTable();
  renderDistribution();
}

function updateMetrics() {
  const statuses = Object.values(APP_DATA.currentStatus);
  const presentCount = statuses.filter(s => s === 'P').length;
  const absentCount = statuses.filter(s => s === 'A').length;
  const excusedCount = statuses.filter(s => s === 'E').length;
  const total = APP_DATA.students.length;

  let riskCount = 0;
  APP_DATA.students.forEach(st => {
    const m = computeStudentMetrics(st);
    if (m.pct < 75.0) riskCount++;
  });

  document.getElementById('metricPresentCount').textContent = presentCount;
  document.getElementById('metricPresentPct').textContent = `${Math.round((presentCount / total) * 100)}% turn-out`;
  document.getElementById('metricAbsentCount').textContent = absentCount;
  document.getElementById('metricExcusedCount').textContent = excusedCount;
  document.getElementById('metricRiskCount').textContent = riskCount;

  document.getElementById('filterAllCount').textContent = total;
  document.getElementById('filterRiskCount').textContent = riskCount;
  document.getElementById('filterAbsentCount').textContent = absentCount;
  document.getElementById('navShortageCount').textContent = riskCount;
}

// ==================== 4. TOOLBAR & FILTERS ====================
function setFilter(filter) {
  APP_DATA.activeFilter = filter;
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach((p, idx) => {
    p.classList.toggle('active', (filter === 'all' && idx === 0) || (filter === 'risk' && idx === 1) || (filter === 'absent' && idx === 2));
  });
  renderRoster();
}

function handleSearch(val) {
  APP_DATA.searchKeyword = val.trim();
  renderRoster();
}

function handleDateChange(val) {
  APP_DATA.selectedDate = val;
  renderHistoricalChips();
  renderRoster();
  updateMetrics();
}

function setTodayDate() {
  APP_DATA.selectedDate = '2026-11-05';
  document.getElementById('sessionDate').value = '2026-11-05';
  renderHistoricalChips();
  renderRoster();
  updateMetrics();
}

function handleCohortChange() {
  APP_DATA.selectedSubjectId = document.getElementById('subjectSelect').value;
  renderRoster();
  updateMetrics();
}

function saveAttendance() {
  const toast = document.getElementById('saveToast');
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ==================== 5. NAVIGATION TABS ====================
function switchTab(tabId) {
  APP_DATA.activeTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === `${tabId}Section`);
  });

  if (tabId === 'dean') {
    renderWeeklyTrends();
    renderDistribution();
    renderShortageTable();
  } else if (tabId === 'student') {
    renderStudentPortal();
  }
}

// ==================== 6. DEAN ANALYTICS ====================
function renderWeeklyTrends() {
  const container = document.getElementById('weeklyBars');
  container.innerHTML = '';
  const weeks = [
    { label: 'W1', pct: 92 },
    { label: 'W2', pct: 86 },
    { label: 'W3', pct: 82 },
    { label: 'W4', pct: 78 },
    { label: 'W5', pct: 71 },
    { label: 'W6', pct: 69 },
    { label: 'W7', pct: 80 },
    { label: 'W8', pct: 76 }
  ];

  weeks.forEach(w => {
    const col = document.createElement('div');
    col.className = 'bar-column';
    col.innerHTML = `
      <div class="bar-pillar ${w.pct < 75 ? 'pillar-risk' : ''}" style="height: ${w.pct}%" title="${w.label}: ${w.pct}%"></div>
      <span class="bar-tag">${w.label}</span>
    `;
    container.appendChild(col);
  });
}

function renderDistribution() {
  let dist = 0, elig = 0, warn = 0, crit = 0;
  APP_DATA.students.forEach(st => {
    const m = computeStudentMetrics(st);
    if (m.pct >= 85) dist++;
    else if (m.pct >= 75) elig++;
    else if (m.pct >= 70) warn++;
    else crit++;
  });

  const total = APP_DATA.students.length || 1;
  document.getElementById('dDist').textContent = dist;
  document.getElementById('dDistBar').style.width = `${(dist / total) * 100}%`;
  document.getElementById('dElig').textContent = elig;
  document.getElementById('dEligBar').style.width = `${(elig / total) * 100}%`;
  document.getElementById('dWarn').textContent = warn;
  document.getElementById('dWarnBar').style.width = `${(warn / total) * 100}%`;
  document.getElementById('dCrit').textContent = crit;
  document.getElementById('dCritBar').style.width = `${(crit / total) * 100}%`;
}

function renderShortageTable() {
  const tbody = document.getElementById('shortageTableBody');
  tbody.innerHTML = '';

  APP_DATA.students.forEach(st => {
    const m = computeStudentMetrics(st);
    if (m.pct < 75.0) {
      const tr = document.createElement('tr');
      tr.className = m.pct < 70 ? 'row-critical' : 'row-warning';
      tr.innerHTML = `
        <td><strong>${st.studentId}</strong></td>
        <td><strong>${st.name}</strong> (${st.rollNo})</td>
        <td class="text-center font-mono">${m.attended} / ${m.total}</td>
        <td class="text-center font-mono font-bold ${m.pct < 70 ? 'pct-red' : 'pct-amber'}">${m.pct}%</td>
        <td class="text-center font-mono font-bold">+${m.classesNeeded} lectures</td>
        <td>
          <span class="badge-risk ${m.pct < 70 ? 'risk-critical' : 'risk-warning'}">
            ${m.pct < 70 ? 'Hall Ticket Blocked' : 'Provisional Warning'}
          </span>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function exportShortageCSV() {
  const sub = APP_DATA.subjects.find(s => s.id === APP_DATA.selectedSubjectId);
  let csv = 'ID,Name,Roll,Subject,Attended,Total,Percentage,Classes Needed,Status\n';
  APP_DATA.students.forEach(st => {
    const m = computeStudentMetrics(st);
    if (m.pct < 75.0) {
      csv += `${st.studentId},"${st.name}",${st.rollNo},${sub.code},${m.attended},${m.total},${m.pct}%,${m.classesNeeded},${m.pct < 70 ? 'DENIED' : 'WARNING'}\n`;
    }
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Deans_Shortage_List_${sub.code}.csv`;
  a.click();
}

// ==================== 7. STUDENT PORTAL ====================
function renderStudentPortal() {
  const stId = document.getElementById('studentPicker').value || 's1';
  const student = APP_DATA.students.find(s => s.id === stId);
  document.getElementById('portalStudentName').textContent = student.name;
  document.getElementById('portalStudentMeta').textContent = `${student.studentId} • ${student.rollNo} • Computer Science Sem 5-A`;

  const tbody = document.getElementById('studentBreakdownBody');
  tbody.innerHTML = '';

  APP_DATA.subjects.forEach(sub => {
    const m = computeStudentMetrics(student);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${sub.code}</strong> - ${sub.name}</td>
      <td>${sub.faculty}</td>
      <td class="text-center font-mono">${m.attended} / ${m.total}</td>
      <td class="text-center font-mono font-bold ${m.pct < 70 ? 'pct-red' : m.pct < 75 ? 'pct-amber' : 'pct-green'}">${m.pct}%</td>
      <td>
        <span class="badge-risk ${m.pct < 70 ? 'risk-critical' : m.pct < 75 ? 'risk-warning' : 'risk-eligible'}">
          ${m.pct < 70 ? 'Hall Ticket Denied' : m.pct < 75 ? 'Under Observation' : 'Eligible'}
        </span>
      </td>
      <td>${m.pct < 75 ? `Must attend <strong>${m.classesNeeded}</strong> classes` : `Can miss <strong>${m.safeBunks}</strong> classes`}</td>
    `;
    tbody.appendChild(tr);
  });
}

function changeStudentView(studentId) {
  renderStudentPortal();
}

// ==================== 8. WAIVERS & ALERTS ====================
function renderWaiversAndAlerts() {
  const wContainer = document.getElementById('waiverList');
  wContainer.innerHTML = `
    <div style="background:#f8fafc;padding:12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <strong>Vikram Rao (CS07)</strong> • CS501 • 2026-10-24 to 2026-10-28<br>
        <span style="font-size:11.5px;color:#64748b">Acute Gastroenteritis • Apollo Multispeciality Hospital</span>
      </div>
      <button class="btn-action btn-mark-present" onclick="alert('Waiver approved! Marked absences converted to Excused (E).')">Approve Waiver</button>
    </div>
  `;

  const aContainer = document.getElementById('alertList');
  aContainer.innerHTML = `
    <div style="background:#fff1f2;padding:12px;border:1px solid #fecdd3;border-radius:10px;display:flex;justify-content:space-between;align-items:center;">
      <div>
        <strong>Riya Sen (CS02)</strong> • 3 Consecutive Missed Lectures Detected!<br>
        <span style="font-size:11.5px;color:#9f1239">Parent Phone: +91 98201 99102 • Current Attendance: 65.6%</span>
      </div>
      <button class="btn-action btn-mark-absent" onclick="alert('SMS Notification sent to guardian phone!')">Send Alert SMS</button>
    </div>
  `;
}

// ==================== 9. MODALS ====================
function openInspectModal(studentId) {
  const st = APP_DATA.students.find(s => s.id === studentId);
  const m = computeStudentMetrics(st);
  document.getElementById('inspectTitle').textContent = `${st.name} (${st.studentId})`;
  document.getElementById('inspectSub').textContent = `Roll: ${st.rollNo} • Parent: ${st.phone}`;

  document.getElementById('inspectContent').innerHTML = `
    <div style="margin:16px 0;padding:14px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0">
      <div style="display:flex;justify-content:space-between;font-size:13px;">
        <span>Current CS501 Attendance:</span>
        <strong class="${m.pct < 70 ? 'pct-red' : m.pct < 75 ? 'pct-amber' : 'pct-green'}">${m.pct}% (${m.attended}/${m.total})</strong>
      </div>
      <div style="font-size:12px;color:#64748b;margin-top:6px;">
        ${m.pct < 75 ? `⚠ Need to attend ${m.classesNeeded} consecutive classes to reach 75%.` : `✓ Safety cushion: Can afford to miss ${m.safeBunks} more classes.`}
      </div>
    </div>
  `;
  document.getElementById('inspectModal').classList.remove('hidden');
}

function closeInspectModal() {
  document.getElementById('inspectModal').classList.add('hidden');
}

function openPrintModal() {
  const tbody = document.getElementById('printTableBody');
  tbody.innerHTML = '';
  APP_DATA.students.forEach(st => {
    const m = computeStudentMetrics(st);
    if (m.pct < 75.0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${st.studentId}</td>
        <td>${st.name}</td>
        <td>${st.rollNo}</td>
        <td class="text-center">${m.attended}/${m.total}</td>
        <td class="text-center font-mono font-bold" style="color:#dc2626">${m.pct}%</td>
        <td style="color:#dc2626;font-weight:700">${m.pct < 70 ? 'Hall-Ticket Denied' : 'Provisional Shortage'}</td>
      `;
      tbody.appendChild(tr);
    }
  });
  document.getElementById('printModal').classList.remove('hidden');
}

function closePrintModal() {
  document.getElementById('printModal').classList.add('hidden');
}
// ==================== "SAFE ZONE" ATTENDANCE PLANNER & BUNK CALCULATOR ====================
function runBunkPlanner() {
  const pSelect = document.getElementById('plannerSubject');
  if (pSelect) {
    APP_DATA.plannerSubjectId = pSelect.value;
  }
  const stId = document.getElementById('studentPicker').value || 's1';
  const student = APP_DATA.students.find(s => s.id === stId);
  const activeSub = APP_DATA.subjects.find(s => s.id === APP_DATA.plannerSubjectId) || APP_DATA.subjects[0];
  const m = computeStudentMetrics(student);

  // 1. Safety Buffer
  document.getElementById('bufferRatio').textContent = `${m.attended} / ${m.total} Classes`;
  document.getElementById('bufferCurrentPct').textContent = `${m.pct}%`;

  const banner = document.getElementById('safetyBufferBanner');
  const bTitle = document.getElementById('bufferTitle');
  const bMsg = document.getElementById('bufferMessage');
  const bSub = document.getElementById('bufferSub');
  const bFill = document.getElementById('bufferMeterFill');

  bFill.style.width = `${Math.min(m.pct, 100)}%`;

  if (m.pct >= 75.0) {
    banner.className = 'buffer-banner buffer-safe';
    bTitle.textContent = 'Safe Zone Active';
    bMsg.innerHTML = `You have <strong>${m.safeBunks} safe skips</strong> remaining for ${activeSub.code}!`;
    bSub.textContent = `You can miss up to ${m.safeBunks} classes and still stay above 75.0%.`;
    bFill.className = 'meter-fill fill-green';
  } else {
    banner.className = 'buffer-banner buffer-deficit';
    bTitle.textContent = 'Shortage Risk Alert';
    bMsg.innerHTML = `Must attend <strong>${m.classesNeeded} consecutive classes</strong> to reach 75%!`;
    bSub.textContent = `Zero unexcused absences allowed until deficit is recovered.`;
    bFill.className = 'meter-fill fill-red';
  }

  // 2. Goal Setter
  calculateGoalPlan(m);

  // 3. Prospective Schedule Simulator
  renderProspectiveList(m);
}

function setPlannerGoal(goal) {
  APP_DATA.plannerGoalPct = goal;
  document.getElementById('goalSlider').value = goal;
  document.getElementById('goalValText').textContent = `${goal}%`;

  document.querySelectorAll('.goal-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.textContent, 10) === goal);
  });

  const stId = document.getElementById('studentPicker').value || 's1';
  const student = APP_DATA.students.find(s => s.id === stId);
  calculateGoalPlan(computeStudentMetrics(student));
}

function handleGoalSlider(val) {
  const goal = parseInt(val, 10);
  APP_DATA.plannerGoalPct = goal;
  document.getElementById('goalValText').textContent = `${goal}%`;

  document.querySelectorAll('.goal-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.textContent, 10) === goal);
  });

  const stId = document.getElementById('studentPicker').value || 's1';
  const student = APP_DATA.students.find(s => s.id === stId);
  calculateGoalPlan(computeStudentMetrics(student));
}

function calculateGoalPlan(m) {
  const A = m.attended;
  const N = m.total;
  const T = APP_DATA.plannerGoalPct;

  const main = document.getElementById('goalPlanMain');
  const sub = document.getElementById('goalPlanSub');

  if (m.pct < T) {
    const denom = 100 - T;
    const needed = denom > 0 ? Math.max(1, Math.ceil((T * N - 100 * A) / denom)) : 10;
    main.innerHTML = `Attend next <span style="text-decoration:underline">${needed}</span> classes consecutively`;
    main.style.color = '#fde047';
    sub.textContent = `To climb from current ${m.pct}% to your target of ${T}%.`;
  } else {
    const safe = Math.max(0, Math.floor((100 * A - T * N) / T));
    main.innerHTML = `You can skip <span style="text-decoration:underline">${safe}</span> classes`;
    main.style.color = '#34d399';
    sub.textContent = `And comfortably remain above your target of ${T}%.`;
  }
}

function renderProspectiveList(m) {
  const list = document.getElementById('prospectiveScheduleList');
  if (!list) return;
  list.innerHTML = '';

  APP_DATA.prospectiveSchedule.forEach(item => {
    const row = document.createElement('div');
    row.className = 'prospective-row';
    row.innerHTML = `
      <div>
        <strong>${item.day}</strong>
        <span class="prospective-date">${item.date}</span>
      </div>
      <div class="prospective-toggles">
        <button class="prospective-btn p-attend ${item.status === 'P' ? 'active' : ''}" onclick="toggleProspectiveDay('${item.id}', 'P')">Attend</button>
        <button class="prospective-btn p-skip ${item.status === 'A' ? 'active' : ''}" onclick="toggleProspectiveDay('${item.id}', 'A')">Skip</button>
      </div>
    `;
    list.appendChild(row);
  });

  calculateScenarioImpact(m);
}

function toggleProspectiveDay(id, status) {
  const day = APP_DATA.prospectiveSchedule.find(d => d.id === id);
  if (day) {
    day.status = status;
    const stId = document.getElementById('studentPicker').value || 's1';
    const student = APP_DATA.students.find(s => s.id === stId);
    renderProspectiveList(computeStudentMetrics(student));
  }
}

function applyCalendarPreset(preset) {
  if (preset === 'attendAll') {
    APP_DATA.prospectiveSchedule.forEach(d => (d.status = 'P'));
  } else if (preset === 'threeDayLeave') {
    APP_DATA.prospectiveSchedule.forEach((d, idx) => {
      d.status = (idx >= 2 && idx <= 4) ? 'A' : 'P';
    });
  } else if (preset === 'skipTomorrow') {
    APP_DATA.prospectiveSchedule.forEach((d, idx) => {
      d.status = (idx === 0) ? 'A' : 'P';
    });
  }
  const stId = document.getElementById('studentPicker').value || 's1';
  const student = APP_DATA.students.find(s => s.id === stId);
  renderProspectiveList(computeStudentMetrics(student));
}

function calculateScenarioImpact(m) {
  const plannedP = APP_DATA.prospectiveSchedule.filter(d => d.status === 'P').length;
  const plannedA = APP_DATA.prospectiveSchedule.filter(d => d.status === 'A').length;
  const plannedTotal = APP_DATA.prospectiveSchedule.length;

  const newAttended = m.attended + plannedP;
  const newTotal = m.total + plannedTotal;
  const projectedPct = parseFloat(((newAttended / newTotal) * 100).toFixed(1));
  const delta = parseFloat((projectedPct - m.pct).toFixed(1));

  document.getElementById('scenarioPlannedSkips').textContent = `${plannedA} Skips Planned`;
  document.getElementById('scenarioValues').textContent = `${m.pct}% → ${projectedPct}% (${delta >= 0 ? '+' : ''}${delta}%)`;

  const box = document.getElementById('scenarioResultBox');
  const desc = document.getElementById('scenarioDesc');

  if (projectedPct >= 75.0) {
    box.className = 'sim-impact-box impact-safe';
    desc.textContent = '✓ Hall ticket eligibility securely maintained above 75%';
  } else {
    box.className = 'sim-impact-box impact-risk';
    desc.textContent = '⚠ Warning: Planned skips drop you below mandatory 75% threshold!';
  }
}