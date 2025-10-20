# Manual Integration Testing Guide

## Overview

This document provides a comprehensive manual testing procedure for the CleanSlate MCP server. Since we don't have actual CleanSlate API credentials available, this guide documents the testing procedure and provides a checklist that can be executed once API credentials are obtained.

## Prerequisites

Before beginning manual testing, ensure:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] pnpm 8+ installed (`pnpm --version`)
- [ ] CleanSlate API key obtained from cleanslate.sh
- [ ] Claude Code installed (or MCP Inspector as alternative)
- [ ] Project built successfully (`pnpm build`)
- [ ] All unit tests passing (`pnpm test`)

## Environment Setup

1. **Configure Environment Variables**

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your real API key:

```env
CLEANSLATE_API_KEY=your_actual_api_key_here
CLEANSLATE_API_BASE_URL=https://api.cleanslate.sh/v1
LOG_LEVEL=debug
REQUEST_TIMEOUT_MS=10000
MAX_RETRIES=1
```

2. **Verify Build**

```bash
pnpm build
```

Expected output: No TypeScript errors, `dist/` directory created with compiled JavaScript.

## Claude Code Configuration

### macOS/Linux Configuration

Edit `~/.config/claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "cleanslate": {
      "command": "node",
      "args": ["/absolute/path/to/cleanslate-mcp/dist/index.js"],
      "env": {
        "CLEANSLATE_API_KEY": "your_actual_api_key_here"
      }
    }
  }
}
```

### Windows Configuration

Edit `%APPDATA%\Claude\claude_desktop_config.json` with the same structure, using Windows paths.

### Verify Configuration

1. Restart Claude Code
2. Look for CleanSlate tools in the MCP tools panel
3. Check Claude Code logs for connection errors

## Manual Test Cases

### Test Suite 1: Server Connection and Discovery

#### Test 1.1: Server Startup
**Objective:** Verify the MCP server starts without errors

**Procedure:**
1. Open Claude Code
2. Check for CleanSlate in available MCP servers
3. Verify no error messages in Claude Code logs

**Expected Result:**
- CleanSlate appears in MCP servers list
- No startup errors in logs
- Server responds to protocol handshake

**Pass Criteria:** ✅ Server starts and registers successfully

---

#### Test 1.2: Tool Discovery
**Objective:** Verify all 5 tools are discoverable

**Procedure:**
1. In Claude Code, check available tools
2. Verify all tool names and descriptions are present

**Expected Result:**
Should see all 5 tools:
- `log_food` - Add food entry to today's log
- `get_today_log` - View all today's food entries
- `delete_food_entry` - Remove entry from today's log
- `edit_food_entry` - Update existing entry
- `get_today_summary` - Get today's total calories and protein

**Pass Criteria:** ✅ All 5 tools visible with correct descriptions

---

### Test Suite 2: log_food Tool

#### Test 2.1: Basic Food Logging
**Objective:** Successfully log a simple food entry

**Procedure:**
Type in Claude Code chat:
```
"Log chicken breast with 165 calories and 31g protein"
```

**Expected Result:**
- Tool called: `log_food` with parameters:
  - name: "Chicken breast" (or similar)
  - calories: 165
  - protein: 31
- Response includes success message
- Entry ID returned
- Timestamp is today's date

**Pass Criteria:** ✅ Entry created successfully with correct values

---

#### Test 2.2: Validation - Invalid Calories
**Objective:** Verify input validation with judgment-free messaging

**Procedure:**
Type in Claude Code chat:
```
"Log pizza with 15000 calories and 20g protein"
```

**Expected Result:**
- Validation error caught
- Error message: "Calories must be between 0 and 10000"
- Message is judgment-free (no "invalid", "error", "failed")
- Suggests correcting the value

**Pass Criteria:** ✅ Validation error with helpful, non-judgmental message

---

#### Test 2.3: Natural Language Variations
**Objective:** Verify tool works with different phrasings

