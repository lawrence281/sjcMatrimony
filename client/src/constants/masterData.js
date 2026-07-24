// ─────────────────────────────────────────────
// RC Christian Matrimony Master Data
// All static lookup lists used across the profile module
// ─────────────────────────────────────────────

export const DENOMINATIONS = [
  'Roman Catholic',
  'Latin Catholic',
  'Syro Malabar',
  'Syro Malankara',
  'Chaldean Syrian',
  'Malankara Orthodox',
  'Malankara Catholic',
  'CSI (Church of South India)',
  'CNI (Church of North India)',
  'Methodist',
  'Baptist',
  'Pentecostal',
  'Lutheran',
  'Presbyterian',
  'Seventh-day Adventist',
  'Assemblies of God',
  'Brethren',
  'Jacobite Syrian',
  'Other Christian',
];

export const DIOCESES = [
  // Tamil Nadu Catholic Dioceses
  'Archdiocese of Madras-Mylapore',
  'Archdiocese of Pondicherry-Cuddalore',
  'Diocese of Coimbatore',
  'Diocese of Madurai',
  'Diocese of Tiruchirappalli',
  'Diocese of Salem',
  'Diocese of Tirunelveli',
  'Diocese of Vellore',
  'Diocese of Kumbakonam',
  'Diocese of Palayamkottai',
  'Diocese of Kottar',
  'Diocese of Ooty (Ootacamund)',
  'Diocese of Dindigul',
  'Diocese of Sivagangai',
  'Diocese of Thoothukudi-Nazareth',
  'Diocese of Thanjavur',
  // Kerala Catholic Dioceses
  'Archdiocese of Ernakulam-Angamaly',
  'Archdiocese of Thrissur',
  'Archdiocese of Trivandrum',
  'Diocese of Calicut',
  'Diocese of Kannur',
  'Diocese of Kothamangalam',
  'Diocese of Palai',
  'Diocese of Thamarasserry',
  'Diocese of Irinjalakuda',
  'Diocese of Mananthavady',
  'Diocese of Punalur',
  // Syro-Malabar
  'Archeparchy of Ernakulam-Angamaly (Syro-Malabar)',
  'Eparchy of Thrissur (Syro-Malabar)',
  'Eparchy of Palai (Syro-Malabar)',
  'Eparchy of Changanacherry (Syro-Malabar)',
  // Syro-Malankara
  'Archeparchy of Trivandrum (Syro-Malankara)',
  'Eparchy of Tiruvalla (Syro-Malankara)',
  'Other Diocese',
];

export const MOTHER_TONGUES = [
  'Tamil',
  'Malayalam',
  'Telugu',
  'Kannada',
  'Hindi',
  'English',
  'Konkani',
  'Tulu',
  'Marathi',
  'Bengali',
  'Punjabi',
  'Gujarati',
  'Odia',
  'Assamese',
  'Other',
];

export const LANGUAGES = [
  'Tamil',
  'English',
  'Malayalam',
  'Hindi',
  'Telugu',
  'Kannada',
  'Konkani',
  'French',
  'German',
  'Arabic',
  'Tulu',
  'Marathi',
  'Bengali',
  'Gujarati',
  'Punjabi',
  'Other',
];

export const MARITAL_STATUSES = [
  'Never Married',
  'Divorced',
  'Widowed',
  'Separated',
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const COMPLEXIONS = [
  'Very Fair',
  'Fair',
  'Wheatish',
  'Wheatish Brown',
  'Dark',
];

export const BODY_TYPES = ['Slim', 'Athletic', 'Average', 'Heavy'];

export const PHYSICAL_STATUSES = ['Normal', 'Physically Challenged'];

export const DIETS = ['Vegetarian', 'Non Vegetarian', 'Eggetarian'];

export const SMOKING_OPTIONS = ['No', 'Occasionally', 'Yes'];

export const DRINKING_OPTIONS = ['No', 'Occasionally', 'Yes'];

export const FAMILY_TYPES = ['Nuclear', 'Joint', 'Extended'];

export const FAMILY_STATUSES = [
  'Middle Class',
  'Upper Middle Class',
  'Rich',
  'Affluent',
];

export const FAMILY_VALUES = ['Traditional', 'Moderate', 'Liberal'];

export const PROFILE_FOR_OPTIONS = [
  'Self',
  'Son',
  'Daughter',
  'Brother',
  'Sister',
  'Friend',
];

export const GENDERS = ['Male', 'Female'];

export const OCCUPATIONS = [
  'Software Engineer',
  'Doctor',
  'Nurse',
  'Teacher',
  'Professor',
  'Business',
  'Government Employee',
  'Bank Employee',
  'Engineer',
  'Lawyer',
  'Designer',
  'Architect',
  'Pilot',
  'CA / Chartered Accountant',
  'MBA / Manager',
  'Pharmacist',
  'Dentist',
  'Journalist',
  'Entrepreneur',
  'Agriculture',
  'Police / Defence',
  'Social Worker',
  'Artist / Musician',
  'Other',
];

export const QUALIFICATIONS = [
  'SSLC',
  'HSC / Plus Two',
  'Diploma',
  'ITI',
  'B.Sc',
  'B.A',
  'B.Com',
  'B.E / B.Tech',
  'B.Ed',
  'B.Pharm',
  'BCA',
  'BBA',
  'MBBS',
  'B.Arch',
  'LLB',
  'M.Sc',
  'M.A',
  'M.Com',
  'M.E / M.Tech',
  'M.Ed',
  'MCA',
  'MBA',
  'MD',
  'MS (Medical)',
  'MS (Engineering)',
  'Ph.D',
  'Other',
];

export const ANNUAL_INCOMES = [
  'Below 2 LPA',
  '2–3 LPA',
  '3–5 LPA',
  '5–7 LPA',
  '7–10 LPA',
  '10–15 LPA',
  '15–20 LPA',
  '20–30 LPA',
  '30–50 LPA',
  '50 LPA+',
  'Not Disclosed',
];

export const HEIGHTS = (() => {
  const list = [];
  // 4ft 6in to 6ft 5in
  for (let ft = 4; ft <= 6; ft++) {
    const maxIn = ft === 6 ? 5 : 11;
    const minIn = ft === 4 ? 6 : 0;
    for (let inch = minIn; inch <= maxIn; inch++) {
      list.push(`${ft}ft ${inch}in`);
    }
  }
  return list;
})();

export const WEIGHT_OPTIONS = (() => {
  const list = [];
  for (let kg = 40; kg <= 120; kg += 2) {
    list.push(`${kg} kg`);
  }
  return list;
})();

export const EXPERIENCE_OPTIONS = [
  'Fresher',
  '1 Year',
  '2 Years',
  '3 Years',
  '4 Years',
  '5 Years',
  '6–8 Years',
  '9–12 Years',
  '13–15 Years',
  '15+ Years',
];

export const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'UAE', 'Singapore', 'Malaysia', 'Other'];

