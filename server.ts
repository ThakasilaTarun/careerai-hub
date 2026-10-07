import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 3000;
const SECRET_KEY = 'crpms_secret_2024';
const DB_PATH = path.join(process.cwd(), 'database.json');

app.use(express.json());

// Initial Data Structure
const initialData = {
  admins: [
    { id: '1', name: 'Placement Officer', email: 'admin@crpms.edu', password: bcrypt.hashSync('password123', 10) }
  ],
  students: [
    { 
      id: 's1', 
      name: 'Rahul Kumar', 
      roll_no: 'MCA2301', 
      email: 'rahul@student.edu', 
      password: bcrypt.hashSync('password123', 10),
      phone: '9876543210',
      college: 'Dept of Computer Applications',
      department: 'MCA',
      pct_10: 88,
      pct_12: 82,
      ug_cgpa: 8.2,
      ug_degree: 'B.Sc Computer Science',
      year_pass: 2025,
      backlogs: 0,
      skills: 'React, Node.js, SQL',
      about: 'Enthusiastic developer.',
      is_placed: false,
      is_active: true
    },
    { 
      id: 's2', 
      name: 'Arjun Singh', 
      roll_no: 'MCA2303', 
      email: 'arjun@student.edu', 
      password: bcrypt.hashSync('password123', 10),
      phone: '9876543212',
      college: 'Dept of Computer Applications',
      department: 'MCA',
      pct_10: 72,
      pct_12: 68,
      ug_cgpa: 6.9,
      ug_degree: 'B.Sc Mathematics',
      year_pass: 2025,
      backlogs: 1,
      skills: 'Python, Java',
      about: 'Passionate about coding.',
      is_placed: false,
      is_active: true
    }
  ],
  companies: [
    { id: 'c1', name: 'TCS', role: 'System Engineer', package: '3.5 LPA', min_cgpa: 6.0, min_pct_10: 60, min_pct_12: 60, allow_backlog: false, drive_date: '2025-05-15', location: 'Chennai', job_type: 'Full Time', status: 'active', color: '#0d1b3e', letter: 'T' },
    { id: 'c2', name: 'Infosys', role: 'Systems Engineer', package: '3.6 LPA', min_cgpa: 6.5, min_pct_10: 65, min_pct_12: 65, allow_backlog: false, drive_date: '2025-05-20', location: 'Bangalore', job_type: 'Full Time', status: 'active', color: '#007cc3', letter: 'I' },
    { id: 'c3', name: 'Wipro', role: 'Project Engineer', package: '3.5 LPA', min_cgpa: 6.0, min_pct_10: 60, min_pct_12: 60, allow_backlog: true, drive_date: '2025-05-25', location: 'Hyderabad', job_type: 'Full Time', status: 'active', color: '#2e3192', letter: 'W' },
    { id: 'c4', name: 'Cognizant', role: 'Programmer Analyst', package: '4.0 LPA', min_cgpa: 7.0, min_pct_10: 70, min_pct_12: 65, allow_backlog: false, drive_date: '2025-06-01', location: 'Chennai', job_type: 'Full Time', status: 'active', color: '#0033a0', letter: 'C' }
  ],
  applications: [],
  interviews: [],
  announcements: [
    { id: '1', title: 'Placement Season 2025 Now Open', body: 'Registration for TCS and Infosys starts next week. Ensure your profile is updated.', type: 'success', is_active: true, created_at: new Date().toISOString() },
    { id: '2', title: 'Profile Completion Deadline', body: 'Please complete your profiles by Feb 28th to be eligible for upcoming drives.', type: 'warning', is_active: true, created_at: new Date().toISOString() },
    { id: '3', title: 'Cognizant Drive Scheduled', body: 'Cognizant will be visiting on June 1st for the Programmer Analyst role.', type: 'info', is_active: true, created_at: new Date().toISOString() }
  ],
  notifications: [
    { id: 'n1', title: 'Welcome to CRPMS', message: 'Your account has been successfully created. Explore active jobs now!', type: 'ok', is_read: false, created_at: new Date().toISOString() }
  ],
  mails: []
};

// Ensure database exists
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
}

const getDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
const saveDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// API Routes
app.post('/api/auth/login', (req, res) => {
  const { email, password, role } = req.body;
  const db = getDB();
  const users = role === 'admin' ? db.admins : db.students;
  const user = users.find((u: any) => u.email === email);

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ id: user.id, role }, SECRET_KEY);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: { ...userWithoutPassword, role } });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const db = getDB();
  const userData = req.body;
  
  if (db.students.find((s: any) => s.email === userData.email || s.roll_no === userData.roll_no)) {
    return res.status(400).json({ error: 'Email or Roll No already exists' });
  }

  const newUser = {
    ...userData,
    id: 's' + Date.now(),
    password: bcrypt.hashSync(userData.password, 10),
    is_placed: false,
    is_active: true
  };

  db.students.push(newUser);
  saveDB(db);

  const token = jwt.sign({ id: newUser.id, role: 'student' }, SECRET_KEY);
  const { password: _, ...userWithoutPassword } = newUser;
  res.json({ token, user: { ...userWithoutPassword, role: 'student' } });
});

// Companies
app.get('/api/companies', (req, res) => {
  const db = getDB();
  res.json(db.companies);
});

app.post('/api/companies', (req, res) => {
  const db = getDB();
  const newCo = { id: 'c' + Date.now(), ...req.body, letter: req.body.name.charAt(0) };
  db.companies.push(newCo);
  saveDB(db);
  res.json(newCo);
});

app.patch('/api/companies/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const idx = db.companies.findIndex((c: any) => c.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  
  db.companies[idx] = { ...db.companies[idx], ...req.body };
  saveDB(db);
  res.json(db.companies[idx]);
});

// Applications
app.get('/api/applications', (req, res) => {
  const db = getDB();
  const apps = db.applications.map((app: any) => ({
    ...app,
    student: db.students.find((s: any) => s.id === app.student_id),
    company: db.companies.find((c: any) => c.id === app.company_id),
  }));
  res.json(apps);
});

app.post('/api/applications', (req, res) => {
  const { student_id, company_id } = req.body;
  const db = getDB();
  
  // Check eligibility
  const student = db.students.find((s: any) => s.id === student_id);
  const company = db.companies.find((c: any) => c.id === company_id);

  if (!student || !company) return res.status(404).json({ error: 'Data not found' });

  const reasons = [];
  if (student.ug_cgpa < company.min_cgpa) reasons.push('CGPA too low');
  if (student.pct_10 < company.min_pct_10) reasons.push('10th % too low');
  if (student.pct_12 < company.min_pct_12) reasons.push('12th % too low');
  if (!company.allow_backlog && student.backlogs > 0) reasons.push('Active backlogs');

  if (reasons.length > 0) {
    return res.status(400).json({ error: 'Not eligible', reasons });
  }

  const existing = db.applications.find((a: any) => a.student_id === student_id && a.company_id === company_id);
  if (existing) return res.status(400).json({ error: 'Already applied' });

  const newApp = {
    id: 'a' + Date.now(),
    student_id,
    company_id,
    status: 'Under Review',
    applied_at: new Date().toISOString().split('T')[0]
  };

  db.applications.push(newApp);
  
  // Create notification for student
  db.notifications.unshift({
    id: 'n' + Date.now(),
    student_id,
    title: 'Application Sent',
    message: `You applied for the ${company.role} role at ${company.name}.`,
    type: 'blue',
    is_read: false,
    created_at: new Date().toISOString()
  });

  // Create notification for admin
  db.notifications.unshift({
    id: 'na' + Date.now(),
    role: 'admin',
    title: 'New Application',
    message: `${student.name} applied for ${company.name}.`,
    type: 'info',
    is_read: false,
    created_at: new Date().toISOString()
  });

  saveDB(db);
  res.json(newApp);
});