**Procedure:**
Try multiple variations:
1. "Add eggs, 140 calories, 12g protein"
2. "I had scrambled eggs (140 cal, 12g protein)"
3. "Track 200 calories and 15g protein for greek yogurt"

**Expected Result:**
- All variations successfully interpreted by Claude
- `log_food` called with correct parameters
- Natural language converted to structured input

**Pass Criteria:** ✅ Multiple phrasings work correctly

---

### Test Suite 3: get_today_log Tool

#### Test 3.1: View Today's Log
**Objective:** Retrieve all entries logged today

**Procedure:**
After logging 2-3 entries, type:
```
"What have I logged today?"
```

**Expected Result:**
- Tool called: `get_today_log` (no parameters)
- Response includes array of all today's entries
- Each entry has: id, name, calories, protein, timestamp
- Entries displayed in readable format by Claude

**Pass Criteria:** ✅ All logged entries returned correctly

---

#### Test 3.2: Empty Log Handling
**Objective:** Verify empty log doesn't return error

**Procedure:**
On a new day (or after deleting all entries), type:
```
"Show me today's log"
```

**Expected Result:**
- Tool returns success: true
- entries: [] (empty array)
- count: 0
- Claude responds with encouraging message (e.g., "Your log is empty - ready for a fresh start!")
- NOT an error condition

**Pass Criteria:** ✅ Empty log handled gracefully, not as error

---

### Test Suite 4: delete_food_entry Tool

#### Test 4.1: Delete Specific Entry
**Objective:** Remove an entry from today's log

**Procedure:**
1. Log an entry: "Log cookies with 200 calories and 3g protein"
2. Type: "Actually, delete the cookies entry"
3. Claude should identify the entry ID from context

**Expected Result:**
- Tool called: `delete_food_entry` with correct entryId (UUID)
- Response: success: true, message confirming deletion
- Subsequent get_today_log doesn't include deleted entry

**Pass Criteria:** ✅ Entry successfully deleted

---

#### Test 4.2: Delete Non-Existent Entry
**Objective:** Handle 404 errors gracefully

**Procedure:**
Type: "Delete entry with ID: 00000000-0000-0000-0000-000000000000"

**Expected Result:**
- API returns 404
- Error message: "That entry wasn't found. It may have already been deleted."
- Message is judgment-free
- Doesn't crash or show technical error

**Pass Criteria:** ✅ 404 handled with judgment-free message

---

### Test Suite 5: edit_food_entry Tool

#### Test 5.1: Edit Calories
**Objective:** Update calories for an existing entry

**Procedure:**
1. Log entry: "Log salmon with 200 calories and 25g protein"
2. Type: "Actually that was 250 calories, not 200"

**Expected Result:**
- Tool called: `edit_food_entry` with:
  - entryId: (correct UUID from context)
  - calories: 250
- Response includes updated entry
- Protein and name remain unchanged

**Pass Criteria:** ✅ Calories updated correctly

---

#### Test 5.2: Edit Protein
**Objective:** Update protein for an existing entry

**Procedure:**
Type: "Change the salmon to 30g protein"

**Expected Result:**
- Tool called: `edit_food_entry` with:
  - entryId: (correct UUID)
  - protein: 30
- Calories and name remain unchanged

**Pass Criteria:** ✅ Protein updated correctly

---

#### Test 5.3: Edit Name
**Objective:** Update food name

**Procedure:**
Type: "Rename that to 'Grilled salmon'"

**Expected Result:**
- Tool called: `edit_food_entry` with:
  - entryId: (correct UUID)
  - name: "Grilled salmon"
- Calories and protein remain unchanged

**Pass Criteria:** ✅ Name updated correctly

---

#### Test 5.4: Edit Multiple Fields
**Objective:** Update multiple fields at once

**Procedure:**
Type: "Change the salmon to 280 calories and 28g protein"

