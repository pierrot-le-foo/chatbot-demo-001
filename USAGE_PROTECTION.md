# AI Chat Demo - Usage Protection

This implementation includes several layers of protection to prevent excessive OpenAI credit usage while maintaining a good demo experience.

## Protection Mechanisms

### 1. Message Limits (Per Session)
- **Limit**: 10 messages per session
- **Implementation**: Frontend tracks user messages, API validates count
- **Reset**: User can start a new session with "New Session" button

### 2. Character Limits (Per Message)
- **Limit**: 500 characters per message
- **Implementation**: Frontend enforces with `maxLength`, API validates
- **User Experience**: Character counter shows remaining characters

### 3. Rate Limiting (Per IP)
- **Limit**: 20 requests per hour per IP address
- **Implementation**: In-memory rate limiter using IP tracking
- **Cleanup**: Automatic cleanup of expired entries

### 4. Model Restrictions
- **Forced Model**: GPT-4o requests are downgraded to GPT-4o-mini
- **Cost**: Significantly cheaper (~95% cost reduction)
- **Transparency**: UI shows "(Demo: uses Mini)" for GPT-4o selection

### 5. Response Controls
- **System Prompt**: Encourages concise responses
- **Model Selection**: Defaults to most cost-effective model (GPT-4o-mini)

## UI/UX Features

### Status Indicators
- Message counter in header: "X messages remaining (Y/10 used)"
- Character counter: "X/500 characters"
- Warning states:
  - ⚠️ When 2 or fewer messages remain
  - 🚫 When limit is reached

### Session Management
- "New Session" button to reset message count
- Disabled send button when limits reached
- Clear error states and loading indicators

### Error Handling
- Specific error messages for different limit types
- Retry functionality for failed requests
- Graceful degradation for rate limits

## Implementation Files

- `/app/api/chat/route.ts` - API route with all server-side validations
- `/lib/rate-limiter.ts` - In-memory rate limiting utility
- `/app/page.tsx` - Frontend with limit tracking and UI

## Cost Estimation

With these limits, worst-case scenario per user:
- 10 messages × ~100 tokens each = ~1,000 tokens
- GPT-4o-mini: ~$0.0002 per user session
- Even with 1,000 demo users per day: ~$0.20/day

## Additional Considerations

### For Production Deployment
1. **Database Rate Limiting**: Replace in-memory limiter with Redis/database
2. **User Authentication**: Track limits per authenticated user
3. **Regional Limits**: Different limits for different geographic regions
4. **Time-based Resets**: Daily/weekly limit resets instead of per-session
5. **Usage Analytics**: Track usage patterns and costs

### Security Notes
- IP-based limiting can be bypassed with VPNs
- Consider implementing CAPTCHA for suspected abuse
- Monitor for unusual usage patterns
- Set up billing alerts in OpenAI dashboard

## Environment Variables Required

```env
OPENAI_API_KEY=your_openai_api_key_here
```

The app will show appropriate error messages if the API key is missing.