app.patch('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  const { status, admin_note } = req.body;
  const db = getDB();
  const appIdx = db.applications.findIndex((a: any) => a.id === id);
  if (appIdx === -1) return res.status(404).json({ error: 'Not found' });

  const application = db.applications[appIdx];
  const student = db.students.find((s: any) => s.id === application.student_id);
  const company = db.companies.find((c: any) => c.id === application.company_id);

  db.applications[appIdx] = { ...application, status, admin_note, decided_at: new Date().toISOString() };
  
  if (status === 'Selected') {
    const sIdx = db.students.findIndex((s: any) => s.id === application.student_id);
    if (sIdx !== -1) db.students[sIdx].is_placed = true;
  }

  // Create "Email" in internal mail system
  const mailSubject = status === 'Selected' ? `Congratulations! You are selected at ${company.name}` : `Update on your application for ${company.name}`;
  const mailBody = status === 'Selected' 
    ? `Dear ${student.name}, We are pleased to inform you that you have been SELECTED for the ${company.role} role at ${company.name} with a package of ${company.package}. Please check the portal for next steps.`
    : `Dear ${student.name}, Thank you for your interest in the ${company.role} role at ${company.name}. Unfortunately, we will not be moving forward with your application at this time. We wish you the best in your future endeavors.`;

  db.mails.unshift({
    id: 'm' + Date.now(),
    student_id: student.id,
    subject: mailSubject,
    body: mailBody,
    from: 'Placement Cell',
    date: new Date().toISOString(),
    is_read: false
  });

  // Also create a notification for student
  db.notifications.unshift({
    id: 'n' + Date.now(),
    student_id: student.id,
    title: status === 'Selected' ? '🎉 Offer Received!' : 'Application Update',
    message: mailSubject,
    type: status === 'Selected' ? 'ok' : 'warn',
    is_read: false,
    created_at: new Date().toISOString()
  });

  saveDB(db);
  res.json(db.applications[appIdx]);
});

// Students
app.get('/api/students', (req, res) => {
  const db = getDB();
  res.json(db.students.map((s: any) => {
    const { password: _, ...rest } = s;
    return rest;
  }));
});

app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const student = db.students.find((s: any) => s.id === id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  const { password: _, ...studentWithoutPassword } = student;
  res.json(studentWithoutPassword);
});

app.patch('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const idx = db.students.findIndex((s: any) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });

  db.students[idx] = { ...db.students[idx], ...req.body };
  saveDB(db);
  const { password: _, ...studentWithoutPassword } = db.students[idx];
  res.json(studentWithoutPassword);
});

// Interviews
app.get('/api/interviews', (req, res) => {
  const db = getDB();
  const interviews = db.interviews.map((iv: any) => ({
    ...iv,
    student: db.students.find((s: any) => String(s.id) === String(iv.student_id)),
    company: db.companies.find((c: any) => String(c.id) === String(iv.company_id)),
  }));
  res.json(interviews);
});

app.post('/api/interviews', (req, res) => {
  const db = getDB();
  const { student_id, company_id, date, time } = req.body;
  const newIv = { id: 'iv' + Date.now(), ...req.body };
  db.interviews.unshift(newIv);

  const company = db.companies.find((c: any) => c.id === company_id);
  const student = db.students.find((s: any) => s.id === student_id);

  if (company && student) {
    // Add Notification
    db.notifications.unshift({
      id: 'notif' + Date.now(),
      student_id: student_id,
      title: 'Interview Scheduled!',
      message: `You have an interview with ${company.name} on ${date} at ${time}.`,
      type: 'info',
      is_read: false,
      created_at: new Date().toISOString()
    });

    // Add Internal Mail
    const mailId = 'mail' + Date.now();
    db.mails.unshift({
      id: mailId,
      student_id: student_id,
      from: 'Placement Cell',
      subject: `Interview Call: ${company.name}`,
      body: `Dear ${student.name},\n\nCongratulations! You have been shortlisted for an interview with ${company.name} for the ${company.role} position.\n\nSchedule Details:\nDate: ${date}\nTime: ${time}\n\nPlease be prepared and available at the scheduled time.\n\nBest of luck,\nPlacement Cell`,
      date: new Date().toISOString(),
      is_read: false
    });
    newIv.mail_id = mailId;
  }

  saveDB(db);
  res.json(newIv);
});

