# CleanSlate MCP Usage Examples

This document demonstrates natural, conversational interactions with the CleanSlate MCP server through Claude. These examples show how AI-assisted nutrition tracking feels judgment-free and effortless.

## Basic Food Logging

### Example 1: Simple Breakfast

**You**: "I just had 2 scrambled eggs for breakfast. They were about 140 calories with 12 grams of protein."

**Claude**: I'll log that for you.

*Uses `log_food` tool with:*
```json
{
  "name": "2 scrambled eggs",
  "calories": 140,
  "protein": 12
}
```

**Claude**: Added 2 scrambled eggs to today's log (140 cal, 12g protein).

---

### Example 2: Quick Lunch Entry

**You**: "Log chicken breast, 165 calories, 31g protein"

**Claude**: Got it.

*Uses `log_food` tool with:*
```json
{
  "name": "chicken breast",
  "calories": 165,
  "protein": 31
}
```

**Claude**: Added chicken breast to today's log (165 cal, 31g protein).

---

### Example 3: Snack with Context

**You**: "I'm having a protein shake - 120 cal and 24g protein"

**Claude**: Perfect timing for a snack!

*Uses `log_food` tool with:*
```json
{
  "name": "protein shake",
  "calories": 120,
  "protein": 24
}
```

**Claude**: Added protein shake to today's log (120 cal, 24g protein).

---

## Viewing Today's Log

### Example 4: Check What You've Eaten

**You**: "What have I logged today?"

**Claude**: Let me check your log.

*Uses `get_today_log` tool*

**Claude**: Here's what you've logged today:

1. 2 scrambled eggs (140 cal, 12g protein) at 8:15am
2. Chicken breast (165 cal, 31g protein) at 2:30pm
3. Protein shake (120 cal, 24g protein) at 6:00pm

You've logged 3 entries so far.

---

### Example 5: Empty Log

**You**: "Show me today's food log"

**Claude**: Let me check.

*Uses `get_today_log` tool*

**Claude**: Your log is empty for today. No entries yet - clean slate! When you eat something, just let me know and I'll log it.

---

## Checking Totals

### Example 6: Get Summary

**You**: "What are my totals for today?"

**Claude**: Let me calculate that.

*Uses `get_today_summary` tool*

**Claude**: Today's totals:
- Calories: 425
- Protein: 67g
- Entries: 3

You're doing great!

---

### Example 7: Protein Check

**You**: "How much protein have I had?"

**Claude**: Let me check your totals.

*Uses `get_today_summary` tool*

**Claude**: You've had 67 grams of protein so far today from 3 entries.

---

## Editing Entries

### Example 8: Correcting Calories

**You**: "Actually that chicken breast was 180 calories, not 165"

**Claude**: No problem, I'll update it.

*Uses `get_today_log` to find the entry, then `edit_food_entry` with:*
```json
{
  "entryId": "abc-123-def-456",
  "calories": 180
}
```

**Claude**: Updated chicken breast to 180 calories (protein unchanged at 31g).

---

### Example 9: Updating Protein

**You**: "The eggs were actually 14g protein, not 12"

**Claude**: I'll fix that for you.

*Uses `get_today_log` to find entry, then `edit_food_entry` with:*
```json
{
  "entryId": "xyz-789-abc-012",
  "protein": 14
}
```

**Claude**: Updated 2 scrambled eggs to 14g protein (calories unchanged at 140).

---

### Example 10: Changing Food Name and Nutrition

**You**: "Change that chicken entry to 'grilled chicken breast' with 180 calories and 35g protein"

**Claude**: I'll update all those details.

*Uses `edit_food_entry` with:*
```json
{
  "entryId": "abc-123-def-456",
  "name": "grilled chicken breast",
  "calories": 180,
  "protein": 35
}
```

**Claude**: Updated entry to: grilled chicken breast (180 cal, 35g protein).

---

## Deleting Entries

### Example 11: Remove an Entry

**You**: "Delete the protein shake"

**Claude**: I'll remove that for you.

*Uses `get_today_log` to find entry, then `delete_food_entry` with:*
```json
{
  "entryId": "def-456-ghi-789"
}
```

**Claude**: Deleted protein shake from today's log.

---

### Example 12: Logged Wrong Food

**You**: "Oops, I didn't actually eat the eggs. Can you remove them?"

**Claude**: Of course, no worries!

*Uses `get_today_log` to find entry, then `delete_food_entry`*

**Claude**: Removed 2 scrambled eggs from today's log. It happens - fresh start!

---

## Complex Workflows

### Example 13: Log, Check, and Adjust

**You**: "Log oatmeal, 150 cal, 5g protein"

**Claude**:
*Uses `log_food`*

