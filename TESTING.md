# Testing Guide

## Quick Test (Without Gemini API)

The app works without the Gemini API by using mock data. This is great for testing the UI and flow.

1. Start the server:
```bash
npm start
```

2. Open browser: http://localhost:3000

3. You should see:
   - Pattern-Trainer Agent interface
   - Stats showing 0 credits
   - Pattern selection dropdown
   - Get Challenge button

4. Test the flow:
   - Select "Sliding Window" pattern
   - Click "Get Challenge"
   - You'll get a mock problem
   - Write any code in the editor
   - Click "Submit Solution"
   - You'll get mock feedback

## Full Test (With Gemini API)

1. Get your Gemini API key from https://makersuite.google.com/app/apikey

2. Add it to `.env`:
```
GEMINI_API_KEY=your_actual_key_here
```

3. Restart the server:
```bash
npm start
```

4. Test problem generation:
   - Select any pattern
   - Click "Get Challenge"
   - Wait 2-5 seconds
   - You should get a unique AI-generated problem

5. Test code evaluation:
   - Write a solution (correct or incorrect)
   - Click "Submit"
   - Wait 2-5 seconds
   - You should get detailed AI feedback

## Test Cases

### Test Case 1: Basic Flow
- ✅ User can select a pattern
- ✅ User can request a challenge
- ✅ Challenge is displayed with all sections
- ✅ User can write code
- ✅ User can submit solution
- ✅ Feedback is displayed
- ✅ Credits are tracked

### Test Case 2: Adaptive Learning
1. Get a "Sliding Window" challenge
2. Submit an incorrect solution
3. Check profile - "Sliding Window" should appear in weak patterns
4. Get another "Sliding Window" challenge
5. Submit a correct solution
6. After enough successful attempts, it should move to strong patterns

### Test Case 3: Multiple Patterns
1. Try 3-4 different patterns
2. Submit solutions with varying success
3. Profile should show:
   - Multiple patterns tracked
   - Correct success rates
   - Proper weak/strong classification

### Test Case 4: Credit Tracking
1. Start with 0 credits
2. Get a challenge → credits = 1
3. Submit solution → credits = 2
4. Get another challenge → credits = 3
5. Credits should increment with each agent call

### Test Case 5: User Persistence
1. Get challenges and submit solutions
2. Note your user ID
3. Refresh the page
4. User ID should change (new session)
5. Old data should be saved in `data/users.json`

## API Testing

### Test Health Endpoint
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-...",
  "gemini_configured": true/false
}
```

### Test Patterns Endpoint
```bash
curl http://localhost:3000/api/patterns
```

Expected: List of 10 patterns

### Test Request Challenge
```bash
curl -X POST http://localhost:3000/api/request_challenge \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "pattern": "sliding_window",
    "difficulty": "medium"
  }'
```

### Test Submit Solution
```bash
curl -X POST http://localhost:3000/api/submit_solution \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "pattern": "sliding_window",
    "code": "def solution(arr, k): return max(arr)",
    "problem_description": "Find max sum subarray"
  }'
```

### Test User Profile
```bash
curl http://localhost:3000/api/user_profile/test_user
```

## Performance Testing

### Response Times
- Health check: < 50ms
- Get patterns: < 100ms
- Request challenge (without AI): < 200ms
- Request challenge (with AI): 2-5 seconds
- Submit solution (without AI): < 200ms
- Submit solution (with AI): 2-5 seconds

### Monitor Agent Logs

When running, you should see logs like:
```
[Agent Service] User test_user requesting problem via Problem Generator Agent
[Agent Service] Pattern: sliding_window, Difficulty: medium
[Agent Service] Cost: 1 credit(s)
[Agent Service] Problem generated successfully in 850ms
```

## Browser Console Testing

Open browser console (F12) and check for:
- No JavaScript errors
- Network requests succeed (200 status)
- Notifications logged correctly

## Common Issues

### Issue: "GEMINI_API_KEY not set" warning
**Solution**: Add your API key to `.env` file

### Issue: Port 3000 already in use
**Solution**: Change PORT in `.env` or stop other process using port 3000

### Issue: Slow AI responses
**Normal**: Gemini API can take 2-5 seconds
**If > 10 seconds**: Check your internet connection

### Issue: Mock data appears even with API key
**Solution**:
1. Verify API key is correct
2. Restart server
3. Check terminal for error messages

### Issue: Profile not updating
**Solution**: Click "Refresh Profile" button or reload page

## Browser Compatibility

Tested on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Security Testing

- ✅ No API keys exposed in frontend
- ✅ CORS properly configured
- ✅ Input validation on backend
- ✅ No SQL injection risks (in-memory store)
- ✅ User data persisted securely

## Load Testing (Optional)

For stress testing:
```bash
# Install Apache Bench
# macOS: brew install httpd

# Test concurrent requests
ab -n 100 -c 10 http://localhost:3000/api/health
```

## Success Criteria

All tests pass when:
1. ✅ UI loads without errors
2. ✅ Can get challenges (mock or AI)
3. ✅ Can submit solutions
4. ✅ Feedback displays correctly
5. ✅ Profile tracks patterns
6. ✅ Credits increment
7. ✅ No console errors
8. ✅ All API endpoints respond
9. ✅ Data persists across requests
10. ✅ Agent logs appear in terminal

## Next Steps After Testing

1. Try different patterns
2. Test edge cases (empty code, special characters)
3. Test with multiple users (use different user IDs)
4. Monitor memory usage
5. Test data persistence (check `data/users.json`)

Happy Testing! 🧪
