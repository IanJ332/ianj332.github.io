/* Change this file to get your personal Portfolio */

// To change portfolio colors globally go to the  _globalColor.scss file

import emoji from "react-easy-emoji";
import splashAnimation from "./assets/lottie/splashAnimation"; // Rename to your file name for custom animation

// Splash Screen

const splashScreen = {
  enabled: true, // set false to disable splash screen
  animation: splashAnimation,
  duration: 2000 // Set animation duration as per your animation
};

// Summary And Greeting Section

const illustration = {
  animated: true // Set to false to use static SVG
};

const greeting = {
  username: "Ian Jiang",
  title: "Hi all, I'm Ian",
  subTitle: emoji(
    "A highly Software Engineering 🚀 with experience in Backend, AI fine-tuning, and cloud-based solutions. Proficient in Java, Python, JavaScript, and modern backend frameworks."
  ),
  // resumeLink: "/resume.pdf", // 只写 /resume.pdf，因为public目录默认就是根目录
  resumeLink:
    "https://drive.google.com/file/d/1LWvYgkYbMujArbqPk4KPg-zBK91V5-uk/view?usp=sharing", // Set to empty to hide the button
  displayGreeting: true // Set false to hide this section, defaults to true
};

// Social Media Links

const socialMediaLinks = {
  github: "https://github.com/IanJ332",
  linkedin: "https://www.linkedin.com/in/jisheng-jiang/",
  gmail: "jiangjs03@gmail.com",
  // gitlab: "https://gitlab.com/saadpasta",
  // facebook: "https://www.facebook.com/saad.pasta7",
  medium: "https://medium.com/@jiangjs03",
  // stackoverflow: "https://stackoverflow.com/users/10422806/saad-pasta",
  // Instagram, Twitter and Kaggle are also supported in the links!
  // To customize icons and social links, tweak src/components/SocialMedia
  display: true // Set true to display this section, defaults to false
};

// Skills Section

const skillsSection = {
  title: "What I do",
  subTitle: "BACKEND ENGINEER WITH AI & CLOUD EXPERIENCE",
  skills: [
    emoji("⚡ Backend development using Java (Spring Boot) and Python"),
    emoji("⚡ RESTful API design and implementation"),
    emoji("⚡ SQL (PostgreSQL, MySQL) and NoSQL (MongoDB) database management"),
    emoji("⚡ AI model fine-tuning, including NLP and computer vision"),
    emoji("⚡ Cloud deployment and computing with AWS"),
    emoji("⚡ Frontend development using JavaScript & React.js"),
    emoji("⚡ Version control and team collaboration with Git")
  ],

  /* Make Sure to include correct Font Awesome Classname to view your icon
https://fontawesome.com/icons?d=gallery */

  softwareSkills: [
    {
      skillName: "Java",
      fontAwesomeClassname: "fab fa-java"
    },
    {
      skillName: "Python",
      fontAwesomeClassname: "fab fa-python"
    },
    {
      skillName: "Spring Boot",
      fontAwesomeClassname: "fas fa-leaf" // Spring Boot 没有专用图标，这里用 leaf 叶子图标代表
    },
    {
      skillName: "SQL Database",
      fontAwesomeClassname: "fas fa-database"
    },
    {
      skillName: "MongoDB",
      fontAwesomeClassname: "fas fa-leaf" // MongoDB 通常也是用 leaf 叶子图标
    },
    {
      skillName: "AWS",
      fontAwesomeClassname: "fab fa-aws"
    },
    {
      skillName: "React.js",
      fontAwesomeClassname: "fab fa-react"
    },
    {
      skillName: "Git",
      fontAwesomeClassname: "fab fa-git-alt"
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Education Section
const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "San José State University",
      logo: require("./assets/images/sjsuLOGO.png"), // 这里你可以把 sjsu 的 logo 放到 assets/images 目录下
      subHeader: "Bachelor of Science in Computer Science",
      duration: "August 2021 - June 2025",
      desc: "CollegeBot.ai Startup Member", // 暂时不需要描述，保留
      descBullets: [
        "Optimized model performance with a focus on enhancing generation speed",
        "Fine-tuned the model to support multiple languages through multilingual training",
        "Expanded capabilities for specialized subject tutoring and other future applications",
        "Dean's Scholar",
        "Cum Laude"
      ]
    },
    {
      schoolName: "University of Illinois Urbana-Champaign",
      logo: require("./assets/images/uiucLOGO.png"), // 同样这里可以放 UIUC 的 logo
      subHeader: "Master of Computer Science (MCS)",
      duration: "August 2025 - December 2026",
      desc: "", // 由于现在还没上学，desc留空，将来可以补充
      descBullets: [
        "Courses Taken",
        "Advanced Topics in Natrual Language Processing",
        "Applied in Machine Learning",
        "User Interface Design"
      ]
    }
  ]
};

