// profileData.js — field definitions for Student and Interviewer forms

export const studentFields = [
  { id: "fullName",        label: "Full Name",              type: "text",   placeholder: "John Doe",                    icon: "👤" },
  { id: "email",           label: "Email Address",          type: "email",  placeholder: "john@university.edu",         icon: "✉️" },
  { id: "phone",           label: "Phone Number",           type: "tel",    placeholder: "+91 98765 43210",             icon: "📱" },
  { id: "college",         label: "College / University",   type: "text",   placeholder: "IIT Delhi",                  icon: "🏫" },
  { id: "degree",          label: "Degree & Branch",        type: "text",   placeholder: "B.Tech – Computer Science",  icon: "🎓" },
  { id: "graduationYear",  label: "Graduation Year",        type: "number", placeholder: "2026",                       icon: "📅" },
  { id: "cgpa",            label: "CGPA / Percentage",      type: "text",   placeholder: "8.5 / 10",                   icon: "📊" },
  { id: "skills",          label: "Skills",                 type: "text",   placeholder: "React, Node.js, Python…",    icon: "🛠️" },
  { id: "linkedin",        label: "LinkedIn Profile",       type: "url",    placeholder: "linkedin.com/in/johndoe",    icon: "🔗" },
  { id: "resume",          label: "Resume Link / Portfolio",type: "url",    placeholder: "github.com/johndoe",         icon: "📄" },
];

export const interviewerFields = [
  { id: "fullName",    label: "Full Name",            type: "text",   placeholder: "Jane Smith",                  icon: "👤" },
  { id: "email",       label: "Work Email",           type: "email",  placeholder: "jane@company.com",            icon: "✉️" },
  { id: "phone",       label: "Phone Number",         type: "tel",    placeholder: "+91 98765 43210",             icon: "📱" },
  { id: "company",     label: "Company Name",         type: "text",   placeholder: "Google, Infosys…",            icon: "🏢" },
  { id: "designation", label: "Designation",          type: "text",   placeholder: "Senior Software Engineer",    icon: "💼" },
  { id: "experience",  label: "Years of Experience",  type: "number", placeholder: "8",                           icon: "⏳" },
  { id: "domain",      label: "Domain / Expertise",   type: "text",   placeholder: "Backend, ML, Product…",       icon: "🎯" },
  { id: "hiringFor",   label: "Hiring For Roles",     type: "text",   placeholder: "SDE-1, SDE-2, Intern…",       icon: "📋" },
  { id: "linkedin",    label: "LinkedIn Profile",     type: "url",    placeholder: "linkedin.com/in/janesmith",   icon: "🔗" },
  { id: "website",     label: "Company Website",      type: "url",    placeholder: "company.com",                 icon: "🌐" },
];

export const roleConfig = [
  {
    key: "student",
    emoji: "🎓",
    label: "Student",
    desc: "Looking for jobs, internships & opportunities",
    formTitle: "🎓 Student Details",
    submitLabel: "Submit Student Profile →",
  },
  {
    key: "interviewer",
    emoji: "💼",
    label: "Interviewer",
    desc: "Hiring talent & conducting interviews",
    formTitle: "💼 Interviewer Details",
    submitLabel: "Submit Interviewer Profile →",
  },
];