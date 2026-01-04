# Troubleshooting Guide

## Common Issues

### 1. API Connection Error on Android

**Problem**: Getting `[API Response Error]` when trying to register or login on Android emulator.

**Cause**: Android emulators cannot access `localhost` directly. The `localhost` address refers to the emulator itself, not your host machine.

**Solution**: Update the `.env.development` file to use the Android emulator's special IP address:

#### For Android Emulator:
```bash
# .env.development
API_URL=http://10.0.2.2:3000/api
```

`10.0.2.2` is a special alias to your host machine's localhost from the Android emulator.

#### For iOS Simulator:
```bash
# .env.development
API_URL=http://localhost:3000/api
```

iOS simulators can access `localhost` directly.

#### For Physical Device:
```bash
# .env.development
API_URL=http://YOUR_COMPUTER_IP:3000/api
# Example: API_URL=http://192.168.1.100:3000/api
```

Find your computer's IP address:
- **Mac**: `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: `ipconfig`
- **Linux**: `ip addr show`

**After changing `.env.development`**:
1. Stop Metro bundler (Ctrl+C)
2. Clear cache: `npm run clean:cache` or `npx react-native start --reset-cache`
3. Rebuild the app:
   - Android: `npm run android`
   - iOS: `npm run ios`

---

### 2. Backend API Not Running

**Problem**: Connection errors or timeout errors.

**Solution**: Make sure the backend API is running:

```bash
cd ../parking-managment-api
# Start the API on port 3000
```

Verify it's accessible:
```bash
curl http://localhost:3000/api/parking-lots
```

---

### 3. CORS Issues (When using physical device)

**Problem**: CORS errors when connecting from physical device.

**Solution**: Update backend CORS configuration to allow requests from all origins (for development):

In Spring Boot, ensure `@CrossOrigin(origins = "*")` is set on controllers.

---

### 4. Registration Validation Errors

**Problem**: Backend returns validation errors.

**Common Issues**:
- Email already exists
- Password too short (minimum 6 characters)
- Missing required fields

**Solution**: Check the error details in the console logs. The backend will return specific validation messages.

---

### 5. Port 3000 Already in Use

**Problem**: Backend API won't start because port 3000 is in use.

**Solution**:
1. Find and kill the process using port 3000:
   ```bash
   # Mac/Linux
   lsof -ti:3000 | xargs kill -9

   # Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. Or change the API port in both:
   - Backend configuration
   - Mobile `.env.development` file

---

### 6. Metro Bundler Issues

**Problem**: App won't load, stuck on splash screen, or build errors.

**Solution**: Clean and rebuild:

```bash
# Clean cache
npm run clean:cache

# Or manually:
watchman watch-del-all
rm -rf node_modules
rm -rf ios/Pods
rm -rf ios/build
rm -rf android/build
rm -rf android/app/build
npm install
cd ios && pod install && cd ..

# Rebuild
npm run android  # or npm run ios
```

---

### 7. Environment Variables Not Loading

**Problem**: App uses wrong API URL or environment variables are undefined.

**Solution**:

1. Ensure `react-native-config` is properly linked:
   ```bash
   cd ios && pod install && cd ..
   ```

2. Rebuild the app (environment variables are bundled at build time):
   ```bash
   npm run android  # or npm run ios
   ```

3. Check the `.env.development` file exists and has correct values.

4. Verify in code:
   ```typescript
   import Config from 'react-native-config';
   console.log('API_URL:', Config.API_URL);
   ```

---

## Debugging API Errors

When you get an API error, check the console for detailed logs:

### Check Metro Bundler Console

Look for these logs:
```
[API Request] POST /auth/register
[API Response Error] {
  url: "/auth/register",
  method: "POST",
  status: 400,
  data: { ... },
  requestData: { ... }
}
[Register Error] { ... }
```

### Common Error Codes

- **400 Bad Request**: Invalid request data (check validation)
- **401 Unauthorized**: Invalid credentials or token expired
- **404 Not Found**: API endpoint doesn't exist (check URL)
- **500 Internal Server Error**: Backend error (check backend logs)
- **Network Error**: Can't connect to backend (check API_URL and backend status)

---

## Quick Checklist

Before testing authentication:

- [ ] Backend API is running on port 3000
- [ ] `.env.development` has correct `API_URL` for your platform
  - Android: `http://10.0.2.2:3000/api`
  - iOS: `http://localhost:3000/api`
  - Physical device: `http://YOUR_IP:3000/api`
- [ ] App has been rebuilt after changing `.env.development`
- [ ] Metro bundler is running
- [ ] Check console logs for detailed error messages

---

## Getting More Details

To see full error details:

1. Open React Native Developer Menu:
   - iOS: `Cmd + D` (simulator) or shake device
   - Android: `Cmd + M` (emulator) or shake device

2. Enable Debug Mode

3. Check Chrome DevTools:
   - Open Chrome DevTools (http://localhost:8081/debugger-ui/)
   - Check Console tab for detailed logs

4. Check Metro Bundler console output in your terminal

---

## Still Having Issues?

If you're still having problems:

1. Capture the full error logs from:
   - Metro bundler console
   - React Native app console
   - Backend API logs

2. Check the exact error message and HTTP status code

3. Verify the backend API works with curl/Postman:
   ```bash
   curl -X POST http://localhost:3000/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "test@example.com",
       "password": "password123",
       "firstName": "Test",
       "lastName": "User"
     }'
   ```

4. Share the error details for further assistance
