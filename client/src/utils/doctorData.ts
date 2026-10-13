export interface DoctorDetail {
  doctorId: string;
  name: string;
  specialization: string;
  department: string;
  qualifications: string;
  experienceYears: number;
  roomNumber: string;
  availability: 'Available Today' | 'In Consultation' | 'On Clinical Shift' | 'On Call';
  avatarUrl: string;
  phone: string;
  email: string;
  bio: string;
  languages: string[];
  education: string;
  awards: string;
}

export const DOCTOR_PROFILES: Record<string, DoctorDetail> = {
  DOC001: {
    doctorId: 'DOC001',
    name: 'Dr. John Smith',
    specialization: 'General Medicine',
    department: 'Internal Medicine & Acute Care',
    qualifications: 'MD, FACP, Board Certified Internal Medicine',
    experienceYears: 16,
    roomNumber: 'Suite 302-B',
    availability: 'Available Today',
    avatarUrl: '/images/dr_john_smith.jpg',
    phone: '+1 555-0101',
    email: 'dr.smith@medicore.com',
    bio: 'Senior Attending Physician and Chief of General Medicine. Specializes in multi-system adult chronic care, preventive diagnostics, and emergency triage pathways.',
    languages: ['English', 'Spanish'],
    education: 'Harvard Medical School (MD), Johns Hopkins Hospital (Residency)',
    awards: 'Excellence in Clinical Leadership 2024, Distinguished Physician Fellow',
  },
  DOC002: {
    doctorId: 'DOC002',
    name: 'Dr. Priya Kumar',
    specialization: 'Cardiology',
    department: 'Heart & Vascular Institute',
    qualifications: 'MD, DM, FACC, Interventional Cardiology Specialist',
    experienceYears: 14,
    roomNumber: 'Suite 410-A',
    availability: 'In Consultation',
    avatarUrl: '/images/dr_priya_kumar.jpg',
    phone: '+1 555-0102',
    email: 'dr.kumar@medicore.com',
    bio: 'Director of Non-Invasive Cardiac Imaging. Expert in coronary artery assessment, advanced echocardiography, preventive lipidology, and rhythm management.',
    languages: ['English', 'Hindi', 'Tamil'],
    education: 'All India Institute of Medical Sciences (MD), Stanford Medicine (Fellowship)',
    awards: 'Top Cardiovascular Clinician Award, ACC Senior Investigator Grant',
  },
  DOC003: {
    doctorId: 'DOC003',
    name: 'Dr. David Lee',
    specialization: 'Orthopedics',
    department: 'Orthopedic Surgery & Sports Medicine',
    qualifications: 'MD, FAAOS, Adult Joint Reconstruction Fellow',
    experienceYears: 12,
    roomNumber: 'Suite 205-C',
    availability: 'Available Today',
    avatarUrl: '/images/dr_david_lee.jpg',
    phone: '+1 555-0103',
    email: 'dr.lee@medicore.com',
    bio: 'Specialist in minimally invasive arthroscopy, total joint replacement, athletic ligament recovery, and degenerative osteoarticular treatments.',
    languages: ['English', 'Korean', 'Mandarin'],
    education: 'UCSF School of Medicine, Hospital for Special Surgery (Fellowship)',
    awards: 'Orthopedic Innovation Pioneer, AO Foundation Research Fellow',
  },
  DOC004: {
    doctorId: 'DOC004',
    name: 'Dr. Sarah Johnson',
    specialization: 'Pediatrics',
    department: 'Child Health & Developmental Pediatrics',
    qualifications: 'MD, FAAP, Pediatric Critical Care Accredited',
    experienceYears: 11,
    roomNumber: 'Suite 108-A',
    availability: 'On Clinical Shift',
    avatarUrl: '/images/dr_sarah_johnson.jpg',
    phone: '+1 555-0104',
    email: 'dr.johnson@medicore.com',
    bio: 'Consultant Pediatrician providing newborn wellness, pediatric developmental milestones tracking, allergy mitigation, and family-centered pediatric care.',
    languages: ['English', 'French'],
    education: 'Columbia University Vagelos College of Physicians and Surgeons',
    awards: 'Compassionate Pediatrician Award, Children’s Health Champion 2023',
  },
  DOC005: {
    doctorId: 'DOC005',
    name: 'Dr. Michael Chen',
    specialization: 'Neurology',
    department: 'Neuroscience & Stroke Center',
    qualifications: 'MD, PhD, FAAN, Neuro-Oncology & Cognitive Health',
    experienceYears: 18,
    roomNumber: 'Suite 512-D',
    availability: 'Available Today',
    avatarUrl: '/images/dr_michael_chen.jpg',
    phone: '+1 555-0105',
    email: 'dr.chen@medicore.com',
    bio: 'Senior Neurologist leading stroke management protocols, chronic migraine headache therapy, electrophysiology, and neurodegenerative disease mitigation.',
    languages: ['English', 'Mandarin', 'Cantonese'],
    education: 'Yale School of Medicine (MD/PhD), Massachusetts General Hospital (Residency)',
    awards: 'National Stroke Association Excellence Award, AAN Master Clinician',
  },
};

export const getDoctorPhoto = (doctorId?: string, name?: string): string => {
  if (doctorId && DOCTOR_PROFILES[doctorId]) {
    return DOCTOR_PROFILES[doctorId].avatarUrl;
  }
  if (name) {
    const matched = Object.values(DOCTOR_PROFILES).find((d) =>
      name.toLowerCase().includes(d.name.toLowerCase().replace('dr. ', ''))
    );
    if (matched) return matched.avatarUrl;
  }
  return '/images/dr_john_smith.jpg';
};

export const getDoctorDetail = (doctorId?: string, name?: string): DoctorDetail | undefined => {
  if (doctorId && DOCTOR_PROFILES[doctorId]) {
    return DOCTOR_PROFILES[doctorId];
  }
  if (name) {
    return Object.values(DOCTOR_PROFILES).find((d) =>
      name.toLowerCase().includes(d.name.toLowerCase().replace('dr. ', ''))
    );
  }
  return undefined;
};