export const STATES = [
  'Tamil Nadu',
  'Kerala',
  'Karnataka',
  'Andhra Pradesh',
  'Telangana',
  'Maharashtra',
  'Goa',
  'Delhi',
  'West Bengal',
  'Uttar Pradesh',
  'Rajasthan',
  'Gujarat',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Bihar',
  'Odisha',
  'Assam',
  'Other',
];

export const TAMIL_NADU_DISTRICTS = [
  'Ariyalur',
  'Chengalpattu',
  'Chennai',
  'Coimbatore',
  'Cuddalore',
  'Dharmapuri',
  'Dindigul',
  'Erode',
  'Kallakurichi',
  'Kancheepuram',
  'Kanyakumari',
  'Karur',
  'Krishnagiri',
  'Madurai',
  'Mayiladuthurai',
  'Nagapattinam',
  'Namakkal',
  'Nilgiris',
  'Perambalur',
  'Pudukkottai',
  'Ramanathapuram',
  'Ranipet',
  'Salem',
  'Sivaganga',
  'Tenkasi',
  'Thanjavur',
  'Theni',
  'Thoothukudi',
  'Tiruchirappalli',
  'Tirunelveli',
  'Tirupathur',
  'Tiruppur',
  'Tiruvallur',
  'Tiruvannamalai',
  'Tiruvarur',
  'Vellore',
  'Viluppuram',
  'Virudhunagar',
];

export const KERALA_DISTRICTS = [
  'Alappuzha',
  'Ernakulam',
  'Idukki',
  'Kannur',
  'Kasaragod',
  'Kollam',
  'Kottayam',
  'Kozhikode',
  'Malappuram',
  'Palakkad',
  'Pathanamthitta',
  'Thiruvananthapuram',
  'Thrissur',
  'Wayanad',
];

// State → Districts map
export const STATE_DISTRICTS = {
  'Tamil Nadu': TAMIL_NADU_DISTRICTS,
  'Kerala': KERALA_DISTRICTS,
};

export const CHURCH_MINISTRIES = [
  'Altar Server',
  'Choir / Music Ministry',
  'Youth Ministry',
  'Catholic Women League',
  'Catholic Men League',
  'St. Vincent de Paul Society',
  'Legion of Mary',
  'Bible Study Group',
  'KCLC / KCC',
  'Catechism Teacher',
  'Lector / Reader',
  'Eucharistic Minister',
  'None',
  'Other',
];

export const MEMBERSHIP_TYPES = ['Free', 'Silver', 'Gold', 'Platinum'];

export const PROFILE_STATUSES = ['Pending', 'Active', 'Suspended', 'Rejected'];

export const VERIFICATION_STATUSES = ['Unverified', 'Verified', 'Rejected'];

// Profile completion section weights (for display)
export const COMPLETION_SECTIONS = [
  { key: 'basic', label: 'Basic Details', weight: 15 },
  { key: 'photos', label: 'Photos', weight: 15 },
  { key: 'religion', label: 'Religion', weight: 10 },
  { key: 'education', label: 'Education', weight: 10 },
  { key: 'career', label: 'Career', weight: 10 },
  { key: 'family', label: 'Family', weight: 10 },
  { key: 'preference', label: 'Partner Preference', weight: 10 },
  { key: 'address', label: 'Address', weight: 10 },
  { key: 'about', label: 'About Me', weight: 10 },
  { key: 'documents', label: 'Documents', weight: 10 },
];

export const AGE_OPTIONS = Array.from({ length: 53 }, (_, i) => i + 18); // 18–70