Added oatmeal to today's log (150 cal, 5g protein).

**You**: "What are my totals now?"

**Claude**:
*Uses `get_today_summary`*

Today's totals:
- Calories: 330
- Protein: 40g
- Entries: 3

**You**: "Actually the oatmeal was 160 calories"

**Claude**:
*Uses `edit_food_entry`*

Updated oatmeal to 160 calories. Your new total is 340 calories.

---

### Example 14: Morning Routine

**You**: "Good morning! Log my breakfast: greek yogurt with berries, 180 calories, 15g protein"

**Claude**: Good morning! Logging your breakfast.

*Uses `log_food`*

Added greek yogurt with berries to today's log (180 cal, 15g protein). Great way to start the day!

**You**: "What's my protein goal today?"

**Claude**: I track your food, but you set your own goals - no pressure! Right now you're at 15g protein from 1 entry. What feels right for you today?

---

### Example 15: Evening Check-in

**You**: "Show me everything I ate today and the totals"

**Claude**: Sure, here's your full day:

*Uses `get_today_log` and `get_today_summary`*

**Today's Entries:**
1. Greek yogurt with berries (180 cal, 15g protein) at 7:30am
2. Grilled chicken breast (180 cal, 35g protein) at 12:45pm
3. Almonds (160 cal, 6g protein) at 3:15pm
4. Salmon with vegetables (220 cal, 28g protein) at 7:00pm

**Totals:**
- Calories: 740
- Protein: 84g
- Entries: 4

You had a solid day of balanced nutrition!

---

## Error Scenarios (Judgment-Free)

### Example 16: Invalid Input

**You**: "Log pizza with -50 calories"

**Claude**: I can't log negative calories - that doesn't quite work! Did you mean 50 calories, or something else?

---

### Example 17: Missing Information

**You**: "Log the thing I ate"

**Claude**: I'd love to help! Could you tell me:
1. What you ate (food name)
2. Approximate calories
3. Approximate protein in grams

No need to be exact - estimates are totally fine!

---

### Example 18: Entry Not Found

**You**: "Delete the pizza entry"

**Claude**:
*Uses `get_today_log` to search*

I don't see a pizza entry in today's log. Your current entries are:
1. Greek yogurt with berries
2. Grilled chicken breast

Did you want to delete one of these, or maybe it was from yesterday? (Remember, I only track today - clean slate!)

---

## Multi-Day Philosophy

### Example 19: Fresh Start

**User** (next day): "What did I eat yesterday?"

**Claude**: CleanSlate focuses on today only - yesterday's log has reset. This is intentional: every day is a fresh start without guilt or historical comparisons.

What matters is what you do today. Want to log something?

---

### Example 20: Encouraging Recovery

**You**: "I messed up yesterday and ate way too much"

**Claude**: That was yesterday - today is a brand new day with a clean slate. I only track today's food, so there's no history weighing you down.

What matters is how you show up today. Ready to log something whenever you're ready - no pressure!

---

## Natural Language Variations

CleanSlate works with natural, conversational language. Here are examples of different ways to say the same thing:

### Logging Food

All of these work:
- "Log chicken, 200 cal, 40g protein"
- "I ate chicken breast with 200 calories and 40 grams of protein"
- "Add chicken to my log: 200 calories, 40g protein"
- "Track chicken breast, 200 cal, 40 protein"

### Checking Totals

All of these work:
- "What are my totals?"
- "How much have I eaten today?"
- "Show me today's summary"
- "What's my calorie and protein count?"

### Editing

All of these work:
- "Change the chicken to 220 calories"
- "Update chicken breast - 220 cal"
- "Actually the chicken was 220 calories, not 200"
- "Fix the chicken entry to 220 cal"

### Deleting

All of these work:
- "Delete the chicken"
- "Remove chicken breast"
- "I want to delete the chicken entry"
- "Take out the chicken from my log"

---

## Tips for Best Experience

1. **Be approximate**: "about 200 calories" is fine - perfection not required
2. **Use context**: Claude remembers recent entries in the conversation
3. **Fix freely**: Edit and delete without guilt - mistakes are expected
4. **Natural language**: Talk normally, not like you're filling a form
5. **Daily focus**: Only think about today - yesterday is gone

---

## Philosophy in Action

Notice in these examples:

- **No judgment**: Errors are met with "no problem" and "it happens"
- **No pressure**: Goals are user-defined, not system-enforced
- **No history**: Yesterday's data doesn't appear, preventing guilt
- **No perfection**: Approximations and estimates are encouraged
- **No complexity**: Only 2 numbers to track (calories and protein)

This is tracking without the overwhelm. This is CleanSlate.

