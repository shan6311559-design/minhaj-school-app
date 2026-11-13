import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Users, GraduationCap, Calendar, DollarSign, Wallet, 
  Megaphone, ClipboardCheck, FileText, LayoutDashboard, Trophy, 
  Settings, Home, UserCheck, CheckCircle2, XCircle, Clock, 
  Plus, Search, ArrowLeft, Send, Sparkles, School, Award, Bell, Download
} from 'lucide-react';

interface SchoolSettings {
  schoolName: string;
  subName: string;
  principalName: string;
  address: string;
  academicYear: string;
  logoUrl: string;
}

const DEFAULT_SETTINGS: SchoolSettings = {
  schoolName: "Minhaj School App",
  subName: "Minhaj-ul-Quran Model School Tahir Abad",
  principalName: "Principal Sahab",
  address: "Tahir Abad, Main Branch",
  academicYear: "2024-2025",
  logoUrl: "",
};

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function App() {
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem('minhaj_school_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [activeRole, setActiveRole] = useState<'home' | 'principal' | 'teacher' | 'student'>('home');
  const [activeView, setActiveView] = useState<string | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Real PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showAutoInstallPopup, setShowAutoInstallPopup] = useState(false);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);
  const [installSuccessMessage, setInstallSuccessMessage] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    
    if (isStandalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowAutoInstallPopup(false);
      setInstallSuccessMessage(true);
      setTimeout(() => setInstallSuccessMessage(false), 6000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // 5-second delay timer for auto install popup
    const timer = setTimeout(() => {
      if (!isStandalone && !localStorage.getItem('minhaj_install_dismissed')) {
        setShowAutoInstallPopup(true);
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          setInstallSuccessMessage(true);
          setTimeout(() => setInstallSuccessMessage(false), 6000);
        }
      } catch (err) {
        console.error("Install prompt error:", err);
        setShowInstallGuideModal(true);
      }
    } else {
      setShowInstallGuideModal(true);
    }
    setShowAutoInstallPopup(false);
  };

  // Editable form state for settings
  const [formSettings, setFormSettings] = useState<SchoolSettings>(settings);

  // Interactive state data
  const [students, setStudents] = useState([
    { id: 1, name: "Ali Raza", rollNo: "07", class: "Class 7", status: "Hazir (Present)", feeStatus: "Paid" },
    { id: 2, name: "Muhammad Ahmed", rollNo: "08", class: "Class 7", status: "Hazir (Present)", feeStatus: "Paid" },
    { id: 3, name: "Fatima Bibi", rollNo: "09", class: "Class 7", status: "Ghair Hazir (Absent)", feeStatus: "Pending" },
    { id: 4, name: "Ayesha Malik", rollNo: "10", class: "Class 7", status: "Hazir (Present)", feeStatus: "Paid" },
    { id: 5, name: "Usman Ghani", rollNo: "11", class: "Class 7", status: "Hazir (Present)", feeStatus: "Pending" },
    { id: 6, name: "Zainab Noor", rollNo: "12", class: "Class 7", status: "Hazir (Present)", feeStatus: "Paid" },
  ]);

  const [teachers, setTeachers] = useState([
    { id: 1, name: "Sir Tariq Mehmood", subject: "Math & Physics", status: "Hazir", salary: "Rs. 45,000 (Paid)" },
    { id: 2, name: "Ma'am Ayesha", subject: "English & Urdu", status: "Hazir", salary: "Rs. 40,000 (Paid)" },
    { id: 3, name: "Sir Bilal Ahmed", subject: "Computer Science", status: "Leave", salary: "Rs. 42,000 (Pending)" },
    { id: 4, name: "Ma'am Shagufta", subject: "Islamiat & Pak Studies", status: "Hazir", salary: "Rs. 38,000 (Paid)" },
  ]);

  const [notices, setNotices] = useState([
    { id: 1, title: "Sports Week 2024", date: "14 Oct 2024", desc: "Annual sports gala will start from next Monday. All students must participate." },
    { id: 2, title: "Fee Submission Deadline", date: "20 Oct 2024", desc: "Please submit monthly tuition fees before 20th October to avoid late fine." },
    { id: 3, title: "Parent Teacher Meeting", date: "25 Oct 2024", desc: "PTM will be held on Saturday from 9 AM to 1 PM. Parents are cordially invited." }
  ]);

  const [homeworkList, setHomeworkList] = useState([
    { id: 1, subject: "Riazi (Maths)", task: "Mashq 3.2 (Questions 1 to 5)", dueDate: "Today", status: "Pending" },
    { id: 2, subject: "English", task: "Essay on Quaid-e-Azam (200 words)", dueDate: "Tomorrow", status: "Pending" },
    { id: 3, subject: "Urdu", task: "Sabaq Allama Iqbal ke ash'aar ki tashreeh", dueDate: "16 Oct", status: "Completed" }
  ]);

  const [leaveRequests, setLeaveRequests] = useState([
    { id: 1, name: "Ahmed (Class 7)", reason: "Bukhar (Fever) ki wajah se school nahi aa sakta", date: "14 Oct", status: "Manzoor (Approved)" },
    { id: 2, name: "Sir Bilal Ahmed", reason: "Zaroori kaam ki wajah se chutti", date: "15 Oct", status: " زیر غور (Pending)" }
  ]);

  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeDesc, setNewNoticeDesc] = useState("");
  const [newHwSubject, setNewHwSubject] = useState("");
  const [newHwTask, setNewHwTask] = useState("");
  const [newLeaveReason, setNewLeaveReason] = useState("");

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettings(formSettings);
    localStorage.setItem('minhaj_school_settings', JSON.stringify(formSettings));
    setShowSettingsModal(false);
  };

  const currentDateStr = "14 October 2024";

  // --- SUB-VIEW ROUTER FOR PRINCIPAL ---
  const renderPrincipalView = () => {
    switch (activeView) {
      case 'students':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <Users className="w-6 h-6 text-blue-600" /> Talba Record / Students Directory
              </h3>
              <button 
                onClick={() => setActiveView(null)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 hover:bg-blue-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <span className="font-semibold text-gray-700">Total Enrolled: {students.length} Students</span>
                <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">Active Session 2024-25</span>
              </div>
              <div className="divide-y divide-gray-100">
                {students.map(st => (
                  <div key={st.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-gray-800">{st.name} <span className="text-xs font-normal text-gray-500">(Roll #{st.rollNo})</span></p>
                      <p className="text-xs text-gray-600">{st.class} | Fee: <span className={st.feeStatus === 'Paid' ? 'text-green-600 font-semibold' : 'text-amber-600 font-semibold'}>{st.feeStatus}</span></p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${st.status.includes('Hazir') ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {st.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'teachers':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-emerald-600" /> Asatza Record / Teachers Staff
              </h3>
              <button 
                onClick={() => setActiveView(null)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 hover:bg-emerald-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
              <div className="p-4 bg-gray-50 border-b">
                <span className="font-semibold text-gray-700">Total Teaching Staff: {teachers.length} Instructors</span>
              </div>
              <div className="divide-y divide-gray-100">
                {teachers.map(t => (
                  <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div>
                      <p className="font-bold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-600">Subject: {t.subject} | Salary: {t.salary}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                      {t.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" /> Hazri Report / Daily Attendance Summary
              </h3>
              <button 
                onClick={() => setActiveView(null)}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 hover:bg-purple-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-emerald-500">
                <p className="text-gray-500 text-sm font-medium">Total Present (Hazir)</p>
                <p className="text-3xl font-extrabold text-emerald-600 mt-1">230 / 250</p>
                <p className="text-xs text-gray-400 mt-2">92% Overall School Attendance</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-red-500">
                <p className="text-gray-500 text-sm font-medium">Total Absent (Ghair Hazir)</p>
                <p className="text-3xl font-extrabold text-red-500 mt-1">20</p>
                <p className="text-xs text-gray-400 mt-2">SMS alerts sent to parents</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-blue-500">
                <p className="text-gray-500 text-sm font-medium">Teachers Present</p>
                <p className="text-3xl font-extrabold text-blue-600 mt-1">11 / 12</p>
                <p className="text-xs text-gray-400 mt-2">1 on approved leave</p>
              </div>
            </div>
          </div>
        );

      case 'fees':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-orange-50 p-4 rounded-2xl border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                <DollarSign className="w-6 h-6 text-orange-600" /> Fees Record / Tuition Ledger
              </h3>
              <button 
                onClick={() => setActiveView(null)}
                className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 hover:bg-orange-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-4">Monthly Fee Collection Status (October 2024)</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span>Class 7 Fee Collected</span>
                  <span className="font-bold text-emerald-600">Rs. 185,000 / 200,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span>Class 8 Fee Collected</span>
                  <span className="font-bold text-emerald-600">Rs. 210,000 / 220,000</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span>Pending Dues Total</span>
                  <span className="font-bold text-amber-600">Rs. 45,000</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'salary':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl border border-pink-200">
              <h3 className="text-xl font-bold text-pink-900 flex items-center gap-2">
                <Wallet className="w-6 h-6 text-pink-600" /> Teacher Salary / Tankha Record
              </h3>
              <button 
                onClick={() => setActiveView(null)}
                className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 hover:bg-pink-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-4">October 2024 Salary Disbursement</h4>
              <div className="divide-y divide-gray-100">
                {teachers.map(t => (
                  <div key={t.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.subject}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{t.salary.split(' ')[0]} {t.salary.split(' ')[1]}</p>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${t.salary.includes('Paid') ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {t.salary.includes('Paid') ? 'Ada Shuda (Paid)' : 'Baqi (Pending)'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-emerald-600" /> Notices & Circulars / Itlaat
              </h3>
              <button 
                onClick={() => setActiveView(null)}
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1 hover:bg-emerald-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-3">Broadcast New Notice / Naya Notice Jari Karein</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newNoticeTitle || !newNoticeDesc) return;
                setNotices([{ id: Date.now(), title: newNoticeTitle, date: currentDateStr, desc: newNoticeDesc }, ...notices]);
                setNewNoticeTitle("");
                setNewNoticeDesc("");
                alert("Notice successfully broadcasted to all teachers and students!");
              }} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Notice Title (e.g., Holiday on Iqbal Day)" 
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
                <textarea 
                  placeholder="Notice Description / Tafseel..." 
                  value={newNoticeDesc}
                  onChange={(e) => setNewNoticeDesc(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  rows={3}
                  required
                />
                <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                  <Send className="w-4 h-4" /> Broadcast Notice
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {notices.map(n => (
                <div key={n.id} className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-gray-800 text-lg">{n.title}</h5>
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-medium">{n.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // --- SUB-VIEW ROUTER FOR TEACHER ---
  const renderTeacherView = () => {
    switch (activeView) {
      case 'attendance':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-2xl border border-blue-200">
              <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                <ClipboardCheck className="w-6 h-6 text-blue-600" /> Mark Class 7 Attendance / Hazri Lagayein
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <p className="text-sm text-gray-600">Click student status to toggle between Present (Hazir) and Absent (Ghair Hazir):</p>
              <div className="divide-y divide-gray-100">
                {students.map((st, idx) => (
                  <div key={st.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800">{idx + 1}. {st.name} <span className="text-xs font-normal text-gray-500">(Roll #{st.rollNo})</span></p>
                    </div>
                    <button 
                      onClick={() => {
                        const updated = [...students];
                        updated[idx].status = updated[idx].status.includes('Hazir (Present)') ? 'Ghair Hazir (Absent)' : 'Hazir (Present)';
                        setStudents(updated);
                      }}
                      className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${st.status.includes('Hazir (Present)') ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
                    >
                      {st.status}
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => alert("Attendance successfully saved and synced with Principal office!")} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold shadow-md">
                Save & Submit Attendance
              </button>
            </div>
          </div>
        );

      case 'homework':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-purple-600" /> Assign Homework / Home Work Management
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-3">Add New Homework for Class 7</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newHwSubject || !newHwTask) return;
                setHomeworkList([{ id: Date.now(), subject: newHwSubject, task: newHwTask, dueDate: "Tomorrow", status: "Pending" }, ...homeworkList]);
                setNewHwSubject("");
                setNewHwTask("");
                alert("Homework successfully assigned to students!");
              }} className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Subject (e.g. Science / Computer)" 
                  value={newHwSubject}
                  onChange={(e) => setNewHwSubject(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  required
                />
                <textarea 
                  placeholder="Homework Details (e.g. Chapter 4 Exercise questions)..." 
                  value={newHwTask}
                  onChange={(e) => setNewHwTask(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                  rows={2}
                  required
                />
                <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-xl font-semibold">
                  Publish Homework
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {homeworkList.map(hw => (
                <div key={hw.id} className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-purple-500 flex justify-between items-center">
                  <div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">{hw.subject}</span>
                    <p className="font-bold text-gray-800 mt-1">{hw.task}</p>
                    <p className="text-xs text-gray-500 mt-1">Due Date: {hw.dueDate}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">{hw.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-orange-50 p-4 rounded-2xl border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-600" /> Leave Application / Chutti ki Darkhwast
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-3">Submit Leave Application to Principal</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newLeaveReason) return;
                setLeaveRequests([{ id: Date.now(), name: settings.principalName === 'Principal Sahab' ? 'Sir Tariq (Teacher)' : 'Teacher', reason: newLeaveReason, date: currentDateStr, status: 'زیر غور (Pending)' }, ...leaveRequests]);
                setNewLeaveReason("");
                alert("Leave application sent successfully to Principal office!");
              }} className="space-y-3">
                <textarea 
                  placeholder="Reason for Leave (Wajah e Chutti)..." 
                  value={newLeaveReason}
                  onChange={(e) => setNewLeaveReason(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  rows={3}
                  required
                />
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-semibold">
                  Send Application
                </button>
              </form>
            </div>

            <div className="space-y-3">
              {leaveRequests.map(lr => (
                <div key={lr.id} className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-orange-500 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{lr.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{lr.reason}</p>
                    <p className="text-xs text-gray-400 mt-1">{lr.date}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">{lr.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'classes':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                <School className="w-6 h-6 text-emerald-600" /> My Classes & Timetable / Meri Classes
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-emerald-500">
                <h4 className="font-bold text-gray-800 text-lg">Class 7 - Section A</h4>
                <p className="text-sm text-gray-600 mt-1">Total Students: 24</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between bg-gray-50 p-2 rounded-lg">
                    <span>1st Period (08:00 AM)</span>
                    <span className="font-semibold text-emerald-700">Mathematics</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-2 rounded-lg">
                    <span>2nd Period (08:45 AM)</span>
                    <span className="font-semibold text-emerald-700">English</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-blue-500">
                <h4 className="font-bold text-gray-800 text-lg">Class 8 - Section B</h4>
                <p className="text-sm text-gray-600 mt-1">Total Students: 26</p>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between bg-gray-50 p-2 rounded-lg">
                    <span>3rd Period (09:30 AM)</span>
                    <span className="font-semibold text-blue-700">Science</span>
                  </div>
                  <div className="flex justify-between bg-gray-50 p-2 rounded-lg">
                    <span>4th Period (10:15 AM)</span>
                    <span className="font-semibold text-blue-700">Computer Lab</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl border border-pink-200">
              <h3 className="text-xl font-bold text-pink-900 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-pink-600" /> Notices & Circulars / Itlaat
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="space-y-3">
              {notices.map(n => (
                <div key={n.id} className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-pink-500">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-gray-800 text-lg">{n.title}</h5>
                    <span className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium">{n.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // --- SUB-VIEW ROUTER FOR STUDENT ---
  const renderStudentView = () => {
    switch (activeView) {
      case 'homework':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-sky-50 p-4 rounded-2xl border border-sky-200">
              <h3 className="text-xl font-bold text-sky-900 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-sky-600" /> Mera Home Work / My Homework
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-sky-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="space-y-3">
              {homeworkList.map((hw, idx) => (
                <div key={hw.id} className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-sky-500 flex justify-between items-center">
                  <div>
                    <span className="text-xs bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded font-bold">{hw.subject}</span>
                    <p className="font-bold text-gray-800 text-lg mt-1">{hw.task}</p>
                    <p className="text-xs text-gray-500 mt-1">Due: {hw.dueDate}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const updated = [...homeworkList];
                      updated[idx].status = updated[idx].status === 'Completed' ? 'Pending' : 'Completed';
                      setHomeworkList(updated);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold ${hw.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                  >
                    {hw.status === 'Completed' ? 'Jama Ho Gaya (Done)' : 'Mark as Done'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'timetable':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-purple-50 p-4 rounded-2xl border border-purple-200">
              <h3 className="text-xl font-bold text-purple-900 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" /> Class 7 Time Table / Waqt ki Fard
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div><p className="font-bold text-gray-800">1st Period (08:00 AM - 08:45 AM)</p><p className="text-xs text-gray-500">Riazi (Maths) - Sir Tariq</p></div>
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">Room 7A</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div><p className="font-bold text-gray-800">2nd Period (08:45 AM - 09:30 AM)</p><p className="text-xs text-gray-500">English - Ma'am Ayesha</p></div>
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">Room 7A</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div><p className="font-bold text-gray-800">3rd Period (09:45 AM - 10:30 AM)</p><p className="text-xs text-gray-500">Islamiat - Ma'am Shagufta</p></div>
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">Room 7A</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div><p className="font-bold text-gray-800">4th Period (10:30 AM - 11:15 AM)</p><p className="text-xs text-gray-500">Computer Science - Sir Bilal</p></div>
                <span className="text-xs bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">Lab 1</span>
              </div>
            </div>
          </div>
        );

      case 'result':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-orange-50 p-4 rounded-2xl border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-orange-600" /> Mid-Term Result / Nateeja
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6 space-y-4">
              <div className="flex justify-between items-center bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                <div>
                  <h4 className="font-bold text-emerald-900 text-lg">Ahmed (Roll #07)</h4>
                  <p className="text-xs text-emerald-700">Jamaat 7 - First Position / A+ Grade</p>
                </div>
                <span className="text-2xl font-extrabold text-emerald-600">92%</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm font-medium">
                  <span>Riazi (Maths)</span>
                  <span className="text-emerald-700 font-bold">95 / 100</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm font-medium">
                  <span>English</span>
                  <span className="text-emerald-700 font-bold">88 / 100</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm font-medium">
                  <span>Urdu</span>
                  <span className="text-emerald-700 font-bold">90 / 100</span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl text-sm font-medium">
                  <span>Science</span>
                  <span className="text-emerald-700 font-bold">94 / 100</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notices':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-pink-50 p-4 rounded-2xl border border-pink-200">
              <h3 className="text-xl font-bold text-pink-900 flex items-center gap-2">
                <Megaphone className="w-6 h-6 text-pink-600" /> School Notices / Itlaat
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="space-y-3">
              {notices.map(n => (
                <div key={n.id} className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-pink-500">
                  <div className="flex justify-between items-start">
                    <h5 className="font-bold text-gray-800 text-lg">{n.title}</h5>
                    <span className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium">{n.date}</span>
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'leave':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-orange-50 p-4 rounded-2xl border border-orange-200">
              <h3 className="text-xl font-bold text-orange-900 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-600" /> Leave Application / Chutti ki Darkhwast
              </h3>
              <button onClick={() => setActiveView(null)} className="bg-orange-600 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h4 className="font-bold text-gray-800 mb-3">Apply for Leave to Class Teacher</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newLeaveReason) return;
                setLeaveRequests([{ id: Date.now(), name: "Ahmed (Class 7)", reason: newLeaveReason, date: currentDateStr, status: "زیر غور (Pending)" }, ...leaveRequests]);
                setNewLeaveReason("");
                alert("Leave application sent to Sir Tariq (Class Teacher)!");
              }} className="space-y-3">
                <textarea 
                  placeholder="Leave reason (e.g., Tabiyat kharab hai)..." 
                  value={newLeaveReason}
                  onChange={(e) => setNewLeaveReason(e.target.value)}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  rows={3}
                  required
                />
                <button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-semibold">
                  Submit Application
                </button>
              </form>
            </div>
            <div className="space-y-3">
              {leaveRequests.map(lr => (
                <div key={lr.id} className="bg-white p-4 rounded-2xl shadow-md border-l-4 border-orange-500 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-gray-800">{lr.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{lr.reason}</p>
                    <p className="text-xs text-gray-400 mt-1">{lr.date}</p>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-800 rounded-full">{lr.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans select-none">
      
      {/* SUCCESS TOAST MESSAGE */}
      {installSuccessMessage && (
        <div className="fixed top-16 left-4 right-4 max-w-md mx-auto bg-emerald-600 text-white rounded-2xl shadow-2xl p-4 z-50 flex items-center justify-center gap-3 font-bold animate-in slide-in-from-top duration-300">
          <CheckCircle2 className="w-6 h-6 text-amber-300" />
          <span>Install ho gayi! App ab aap ke mobile home screen par mojood hai.</span>
        </div>
      )}

      {/* TOP GREEN HEADER */}
      <header className="bg-emerald-700 text-white shadow-lg sticky top-0 z-40 px-4 py-3 flex items-center justify-between border-b-4 border-emerald-800">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveRole('home'); setActiveView(null); }}>
          <div className="w-11 h-11 bg-emerald-800 rounded-2xl flex items-center justify-center shadow-inner border border-emerald-600">
            <BookOpen className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-extrabold tracking-wide flex items-center gap-2">
              {settings.schoolName} <span className="text-xs bg-emerald-800 text-amber-300 px-2.5 py-0.5 rounded-full font-semibold">Model</span>
            </h1>
            <p className="text-xs text-emerald-100 font-medium opacity-90">{settings.subName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {activeRole !== 'home' && (
            <button 
              onClick={() => { setActiveRole('home'); setActiveView(null); }}
              className="bg-emerald-800 hover:bg-emerald-900 text-emerald-100 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
            >
              <Home className="w-4 h-4" /> Home
            </button>
          )}
          <button 
            onClick={() => { setFormSettings(settings); setShowSettingsModal(true); }}
            className="w-10 h-10 bg-emerald-800 hover:bg-emerald-900 rounded-xl flex items-center justify-center text-white transition-all shadow-sm"
            title="School Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 md:p-6 pb-24">

        {/* ================= HOME SCREEN / ROLE SELECTOR ================= */}
        {activeRole === 'home' && (
          <div className="space-y-6">
            
            {/* REAL PWA INSTALL BUTTON ON TOP BELOW HEADER */}
            {!isInstalled && (
              <button
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white p-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 font-extrabold text-lg transition-all transform hover:scale-[1.01] active:scale-95 border-2 border-emerald-400 animate-pulse"
              >
                <Download className="w-6 h-6 animate-bounce" />
                <span>📲 App Install Karein / Download App</span>
              </button>
            )}

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden border border-emerald-500">
              <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="relative z-10">
                <span className="text-xs uppercase tracking-widest bg-amber-400 text-emerald-950 font-black px-3 py-1 rounded-full">
                  Bismillah-ir-Rahman-ir-Rahim
                </span>
                <h2 className="text-2xl md:text-3xl font-black mt-3">Welcome to {settings.schoolName}</h2>
                <p className="text-emerald-100 text-sm md:text-base mt-1 max-w-xl">
                  {settings.subName} — Digital Portal for Principal, Teachers, and Students. Tap your role below to open your dashboard.
                </p>
              </div>
            </div>

            {/* 3 Big Role Selection Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Principal Card */}
              <button 
                onClick={() => { setActiveRole('principal'); setActiveView(null); }}
                className="group bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center transition-all transform hover:-translate-y-1 active:scale-95 border-b-6 border-amber-800"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Award className="w-8 h-8 text-amber-100" />
                </div>
                <h3 className="text-xl font-black">Principal Portal</h3>
                <p className="text-xs text-amber-100 font-medium mt-1">Principal Sahab Dashboard</p>
                <span className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
                  Khulain &rarr;
                </span>
              </button>

              {/* Teacher Card */}
              <button 
                onClick={() => { setActiveRole('teacher'); setActiveView(null); }}
                className="group bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center transition-all transform hover:-translate-y-1 active:scale-95 border-b-6 border-emerald-900"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <GraduationCap className="w-8 h-8 text-emerald-100" />
                </div>
                <h3 className="text-xl font-black">Teacher Portal</h3>
                <p className="text-xs text-emerald-100 font-medium mt-1">Asatza & Classes Dashboard</p>
                <span className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
                  Khulain &rarr;
                </span>
              </button>

              {/* Student Card */}
              <button 
                onClick={() => { setActiveRole('student'); setActiveView(null); }}
                className="group bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white p-6 rounded-3xl shadow-xl flex flex-col items-center text-center transition-all transform hover:-translate-y-1 active:scale-95 border-b-6 border-blue-900"
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
                  <Users className="w-8 h-8 text-blue-100" />
                </div>
                <h3 className="text-xl font-black">Student Portal</h3>
                <p className="text-xs text-blue-100 font-medium mt-1">Talba & Homework Dashboard</p>
                <span className="mt-4 bg-white/20 hover:bg-white/30 px-4 py-1.5 rounded-full text-xs font-bold transition-colors">
                  Khulain &rarr;
                </span>
              </button>
            </div>

            {/* Quick School Ticker */}
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200 flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm">Latest School Announcement</h4>
                <p className="text-xs text-gray-600">{notices[0]?.title}: {notices[0]?.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= PRINCIPAL DASHBOARD ================= */}
        {activeRole === 'principal' && (
          <div className="space-y-6">
            {/* Top Greeting */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full">
                  Principal Dashboard
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-800 mt-2">
                  Khush Amdeed, {settings.principalName}
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Aaj {currentDateStr} • All Systems Active</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center font-bold shadow-inner">
                <Award className="w-6 h-6" />
              </div>
            </div>

            {/* Light Orange Card */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-orange-900 font-bold text-sm uppercase tracking-wider mb-1">Aaj ki Report</h3>
              <p className="text-orange-950 font-extrabold text-lg md:text-xl">
                Total Students: <span className="text-blue-600">250</span> — Total Teachers: <span className="text-emerald-600">12</span> — Aaj Hazir: <span className="text-purple-600">230</span>
              </p>
            </div>

            {/* Active Sub-View or Grid */}
            {activeView ? (
              renderPrincipalView()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Students / Talba */}
                <button 
                  onClick={() => setActiveView('students')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Users className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Students / Talba</h3>
                    <p className="text-xs text-blue-100 mt-0.5">View & manage student rolls, status & fees</p>
                  </div>
                </button>

                {/* 2. Teachers / Asatza */}
                <button 
                  onClick={() => setActiveView('teachers')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Teachers / Asatza</h3>
                    <p className="text-xs text-emerald-100 mt-0.5">View teaching staff, subjects & attendance</p>
                  </div>
                </button>

                {/* 3. Attendance Report / Hazri Report */}
                <button 
                  onClick={() => setActiveView('attendance')}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Attendance Report / Hazri</h3>
                    <p className="text-xs text-purple-100 mt-0.5">Daily attendance analytics & percentages</p>
                  </div>
                </button>

                {/* 4. Fees / Fees Record */}
                <button 
                  onClick={() => setActiveView('fees')}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <DollarSign className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Fees / Fees Record</h3>
                    <p className="text-xs text-orange-100 mt-0.5">Track tuition fee collection & dues</p>
                  </div>
                </button>

                {/* 5. Teacher Salary / Tankha */}
                <button 
                  onClick={() => setActiveView('salary')}
                  className="bg-pink-600 hover:bg-pink-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Wallet className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Teacher Salary / Tankha</h3>
                    <p className="text-xs text-pink-100 mt-0.5">Staff salaries, payment status & slips</p>
                  </div>
                </button>

                {/* 6. Notices / Itlaat (Full Width) */}
                <button 
                  onClick={() => setActiveView('notices')}
                  className="md:col-span-2 bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Megaphone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Notices / Itlaat (Announcements)</h3>
                    <p className="text-xs text-emerald-100 mt-0.5">Broadcast circulars & school-wide messages</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= TEACHER DASHBOARD ================= */}
        {activeRole === 'teacher' && (
          <div className="space-y-6">
            {/* Top Greeting */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                  Teacher Dashboard
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-800 mt-2">
                  Khush Amdeed, Sir / Madam
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Aaj {currentDateStr} • Class 7 Incharge</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center font-bold shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
            </div>

            {/* Light Green Card */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-emerald-900 font-bold text-sm uppercase tracking-wider mb-1">Aaj ki Hazri</h3>
              <p className="text-emerald-950 font-extrabold text-lg md:text-xl">
                Class 7 — <span className="text-emerald-700">24 Talba Mojood</span> (Present)
              </p>
            </div>

            {/* Active Sub-View or Grid */}
            {activeView ? (
              renderTeacherView()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Attendance / Hazri */}
                <button 
                  onClick={() => setActiveView('attendance')}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Attendance / Hazri</h3>
                    <p className="text-xs text-blue-100 mt-0.5">Mark daily student attendance for Class 7</p>
                  </div>
                </button>

                {/* 2. Homework / Home Work */}
                <button 
                  onClick={() => setActiveView('homework')}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Homework / Home Work</h3>
                    <p className="text-xs text-purple-100 mt-0.5">Assign daily subject tasks & exercises</p>
                  </div>
                </button>

                {/* 3. Leave Application / Chutti ki Darkhwast */}
                <button 
                  onClick={() => setActiveView('leave')}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Leave / Chutti ki Darkhwast</h3>
                    <p className="text-xs text-orange-100 mt-0.5">Submit leave request to principal</p>
                  </div>
                </button>

                {/* 4. My Classes / Meri Classes */}
                <button 
                  onClick={() => setActiveView('classes')}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <School className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">My Classes / Meri Classes</h3>
                    <p className="text-xs text-emerald-100 mt-0.5">Timetable, sections & student lists</p>
                  </div>
                </button>

                {/* 5. Notices / Itlaat (Full Width) */}
                <button 
                  onClick={() => setActiveView('notices')}
                  className="md:col-span-2 bg-pink-600 hover:bg-pink-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Megaphone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Notices / Itlaat</h3>
                    <p className="text-xs text-pink-100 mt-0.5">Read school circulars and announcements</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= STUDENT DASHBOARD ================= */}
        {activeRole === 'student' && (
          <div className="space-y-6">
            {/* Top Greeting */}
            <div className="bg-white rounded-3xl p-6 shadow-md border border-gray-100 flex items-center justify-between">
              <div>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">
                  Student Dashboard
                </span>
                <h2 className="text-xl md:text-2xl font-black text-gray-800 mt-2">
                  Khush Amdeed, Ahmed
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">Jamaat 7 (Roll #07) • {currentDateStr}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center font-bold shadow-inner">
                <Users className="w-6 h-6" />
              </div>
            </div>

            {/* Light Blue Card */}
            <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-3xl p-5 shadow-sm">
              <h3 className="text-sky-900 font-bold text-sm uppercase tracking-wider mb-1">Aaj ka Home Work</h3>
              <p className="text-sky-950 font-extrabold text-lg md:text-xl">
                Riazi: Mashq 3.2 — <span className="text-orange-600">Jama Karwain Aaj</span>
              </p>
            </div>

            {/* Active Sub-View or Grid */}
            {activeView ? (
              renderStudentView()
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. My Homework / Mera Home Work */}
                <button 
                  onClick={() => setActiveView('homework')}
                  className="bg-sky-500 hover:bg-sky-600 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">My Homework / Mera Home Work</h3>
                    <p className="text-xs text-sky-100 mt-0.5">View pending assignments & mark complete</p>
                  </div>
                </button>

                {/* 2. Timetable / Time Table */}
                <button 
                  onClick={() => setActiveView('timetable')}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Timetable / Time Table</h3>
                    <p className="text-xs text-purple-100 mt-0.5">Weekly class schedule & periods</p>
                  </div>
                </button>

                {/* 3. Result / Nateeja */}
                <button 
                  onClick={() => setActiveView('result')}
                  className="bg-orange-600 hover:bg-orange-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Result / Nateeja</h3>
                    <p className="text-xs text-orange-100 mt-0.5">Exam marksheet, grades & percentages</p>
                  </div>
                </button>

                {/* 4. Notices / Itlaat */}
                <button 
                  onClick={() => setActiveView('notices')}
                  className="bg-pink-600 hover:bg-pink-700 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <Megaphone className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Notices / Itlaat</h3>
                    <p className="text-xs text-pink-100 mt-0.5">School circulars & announcements</p>
                  </div>
                </button>

                {/* 5. Leave / Chutti ki Darkhwast (Full Width) */}
                <button 
                  onClick={() => setActiveView('leave')}
                  className="md:col-span-2 bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-3xl shadow-lg flex items-center gap-4 text-left transition-all transform hover:scale-[1.01] active:scale-95"
                >
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                    <FileText className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Leave / Chutti ki Darkhwast</h3>
                    <p className="text-xs text-orange-100 mt-0.5">Request leave from class teacher</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <nav className="bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-30 shadow-lg px-4 py-2">
        <div className="max-w-md mx-auto flex justify-around items-center">
          <button 
            onClick={() => { setActiveRole('home'); setActiveView(null); }}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${activeRole === 'home' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-xs">Home</span>
          </button>
          <button 
            onClick={() => { setActiveRole('principal'); setActiveView(null); }}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${activeRole === 'principal' ? 'text-amber-700 font-bold bg-amber-50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Award className="w-5 h-5 mb-0.5" />
            <span className="text-xs">Principal</span>
          </button>
          <button 
            onClick={() => { setActiveRole('teacher'); setActiveView(null); }}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${activeRole === 'teacher' ? 'text-emerald-700 font-bold bg-emerald-50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <GraduationCap className="w-5 h-5 mb-0.5" />
            <span className="text-xs">Teacher</span>
          </button>
          <button 
            onClick={() => { setActiveRole('student'); setActiveView(null); }}
            className={`flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${activeRole === 'student' ? 'text-blue-700 font-bold bg-blue-50' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-xs">Student</span>
          </button>
        </div>
      </nav>

      {/* ================= 5-SECOND AUTO INSTALL POPUP ================= */}
      {showAutoInstallPopup && !isInstalled && (
        <div className="fixed bottom-20 left-4 right-4 max-w-md mx-auto bg-white rounded-2xl shadow-2xl p-4 border-2 border-emerald-600 z-50 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center shrink-0">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Is app ko mobile me install karein?</h4>
              <p className="text-xs text-gray-500">Fast access & offline support</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => {
                setShowAutoInstallPopup(false);
                localStorage.setItem('minhaj_install_dismissed', 'true');
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-100"
            >
              Baad Me
            </button>
            <button 
              onClick={handleInstallClick}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md"
            >
              Install Karein
            </button>
          </div>
        </div>
      )}

      {/* ================= MANUAL INSTALL GUIDE MODAL (URDU) ================= */}
      {showInstallGuideModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <Download className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">App Install Karein</h3>
            <p className="text-sm text-gray-700 bg-emerald-50 p-4 rounded-2xl border border-emerald-200 font-bold leading-relaxed">
              Chrome ke 3 dots dabayen &gt; Add to Home Screen &gt; Install dabayen
            </p>
            <button 
              onClick={() => setShowInstallGuideModal(false)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-md"
            >
              Theek Hai / Close
            </button>
          </div>
        </div>
      )}

      {/* ================= SETTINGS MODAL ================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-600" /> School Settings & Profile
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">School Name</label>
                <input 
                  type="text" 
                  value={formSettings.schoolName}
                  onChange={(e) => setFormSettings({...formSettings, schoolName: e.target.value})}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">School Sub-Name / Branch</label>
                <input 
                  type="text" 
                  value={formSettings.subName}
                  onChange={(e) => setFormSettings({...formSettings, subName: e.target.value})}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Principal Name</label>
                <input 
                  type="text" 
                  value={formSettings.principalName}
                  onChange={(e) => setFormSettings({...formSettings, principalName: e.target.value})}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address / Location</label>
                <input 
                  type="text" 
                  value={formSettings.address}
                  onChange={(e) => setFormSettings({...formSettings, address: e.target.value})}
                  className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
                  required
                />
              </div>

              {/* INSTALL APP BUTTON IN SETTINGS */}
              {!isInstalled && (
                <div className="pt-2">
                  <button 
                    type="button"
                    onClick={() => { setShowSettingsModal(false); handleInstallClick(); }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" /> App Install Karein
                  </button>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowSettingsModal(false)}
                  className="px-4 py-2 rounded-xl border text-gray-600 text-sm font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