// Your top 3 proficient stacks/tech experience

const techStack = {
  viewSkillBars: true, // Set it to true to show Proficiency Section
  experience: [
    {
      Stack: "Backend Development",
      progressPercentage: "80%"
    },
    {
      Stack: "AI & Machine Learning",
      progressPercentage: "65%"
    },
    {
      Stack: "Software Engineering",
      progressPercentage: "75%"
    },
    {
      Stack: "Cloud & DevOps",
      progressPercentage: "70%"
    },
    {
      Stack: "Frontend (React.js)",
      progressPercentage: "50%"
    }
  ],
  displayCodersrank: false // Set true to display codersrank badges section need to change your username in src/containers/skillProgress/skillProgress.js:17:62, defaults to false
};

// Work experience section

const workExperiences = {
  display: true, // Set it to true to show workExperiences Section
  experience: [
    {
      role: "Software Engineer Intern - Backend",
      company: "Tripalink",
      companylogo: require("./assets/images/tripalinkLOGO.png"),
      date: "June 2023 – Aug 2023",
      desc: "Worked as a backend software engineering intern, contributing to API development, database optimization, and system reliability improvements.",
      descBullets: [
        "Developed RESTful APIs using Java and Spring Boot",
        "Optimized SQL queries to enhance database performance",
        "Implemented logging and monitoring solutions for better system observability",
        "Collaborated with frontend engineers to integrate APIs efficiently"
      ]
    },
    {
      role: "Frontend Engineer Volunteer",
      company: "The Rabbit Haven",
      companylogo: require("./assets/images/therabbithavenLOGO.png"),
      date: "Nov 2022 – Present",
      desc: "Volunteered as a frontend engineer, improving the adoption process by developing user-friendly interfaces for The Rabbit Heaven’s website.",
      descBullets: [
        "Developed and maintained the website using React.js",
        "Enhanced user experience for pet adoption with interactive UI",
        "Collaborated with shelter staff to streamline online adoption forms",
        "Ensured website accessibility and mobile responsiveness"
      ]
    },
    {
      role: "Artificial Intelligence Engineer",
      company: "CollegeBot.ai",
      companylogo: require("./assets/images/collegebotLOGO.avif"),
      date: "Nov 2023 – Oct 2024",
      desc: "Led AI model development and optimization for CollegeBot.ai, focusing on fine-tuning LLMs and expanding multilingual capabilities.",
      descBullets: [
        "Fine-tuned and optimized AI models for real-time responses",
        "Expanded language support for AI-driven academic assistance",
        "Integrated NLP techniques to enhance chatbot accuracy",
        "Deployed AI models on cloud infrastructure for scalability"
      ]
    }
  ]
};


/* Your Open Source Section to View Your Github Pinned Projects
To know how to get github key look at readme.md */

const openSource = {
  showGithubProfile: true, // 将其设置为布尔值 true
  display: true // 将其设置为布尔值 true
};

// Some big projects you have worked on

