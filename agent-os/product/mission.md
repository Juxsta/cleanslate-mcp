# Product Mission

## Pitch
CleanSlate MCP Server is a Model Context Protocol integration that brings judgment-free nutrition tracking to AI assistants. It helps people who struggle with perfectionism and traditional diet apps track food naturally through conversation, providing only the essential metrics (calories and protein) while encouraging daily fresh starts and self-compassion.

## Users

### Primary Customers
- **Perfectionism Strugglers**: People who have failed with traditional diet apps due to overwhelming complexity, rigid rules, and guilt-inducing historical tracking
- **Health-Conscious Developers**: Engineers and power users who want to integrate compassionate nutrition tracking into their AI-powered workflows
- **Claude Code Users**: Developers who live in their terminal and want frictionless food logging without context switching

### User Personas

**Sarah** (28-45)
- **Role:** Software Engineer, Designer, or Knowledge Worker
- **Context:** Has tried MyFitnessPal, Lose It, and other apps but gave up due to perfectionism triggers. Feels overwhelmed by tracking macros, micronutrients, and maintaining "streaks."
- **Pain Points:** Traditional apps make one mistake feel like total failure. Too many numbers to track. Historical graphs induce guilt rather than motivation.
- **Goals:** Track food simply without judgment. Learn sustainable habits. Get back on track easily after slip-ups.

**Marcus** (25-40)
- **Role:** Developer/Power User
- **Context:** Uses Claude Code daily for development work. Wants health tracking integrated into existing AI workflows.
- **Pain Points:** Context switching to mobile apps breaks flow state. Wants conversational logging. Needs speed and efficiency.
- **Goals:** Log food in seconds via AI. Access nutrition data programmatically. Build custom health workflows.

## The Problem

### Traditional Nutrition Apps Trigger Perfectionism
Diet apps like MyFitnessPal track 10+ metrics (calories, protein, carbs, fat, fiber, sodium, vitamins, etc.), maintain detailed historical graphs showing every mistake, enforce rigid daily goals, and punish imperfection with broken streaks. For people prone to perfectionism or disordered eating patterns, this complexity creates paralysis: one "bad day" leads to abandoning the entire effort because the system makes recovery feel impossible.

**Our Solution:** Track only TWO numbers (calories and protein). Reset logs daily for fresh starts. No streaks, no guilt-inducing historical trends. Mistakes are learning opportunities, not failures.

### Nutrition Tracking is Too Slow
Traditional apps require multiple context switches: pull out phone, open app, search database, select food, enter portions, confirm entry. This 30-60 second process disrupts workflow and creates friction that discourages consistent tracking.

**Our Solution:** Conversational AI logging through MCP. Type "log chicken breast 200 calories 40g protein" in Claude and continue working. Sub-5-second tracking without breaking flow state.

### Diet Apps Lack Educational Support
Most apps focus on data collection without teaching users WHY they feel hungry, HOW exercise affects appetite, or WHAT sustainable habits look like. Users collect data but don't gain understanding.

**Our Solution:** Integrated evidence-based curriculum on hunger, exercise, sleep, and sustainable nutrition. Education embedded in the tracking workflow, not siloed in separate articles.

## Differentiators

### Intentional Simplicity Over Feature Bloat
Unlike MyFitnessPal (tracks 20+ nutrients) or Cronometer (tracks micronutrients and biometrics), we track ONLY calories and protein. This isn't a limitation—it's our core philosophy. 90% of nutrition success comes from these two numbers. Additional metrics add complexity without proportional benefit and trigger perfectionism.

This results in faster logging, clearer progress signals, and sustainable long-term adherence.

### Daily Reset Philosophy
Unlike traditional apps that maintain permanent historical records and multi-day streaks, CleanSlate resets daily. Yesterday's mistakes don't follow you. You wake up to a clean slate every morning. You can only view and plan for TODAY.

This results in reduced guilt, faster recovery from slip-ups, and better long-term consistency through self-compassion.

### Conversational AI-Native Design
Unlike mobile-first apps retrofitted with chatbots, CleanSlate MCP is designed for AI-native interaction. Instead of tapping through menus, you converse: "log 2 eggs scrambled" or "what's my protein total?" The MCP protocol makes this a first-class citizen in Claude Code and other AI tools.

This results in sub-5-second logging, seamless workflow integration, and dramatically reduced friction.

### Anti-Perfectionism by Design
Every feature decision asks: "Does this encourage judgment-free tracking?" We explicitly reject features that other apps consider essential: detailed historical graphs (induce guilt), streak counters (punish recovery), micro-nutrient tracking (adds complexity), meal planning beyond today (prevents fresh starts).

This results in a tool that people with perfectionism tendencies can actually use long-term, rather than abandoning after their first "bad week."

## Key Features

### Core Features
- **Conversational Food Logging:** Add foods with natural language through AI ("log chicken salad 350 cal 30g protein")
- **Today-Only View:** See only today's log—yesterday's mistakes don't follow you (daily fresh start philosophy)
- **Calories + Protein Only:** Track the two metrics that matter most; ignore the noise that triggers perfectionism
- **Fast Summary:** Get today's totals instantly ("what's my protein?") without navigating menus

### Quick Tracking Features
- **Basic Foods Library:** Pre-defined simple foods you eat regularly (eggs, chicken breast, rice) for 1-second logging
- **Quick Add:** Log from your Basic Foods in a single command ("quick add 2 eggs")
- **Search Basic Foods:** Find your frequent foods instantly without typing full nutrition data
- **Edit/Delete Today:** Fix mistakes immediately without guilt—today's log is flexible until it resets

### Educational Features
- **Evidence-Based Curriculum:** Access free, science-backed content on hunger management, exercise, sleep, and sustainable habits
- **Contextual Tips:** Get relevant guidance embedded in your tracking workflow (not buried in separate articles)
- **Weekly Patterns:** See gentle weekly summaries that highlight patterns without inducing guilt (not detailed historical graphs)

### Developer Features
- **MCP Protocol Native:** First-class integration with Claude Code and any MCP-compatible AI assistant
- **API Access:** Direct integration with CleanSlate's API for programmatic tracking and data export
- **TypeScript SDK:** Type-safe interface for building custom nutrition workflows
- **Docker Deployment:** Run your own instance with full control over data and privacy