**Expected Result:**
- Tool called: `edit_food_entry` with:
  - entryId: (correct UUID)
  - calories: 280
  - protein: 28
- Both fields updated in response

**Pass Criteria:** ✅ Multiple fields updated correctly

---

### Test Suite 6: get_today_summary Tool

#### Test 6.1: Get Summary with Entries
**Objective:** Calculate total calories and protein

**Procedure:**
After logging 3-4 entries, type:
```
"What are my totals for today?"
```

**Expected Result:**
- Tool called: `get_today_summary` (no parameters)
- Response includes:
  - totalCalories: (sum of all entries)
  - totalProtein: (sum of all entries)
  - entryCount: (number of entries)
- Claude presents summary in natural language

**Pass Criteria:** ✅ Totals calculated correctly

---

#### Test 6.2: Summary with Empty Log
**Objective:** Handle zero entries gracefully

**Procedure:**
On a new day (or after deleting all entries), type:
```
"Show me today's summary"
```

**Expected Result:**
- Response:
  - totalCalories: 0
  - totalProtein: 0
  - entryCount: 0
- NOT an error
- Claude presents encouraging message

**Pass Criteria:** ✅ Zero totals returned gracefully

---

### Test Suite 7: Error Handling and Edge Cases

#### Test 7.1: Invalid API Key
**Objective:** Verify authentication error handling

**Procedure:**
1. Change .env to use invalid API key: `CLEANSLATE_API_KEY=invalid_key_12345`
2. Restart Claude Code
3. Try to log food

**Expected Result:**
- API returns 401/403
- Error message: "Invalid API key. Check your CLEANSLATE_API_KEY configuration."
- Message is clear and actionable
- No crash or technical stack trace shown to user

**Pass Criteria:** ✅ Authentication error handled with helpful message

---

#### Test 7.2: Network Timeout
**Objective:** Verify timeout handling

**Procedure:**
1. Set `REQUEST_TIMEOUT_MS=100` in .env (extremely short)
2. Restart Claude Code
3. Try to log food

**Expected Result:**
- Request times out
- Automatic retry attempted (1 retry)
- After retry fails: "Network issue. Check your connection and try again."
- Message is judgment-free

**Pass Criteria:** ✅ Timeout handled gracefully with retry

---

#### Test 7.3: Malformed Response
**Objective:** Verify API error handling

**Procedure:**
This requires the CleanSlate API to return a 500 error. If possible, trigger with:
- Extremely long food name (>1000 chars)
- Or coordinate with CleanSlate team to simulate server error

**Expected Result:**
- Error message: "Couldn't complete request right now. Try again in a moment."
- Message is judgment-free
- Doesn't expose technical details to user

**Pass Criteria:** ✅ Server error handled gracefully

---

### Test Suite 8: Judgment-Free Messaging Verification

#### Test 8.1: Review All Error Messages
**Objective:** Ensure no judgmental language in any error scenario

**Procedure:**
Review all error messages encountered during testing

**Checklist:**
- [ ] No "invalid" without helpful context
- [ ] No "failed" without suggesting next step
- [ ] No "error" without explanation
- [ ] No blame-oriented language ("you entered", "user error")
- [ ] All messages suggest recovery action
- [ ] All messages maintain encouraging tone

**Pass Criteria:** ✅ All error messages judgment-free

---

### Test Suite 9: Performance Verification

#### Test 9.1: Response Time - log_food
**Objective:** Verify sub-2-second response time

**Procedure:**
1. Note timestamp before request
2. Type: "Log banana with 105 calories and 1g protein"
3. Note timestamp when response appears

**Expected Result:**
- Total time (Claude processing + MCP tool + API call) < 5 seconds
- MCP tool execution alone < 2 seconds

**Pass Criteria:** ✅ Response time meets targets

---

#### Test 9.2: Response Time - get_today_log
**Objective:** Verify retrieval performance

**Procedure:**
After logging 10 entries, time the response to "Show today's log"

