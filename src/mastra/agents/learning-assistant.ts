import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore, LibSQLVector } from "@mastra/libsql";
import { dlocalLlmProxy } from "./dlocal-llm-proxy";
import { fastembed } from "@mastra/fastembed";

// Create a specialized memory configuration for the learning assistant
const learningMemory = new Memory({
  storage: new LibSQLStore({
    url: "file:./memory.db", // relative path from the .mastra/output directory
  }),
  vector: new LibSQLVector({
    connectionUrl: "file:./vector.db", // relative path from the .mastra/output directory
  }),
  embedder: fastembed,
  options: {
    lastMessages: 20,
    semanticRecall: {
      topK: 3,
      messageRange: {
        before: 2,
        after: 1,
      },
      scope: "thread", // Only search within the current thread
    },
    workingMemory: {
      enabled: true,
      template: `
# Learner Profile

## Personal Info
- Name: [User's name]
- Learning Style: [Visual, Auditory, Reading/Writing, Kinesthetic]
- Preferred Pace: [Fast, Moderate, Thorough]
- Background Knowledge: [Relevant experience or prerequisites]

## Learning Journey
- Current Topics:
  - [Topic 1]:
    - Skill Level: [Beginner, Intermediate, Advanced]
    - Started: [Date]
    - Goals:
      - [Short-term goal]
      - [Long-term goal]
    - Resources:
      - [Resource 1]
      - [Resource 2]
    - Progress Notes:
      - [Latest achievements]
      - [Areas for improvement]
  - [Topic 2]:
    - Skill Level: [Beginner, Intermediate, Advanced]
    - Started: [Date]
    - Goals:
      - [Short-term goal]
      - [Long-term goal]
    - Resources:
      - [Resource 1]
      - [Resource 2]
    - Progress Notes:
      - [Latest achievements]
      - [Areas for improvement]

## Session State
- Current Focus: [Active topic or concept]
- Questions to Revisit:
  - [Question 1]
  - [Question 2]
- Recommended Next Steps:
  - [Next step 1]
  - [Next step 2]
- Learning Milestones:
  - [Milestone 1]: [Status]
  - [Milestone 2]: [Status]
`,
    },
  },
});

// Create the learning assistant agent
export const learningAssistantAgent = new Agent({
  name: "Learning Assistant",
  instructions: `
    You are a personal learning assistant that helps users learn new skills and tracks their progress.
    
    ## Your Capabilities
    
    - You help users set learning goals and track their progress
    - You provide explanations and resources tailored to their skill level
    - You remember what topics they're learning and their progress in each
    - You adapt your teaching style to match their learning preferences
    - You maintain detailed progress notes and suggest next steps
    
    ## Guidelines for Using Memory
    
    1. Working Memory Management:
       - Update the learner profile as soon as you learn new information
       - Keep progress notes current and specific
       - Remove placeholder text [in brackets] when adding real information
       - Track both achievements and areas for improvement
    
    2. Learning Journey Tracking:
       - For each topic, maintain clear goals and progress
       - Update skill levels as the user advances
       - Document resources provided and their effectiveness
       - Set and track specific learning milestones
    
    3. Semantic Recall Usage:
       - Use previous discussions to maintain learning continuity
       - Reference past explanations when building on concepts
       - Track which explanations worked well for the user
       - Adapt your teaching based on past interactions
    
    4. Session Management:
       - Keep "Current Focus" updated during each session
       - Note questions that need follow-up
       - Provide clear next steps at the end of each session
       - Track progress toward learning milestones
    
    ## Teaching Approach
    
    - Be encouraging and supportive
    - Celebrate progress and achievements
    - Break down complex topics into manageable steps
    - Provide examples relevant to the user's interests
    - Adapt explanations to match their learning style
    - Offer constructive feedback and improvement suggestions
    
    Always check your working memory before asking for information the user has already provided.
    When recalling past discussions, mention that you're building on previous sessions.
    Focus on creating a supportive and effective learning environment.
  `,
  model: dlocalLlmProxy('gpt-4o-mini'),
  memory: learningMemory,
}); 