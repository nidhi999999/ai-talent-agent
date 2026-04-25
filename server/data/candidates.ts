export type Candidate = {
  name: string;
  skills: string[];
  experience: number;
  location: string;
  currentRole: string;
};

export const candidates: Candidate[] = [
  { name: "Rahul", skills: ["Laravel", "Vue", "MySQL", "API"], experience: 4, location: "Ahmedabad", currentRole: "Full Stack Developer" },
  { name: "Priya", skills: ["Node", "React", "MongoDB"], experience: 3, location: "Pune", currentRole: "Frontend Developer" },
  { name: "Amit", skills: ["Laravel", "MySQL", "API"], experience: 5, location: "Surat", currentRole: "Backend Developer" },
  { name: "Sneha", skills: ["Vue", "Nuxt", "Tailwind"], experience: 2, location: "Vadodara", currentRole: "UI Developer" },
  { name: "Karan", skills: ["Laravel", "PHP", "MySQL", "Docker"], experience: 6, location: "Rajkot", currentRole: "Senior Backend Engineer" },
  { name: "Meera", skills: ["Vue", "TypeScript", "API"], experience: 4, location: "Ahmedabad", currentRole: "Frontend Engineer" },
  { name: "Vikas", skills: ["Node", "API", "PostgreSQL", "AWS"], experience: 5, location: "Bengaluru", currentRole: "Platform Engineer" },
  { name: "Anita", skills: ["Laravel", "Nuxt", "MySQL"], experience: 3, location: "Pune", currentRole: "Full Stack Developer" },
  { name: "Dev", skills: ["React", "TypeScript", "MongoDB"], experience: 4, location: "Mumbai", currentRole: "Frontend Engineer" },
  { name: "Pooja", skills: ["PHP", "Laravel", "PostgreSQL"], experience: 5, location: "Delhi", currentRole: "Software Engineer" },
  { name: "Rohit", skills: ["Vue", "Nuxt", "API", "Docker"], experience: 3, location: "Ahmedabad", currentRole: "Frontend Developer" },
  { name: "Nisha", skills: ["JavaScript", "Node", "AWS"], experience: 2, location: "Jaipur", currentRole: "Junior Developer" },
  { name: "Arjun", skills: ["Laravel", "Vue", "Tailwind"], experience: 4, location: "Indore", currentRole: "Full Stack Developer" },
  { name: "Isha", skills: ["MySQL", "API", "TypeScript"], experience: 3, location: "Udaipur", currentRole: "Backend Developer" },
  { name: "Manav", skills: ["PHP", "Laravel", "API", "AWS"], experience: 7, location: "Hyderabad", currentRole: "Lead Engineer" }
];