**Expected Result:**
- MCP tool execution < 2 seconds
- Response scales well with entry count

**Pass Criteria:** ✅ Retrieval performs well

---

### Test Suite 10: Graceful Shutdown

#### Test 10.1: SIGINT Handling
**Objective:** Verify clean shutdown

**Procedure:**
1. Start server manually: `node dist/index.js`
2. Press Ctrl+C

**Expected Result:**
- Server logs shutdown message
- Cleanup performed (if any)
- No error or crash
- Exit code 0

**Pass Criteria:** ✅ Graceful shutdown on SIGINT

---

#### Test 10.2: SIGTERM Handling
**Objective:** Verify process management compatibility

**Procedure:**
1. Start server: `node dist/index.js &`
2. Get PID: `echo $!`
3. Send SIGTERM: `kill -TERM <pid>`

**Expected Result:**
- Server shuts down cleanly
- No error messages
- Exit code 0

**Pass Criteria:** ✅ Graceful shutdown on SIGTERM

---

## Test Results Summary

### Completion Checklist

**Server Connection:**
- [ ] Test 1.1: Server Startup
- [ ] Test 1.2: Tool Discovery

**Tool Functionality:**
- [ ] Test 2.1: Basic Food Logging
- [ ] Test 2.2: Validation - Invalid Calories
- [ ] Test 2.3: Natural Language Variations
- [ ] Test 3.1: View Today's Log
- [ ] Test 3.2: Empty Log Handling
- [ ] Test 4.1: Delete Specific Entry
- [ ] Test 4.2: Delete Non-Existent Entry
- [ ] Test 5.1: Edit Calories
- [ ] Test 5.2: Edit Protein
- [ ] Test 5.3: Edit Name
- [ ] Test 5.4: Edit Multiple Fields
- [ ] Test 6.1: Get Summary with Entries
- [ ] Test 6.2: Summary with Empty Log

**Error Handling:**
- [ ] Test 7.1: Invalid API Key
- [ ] Test 7.2: Network Timeout
- [ ] Test 7.3: Malformed Response
- [ ] Test 8.1: Review All Error Messages

**Performance:**
- [ ] Test 9.1: Response Time - log_food
- [ ] Test 9.2: Response Time - get_today_log

**Shutdown:**
- [ ] Test 10.1: SIGINT Handling
- [ ] Test 10.2: SIGTERM Handling

### Issues Found

| Test ID | Issue Description | Severity | Status |
|---------|------------------|----------|--------|
| | | | |

### Overall Assessment

**Ready for Production:** [ ] YES [ ] NO

**Notes:**

---

## Alternative Testing: MCP Inspector

If Claude Code is unavailable, use the official MCP Inspector tool:

```bash
npx @modelcontextprotocol/inspector node dist/index.js
```

This provides a web UI for manually testing MCP tool invocations without requiring Claude Code.

## Troubleshooting

### Server Not Appearing in Claude Code

1. Check configuration file path is correct
2. Verify absolute path to `dist/index.js` is correct
3. Restart Claude Code completely
4. Check Claude Code logs for error messages

### Authentication Errors

1. Verify API key in `.env` is correct
2. Check API key has necessary permissions
3. Confirm `CLEANSLATE_API_BASE_URL` is correct
4. Test API key directly with curl:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.cleanslate.sh/v1/food-entries/today
```

### Connection Timeouts

1. Check internet connectivity
2. Verify CleanSlate API is reachable
3. Increase `REQUEST_TIMEOUT_MS` if on slow connection
4. Check firewall/proxy settings

## Testing Sign-Off

**Tester Name:** _______________________

**Date:** _______________________

**Environment:**
- Node.js Version: _______________________
- pnpm Version: _______________________
- Claude Code Version: _______________________
- Operating System: _______________________

**Signature:** _______________________

---

**Status:** Ready for manual testing once CleanSlate API credentials are available
