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
    "I’m a Full-Stack Software Engineer with a specialization in AI model training, backend systems, and cloud-based architecture. My core proficiencies include Python, Java, JavaScript, and a variety of modern backend frameworks, allowing me to deliver high-performance, scalable solutions."
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
    emoji("⚡ Full-Stack & Backend Engineering: Building scalable and high-performance backend systems using Java (Spring Boot) and Python, with a focus on designing robust RESTful APIs and developing responsive front ends with JavaScript & React.js."),
    emoji("⚡ Data Architecture: Designing and managing a solid data infrastructure with expertise in both relational SQL (PostgreSQL, MySQL) and non-relational NoSQL (MongoDB) databases."),
    emoji("⚡ AI/ML Solutions: Fine-tuning AI models for specific applications, with a proven background in NLP and computer vision."),
    emoji("⚡ DevOps & Cloud Deployment: Deploying full-stack and AI solutions on AWS, and ensuring seamless team collaboration and version control with Git.")
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
      skillName: "JavaScript",
      fontAwesomeClassname: "fab fa-js"
    },
    // {
    //   skillName: "GraphQL",
    //   fontAwesomeClassname: "fab fa-graphql"
    // },
    {
      skillName: "SQL Database",
      fontAwesomeClassname: "fas fa-database" // 统一使用数据库图标
    },
    {
      skillName: "HTML5",
      fontAwesomeClassname: "fab fa-html5"
    },
    {
      skillName: "CSS3",
      fontAwesomeClassname: "fab fa-css3-alt"
    },
    {
      skillName: "C/C++",
      fontAwesomeClassname: "fas fa-code" // C/C++ 没有专用图标，使用通用代码图标
    },
    {
      skillName: "Node.js",
      fontAwesomeClassname: "fab fa-node-js"
    },
    {
      skillName: "React.js",
      fontAwesomeClassname: "fab fa-react"
    },
    {
      skillName: "Git",
      fontAwesomeClassname: "fab fa-git-alt"
    },
    {
      skillName: "AWS",
      fontAwesomeClassname: "fab fa-aws"
    },
    // {
    //   skillName: "MongoDB",
    //   fontAwesomeClassname: "fas fa-leaf" // MongoDB 常用叶子图标
    // },
    {
      skillName: "Spring",
      fontAwesomeClassname: "fas fa-leaf" // Spring 框架也用叶子图标
    },
    {
      skillName: "PyTorch",
      fontAwesomeClassname: "fas fa-robot" // 使用机器人图标代表 AI/ML
    },
    {
      skillName: "TensorFlow",
      fontAwesomeClassname: "fas fa-robot" // 同上
    },
    {
      skillName: "Docker",
      fontAwesomeClassname: "fab fa-docker"
    }
    // {
    //   skillName: "VSCode",
    //   fontAwesomeClassname: "fab fa-vscode"
    // },
    // {
    //   skillName: "IntelliJ",
    //   fontAwesomeClassname: "fab fa-idea"
    // }
  ],
  display: true
};

// Education Section
const educationInfo = {
  display: true, // Set false to hide this section, defaults to true
  schools: [
    {
      schoolName: "University of Illinois Urbana-Champaign",
      logo: require("./assets/images/uiucLOGO.png"), // 同样这里可以放 UIUC 的 logo
      subHeader: "Master of Computer Science",
      duration: "Expected Graduation: December 2026",
      desc: "", // 由于现在还没上学，desc留空，将来可以补充
      descBullets: [
        "Relevant Coursework:",
        "Advanced Topics in Natural Language Processing", 
        "Applied in Machine Learning", 
        "User Interface Design"
      ]
    },
    {
      schoolName: "San José State University",
      logo: require("./assets/images/sjsuLOGO.png"), // 这里你可以把 sjsu 的 logo 放到 assets/images 目录下
      subHeader: "Bachelor of Science in Computer Science",
      duration: "August 2021 - June 2025",
      desc: "", // 暂时不需要描述，保留
      descBullets: [
        "Honors:",
        "Dean's Scholar",
        "Cum Laude"
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
      role: "Tripalink: Software Engineer",
      company: "Tripalink",
      companylogo: require("./assets/images/tripalinkLOGO.png"),
      date: "June 2023 – Aug 2023",
      desc: "Worked as a backend software engineering intern, contributing to the development of robust APIs and improving system reliability and performance.",
      descBullets: [
        "Engineered and deployed RESTful APIs using Java and Spring Boot to support new features for an AI-driven rental recommendation project.",
        "Enhanced database performance by 25% by identifying and optimizing SQL queries, significantly reducing data retrieval time.",
        "Improved system observability and reliability by implementing comprehensive logging and monitoring solutions.",
        "Collaborated effectively with cross-functional teams to ensure seamless API integration, accelerating project timelines."
      ]
    },
        {
      role: "CollegeBot.ai: Co-founder | AI Model Engineer",
      company: "CollegeBot.ai",
      companylogo: require("./assets/images/collegebotLOGO.avif"),
      date: "Nov 2023 – Oct 2024",
      desc: "As a co-founder and AI Model Engineer, I led the end-to-end development of a commercial AI model that gained rapid market traction.",
      descBullets: [
        "Co-founded a venture that launched Collegebot.ai, an AI language model that attracted a rapidly growing user base of over 10,000 students within the first eight months.",
        "Developed and executed the model's training strategy using PyTorch, TensorFlow, and CUDA, focusing on natural language understanding.",
        "Engineered and optimized AI models for real-time responses and expanded language support for multilingual capabilities.",
        "Deployed AI models on a cloud infrastructure, ensuring scalability and robust performance under heavy user load."
      ]
    },
    {
      role: "The Rabbit Haven: Frontend Engineer Volunteer",
      company: "The Rabbit Haven",
      companylogo: require("./assets/images/therabbithavenLOGO.png"),
      date: "Nov 2022 – Present",
      desc: "Volunteered as a frontend engineer, developing a user-friendly website that streamlined pet adoption processes and improved the organization's online presence.",
      descBullets: [
        "Led the development and maintenance of a user-friendly website using React.js, creating a more intuitive and streamlined interface for the pet adoption process.",
        "Implemented a rigorous testing methodology to ensure the website's functionality was robust across different browsers and devices.",
        "Collaborated directly with shelter staff to streamline online adoption forms, which involved managing form data submission and improving data collection efficiency.",
        "Ensured the website met modern web standards for accessibility and mobile responsiveness, broadening its reach and ensuring an inclusive user experience."
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