const bigProjects = {
  title: "Big Projects",
  subtitle: "SOME STARTUPS AND COMPANIES THAT I HELPED TO CREATE THEIR TECH",
  projects: [
    {
      image: require("./assets/images/helperbobLOGO.png"),
      projectName: "Helper Bob",
      projectDesc: "Model used LoRA to help users solve complex coding problems",
      footerLink: [
        {
          name: "Visit Website",
          url: "https://huggingface.co/Ian332/Helper_Bob"
        }
        // you can add extra buttons here.
      ]
    },
    {
      image: require("./assets/images/how2signlogo.png"),
      projectName: "Sign Language Recognition(BO+CNN+LSTM)",
      projectDesc: "Model employing a BO+LSTM+CNN-based visual architecture.",
      footerLink: [
        {
          name: "Visit Repository",
          url: "https://github.com/IanJ332/Sign_language_translator"
        },
        {
          name: "View papers",
          url: "https://drive.google.com/file/d/1yzY_yVVsYUQIvvBVg7YT88_I8hvhj0sA/view?usp=drive_link"
        }
        // you can add extra buttons here.
      ]
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Achievement Section
// Include certificates, talks etc

const achievementSection = {
  title: emoji("Achievements And Certifications 🏆 "),
  subtitle:
    "Achievements, Certifications, Award Letters and Some Cool Stuff that I have done !",

  achievementsCards: [
    {
      title: "SJSU Dean's Scholar",
      subtitle:
        " Dean's Scholar for 3 years and been awarded as Cum Laude",
      image: require("./assets/images/sjsuLOGO.png"),
      imageAlt: "Cum Laude",
      footerLink: [
      ]
    },
    {
      title: "Neo4j Certificates",
      subtitle:
        "Cypher Fundamentals, Intermediate Cypher Queries, Neo4j Fundamentals",
      image: require("./assets/images/neo4j_logo.png"),
      imageAlt: "Neo4j Logo",
      footerLink: [
        {
          name: "Certification",
          url: "https://www.linkedin.com/company/neo4j/"
        }
      ]
    },
    {
      title: "Apollo Graph Developer - Associate Certification",
      subtitle: "Skills: React.js · JavaScript · GraphQL & Apoll",
      image: require("./assets/images/apollo_graphql_logo.png"),
      imageAlt: "Apollo GraphQL Logo",
      footerLink: [
        {
          name: "Certification",
          url: "https://www.linkedin.com/company/28602935/"
        }
      ]
    }
  ],
  display: true // Set false to hide this section, defaults to true
};

// Blogs Section

const blogSection = {
  title: "Blogs",
  subtitle:
    "Sharing insights on AI, optimization, and technology trends through in-depth articles.",
  displayMediumBlogs: true, // 将其设置为布尔值 true
  blogs: [
    {
      url: "https://medium.com/@jiangjs03/the-quest-for-true-ai-reasoning-data-driven-approaches-and-extreme-hardware-optimization-1797a4b0bf47",
      title: "The Quest for True AI Reasoning: Data-Driven Approaches and Extreme Hardware Optimization",
      description:
        "Exploring the current limitations of AI reasoning, the role of data-driven methods, and how extreme hardware optimization could be the key to unlocking truly intelligent systems."
    }
  ],
  display: true // Set false to hide this section, defaults to true
};


// Talks Sections

const talkSection = {
  title: "TALKS",
  subtitle: emoji(
    "I LOVE TO SHARE MY LIMITED KNOWLEDGE AND GET A SPEAKER BADGE 😅"
  ),

  talks: [
    {
      title: "Build Actions For Google Assistant",
      subtitle: "Codelab at GDG DevFest Karachi 2019",
      slides_url: "https://bit.ly/saadpasta-slides",
      event_url: "https://www.facebook.com/events/2339906106275053/"
    }
  ],
  display: false // Set false to hide this section, defaults to true
};

// Podcast Section

const podcastSection = {
  title: emoji("Podcast 🎙️"),
  subtitle: "I LOVE TO TALK ABOUT MYSELF AND TECHNOLOGY",

  // Please Provide with Your Podcast embeded Link
  podcast: [
    "https://anchor.fm/codevcast/embed/episodes/DevStory---Saad-Pasta-from-Karachi--Pakistan-e9givv/a-a15itvo"
  ],
  display: false // Set false to hide this section, defaults to true
};

// Resume Section
const resumeSection = {
  title: "Resume",
  subtitle: "Feel free to download my resume",

  // Please Provide with Your Podcast embeded Link
  display: true // Set false to hide this section, defaults to true
};

const contactInfo = {
  title: emoji("Contact Me ☎️"),
  subtitle:
    "Discuss a project or just want to say hi? My inbox is open for all.",
  email_address: "jiangjs03@gmail.com"
};

// Twitter Section

const twitterDetails = {
  userName: "twitter", //Replace "twitter" with your twitter username without @
  display: false // Set true to display this section, defaults to false
};

const isHireable = false; // Set false if you are not looking for a job. Also isHireable will be display as Open for opportunities: Yes/No in the GitHub footer

export {
  illustration,
  greeting,
  socialMediaLinks,
  splashScreen,
  skillsSection,
  educationInfo,
  techStack,
  workExperiences,
  openSource,
  bigProjects,
  achievementSection,
  blogSection,
  talkSection,
  podcastSection,
  contactInfo,
  twitterDetails,
  isHireable,
  resumeSection
};