app.delete('/api/interviews/:id', (req, res) => {
  const { id } = req.params;
  const db = getDB();
  console.log('Server: Cancellation request for interview ID:', id);
  const idx = db.interviews.findIndex((i: any) => i.id === id);
  
  if (idx === -1) {
    console.error('Server: Interview not found with ID:', id);
    return res.status(404).json({ error: 'Interview not found' });
  }
  
  const interview = db.interviews[idx];
  const studentId = String(interview.student_id);
  const student = db.students.find((s: any) => String(s.id) === studentId);
  const company = db.companies.find((c: any) => String(c.id) === String(interview.company_id));

  if (student && company) {
    const sid = String(student.id);
    console.log('Server: Notifying student ID:', sid, 'about cancellation of interview with', company.name);
    // Notify student about cancellation
    const cancelNotif = {
      id: 'notif' + Date.now(),
      student_id: sid,
      title: 'Interview Cancelled',
      message: `Your interview with ${company.name} (scheduled for ${interview.date}) has been cancelled.`,
      type: 'warn',
      is_read: false,
      created_at: new Date().toISOString()
    };
    db.notifications.unshift(cancelNotif);

    db.mails.unshift({
      id: 'mail' + Date.now(),
      student_id: sid,
      from: 'Placement Cell',
      subject: `URGENT: Interview Cancelled - ${company.name}`,
      body: `Dear ${student.name},\n\nYour interview with ${company.name} scheduled for ${interview.date} at ${interview.time} has been cancelled by the administration.\n\nWe apologize for the inconvenience.\n\nBest Regards,\nPlacement Cell`,
      date: new Date().toISOString(),
      is_read: false
    });
  } else {
    console.warn('Server: Student or Company mismatch during cancellation', { 
      interviewStoredStudentId: interview.student_id, 
      interviewStoredCompanyId: interview.company_id 
    });
  }

  db.interviews.splice(idx, 1);
  saveDB(db);
  console.log('Server: Interview deleted successfully from database');
  res.json({ success: true });
});

// Stats
app.get('/api/stats', (req, res) => {
  const db = getDB();
  const totalStudents = db.students.length;
  const placedCount = db.students.filter((s: any) => s.is_placed).length;
  const totalApps = db.applications.length;
  const selections = db.applications.filter((a: any) => a.status === 'Selected').length;

  res.json({
    totalStudents,
    placedCount,
    totalApps,
    selections,
    placementRate: (placedCount / totalStudents * 100).toFixed(1),
    companies: db.companies.length
  });
});

app.get('/api/announcements', (req, res) => {
  const db = getDB();
  res.json(db.announcements.filter((a: any) => a.is_active));
});

app.post('/api/announcements', (req, res) => {
  const db = getDB();
  const newAnn = { id: 'an' + Date.now(), created_at: new Date().toISOString(), is_active: true, ...req.body };
  db.announcements.unshift(newAnn);
  saveDB(db);
  res.json(newAnn);
});

// Notifications
app.get('/api/notifications', (req, res) => {
  const { userId, role } = req.query;
  const db = getDB();
  
  console.log('Server: Fetching notifications for', { userId, role });
  
  let filtered = db.notifications;
  if (role === 'admin') {
    filtered = db.notifications.filter((n: any) => n.role === 'admin');
  } else if (userId) {
    const uid = String(userId);
    filtered = db.notifications.filter((n: any) => String(n.student_id) === uid);
  } else {
    filtered = []; // No identity provided
  }
  
  console.log('Server: Found', filtered.length, 'notifications');
  res.json(filtered);
});

app.post('/api/notifications/read', (req, res) => {
  const { id } = req.body;
  const db = getDB();
  const idx = db.notifications.findIndex((n: any) => n.id === id);
  if (idx !== -1) db.notifications[idx].is_read = true;
  saveDB(db);
  res.json({ success: true });
});

app.post('/api/notifications/clear', (req, res) => {
  const { userId, role } = req.body;
  const db = getDB();
  if (role === 'admin') {
    db.notifications = db.notifications.filter((n: any) => n.role !== 'admin');
  } else if (userId) {
    db.notifications = db.notifications.filter((n: any) => n.student_id !== userId);
  }
  saveDB(db);
  res.json({ success: true });
});

// Mail System
app.get('/api/mails', (req, res) => {
  const { student_id } = req.query;
  const db = getDB();
  let filtered = db.mails;
  if (student_id) {
    filtered = db.mails.filter((m: any) => m.student_id === student_id);
  }
  res.json(filtered);
});

app.post('/api/mails/read', (req, res) => {
  const { id } = req.body;
  const db = getDB();
  const idx = db.mails.findIndex((m: any) => m.id === id);
  if (idx !== -1) db.mails[idx].is_read = true;
  saveDB(db);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CRPMS Server running on http://localhost:${PORT}`);
  });
}

startServer();
