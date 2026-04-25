export type Candidate = {
  name: string;
  skills: string[];
  experience: number;
  location: string;
  currentRole: string;
  profileType: "frontend" | "backend" | "fullstack";
};

export const candidates: Candidate[] = [
  { name: "Rahul", skills: ["Laravel", "Vue", "MySQL", "API"], experience: 4, location: "Ahmedabad", currentRole: "Full Stack Developer", profileType: "fullstack" },
  { name: "Priya", skills: ["React", "TypeScript", "Tailwind", "JavaScript"], experience: 3, location: "Pune", currentRole: "Frontend Developer", profileType: "frontend" },
  { name: "Amit", skills: ["Laravel", "MySQL", "API", "PHP"], experience: 5, location: "Surat", currentRole: "Backend Developer", profileType: "backend" },
  { name: "Sneha", skills: ["Vue", "Nuxt", "Tailwind", "TypeScript"], experience: 2, location: "Vadodara", currentRole: "UI Developer", profileType: "frontend" },
  { name: "Karan", skills: ["Laravel", "PHP", "MySQL", "Docker"], experience: 6, location: "Rajkot", currentRole: "Senior Backend Engineer", profileType: "backend" },
  { name: "Meera", skills: ["Vue", "TypeScript", "Tailwind", "JavaScript"], experience: 4, location: "Ahmedabad", currentRole: "Frontend Engineer", profileType: "frontend" },
  { name: "Vikas", skills: ["Node", "API", "PostgreSQL", "AWS"], experience: 5, location: "Bengaluru", currentRole: "Platform Engineer", profileType: "backend" },
  { name: "Anita", skills: ["Laravel", "Nuxt", "MySQL", "API"], experience: 3, location: "Pune", currentRole: "Full Stack Developer", profileType: "fullstack" },
  { name: "Dev", skills: ["React", "TypeScript", "Tailwind", "JavaScript"], experience: 4, location: "Mumbai", currentRole: "Frontend Engineer", profileType: "frontend" },
  { name: "Pooja", skills: ["PHP", "Laravel", "PostgreSQL", "API"], experience: 5, location: "Delhi", currentRole: "Software Engineer", profileType: "backend" },
  { name: "Rohit", skills: ["Vue", "Nuxt", "Tailwind", "JavaScript"], experience: 3, location: "Ahmedabad", currentRole: "Frontend Developer", profileType: "frontend" },
  { name: "Nisha", skills: ["JavaScript", "React", "Tailwind", "TypeScript"], experience: 2, location: "Jaipur", currentRole: "Junior Frontend Developer", profileType: "frontend" },
  { name: "Arjun", skills: ["Laravel", "Vue", "Tailwind", "API"], experience: 4, location: "Indore", currentRole: "Full Stack Developer", profileType: "fullstack" },
  { name: "Isha", skills: ["MySQL", "API", "PostgreSQL", "PHP"], experience: 3, location: "Udaipur", currentRole: "Backend Developer", profileType: "backend" },
  { name: "Manav", skills: ["PHP", "Laravel", "API", "AWS"], experience: 7, location: "Hyderabad", currentRole: "Lead Backend Engineer", profileType: "backend" }
];
