import { Project, AppMode } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'AI-Driven Traffic Management System',
    students: ['Alice Johnson', 'Bob Smith'],
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'React'],
    progress: 75,
    status: 'On Track',
    lastUpdated: '2023-10-15',
    description: 'Using computer vision to optimize traffic light timings at busy intersections.'
  },
  {
    id: '2',
    title: 'Blockchain Based Supply Chain',
    students: ['Charlie Brown', 'David Lee'],
    technologies: ['Solidity', 'Ethereum', 'Web3.js', 'Node.js'],
    progress: 40,
    status: 'Delayed',
    lastUpdated: '2023-10-10',
    description: 'A decentralized application to ensure transparency in logistics.'
  },
  {
    id: '3',
    title: 'Smart IoT Infrastructure',
    students: ['Eva Green', 'Frank White'],
    technologies: ['Arduino', 'LoRaWAN', 'C++', 'Firebase'],
    progress: 90,
    status: 'Completed',
    lastUpdated: '2023-09-28',
    description: 'Remote monitoring of environmental conditions.'
  },
  {
    id: '4',
    title: 'AR Maintenance Assistant',
    students: ['Grace Hopper', 'Ada Lovelace'],
    technologies: ['Unity', 'ARFoundation', 'C#', 'Mapbox'],
    progress: 60,
    status: 'On Track',
    lastUpdated: '2023-10-18',
    description: 'Augmented reality app to help technicians repair machinery.'
  },
  {
    id: '5',
    title: 'Customer Sentiment Analysis',
    students: ['Ivan Drago', 'Rocky Balboa'],
    technologies: ['Python', 'NLTK', 'Transformers', 'Django'],
    progress: 20,
    status: 'At Risk',
    lastUpdated: '2023-10-01',
    description: 'Analyzing feedback to gauge product effectiveness.'
  }
];

export const getSystemInstructionAnalyzer = (mode: AppMode) => `
You are ProjectRadar, an expert project analyzer for ${mode === 'EDUCATION' ? 'academic institutions' : 'corporate organizations'}.
Analyze the provided project report (text or image) and extract:
1. Project Title
2. ${mode === 'EDUCATION' ? 'Team Members & Branch/Year' : 'Team Members & Role'}
3. Technologies Used
4. Problem Statement
5. Objectives
6. Methodology / Strategy
7. Current Progress (%)
8. Tasks Completed This Month
9. Pending Tasks
10. Risks/Blockers
11. ${mode === 'EDUCATION' ? 'Faculty' : 'Manager'} Comments (if any)
12. AI Suggested Next Steps
13. One-line Elevator Pitch
14. 10-Point Summary

Format output in clean Markdown. Be professional, ${mode === 'EDUCATION' ? 'academic' : 'business-oriented'}, and accurate.
`;

export const getSystemInstructionRecall = (mode: AppMode) => `
You are ProjectRadar's ${mode === 'EDUCATION' ? 'Faculty' : 'Manager'} Memory Recall module.
Compare the 'Last Month' report with the 'This Month' report.
Produce:
1. Difference Summary ("What changed")
2. Completion % Delta
3. Progress Indicators (Good/Bad)
4. Newly Added Tasks
5. Missed Deadlines
6. Insights for Evaluation
7. Suggested Remarks for the Team
8. Suggested Questions to Ask
9. 15-second "Quick Recall" Briefing for the ${mode === 'EDUCATION' ? 'Professor' : 'Manager'}
`;

export const getSystemInstructionFeedback = (mode: AppMode) => `
You are ProjectRadar's ${mode === 'EDUCATION' ? 'Student Mentor' : 'Team Coach'}.
Provide constructive feedback on the uploaded report:
1. Constructive Feedback
2. Improvements Required
3. Quality Rating (1-5 Stars)
4. ${mode === 'EDUCATION' ? 'Novelty Evaluation' : 'Innovation & Impact Score'}
5. Unique Feature Suggestions
6. Next Milestones
7. Recommended Resources (Links/Topics)

Tone: ${mode === 'EDUCATION' ? 'Encouraging, Academic, Instructional' : 'Professional, Result-Oriented, Efficient'}.
`;
