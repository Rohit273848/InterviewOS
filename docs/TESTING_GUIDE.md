# 🧪 Testing Guide - InterviewOS

## Quick Test Checklist

### 1. Peer Review Page Testing

#### Profile Section
- [ ] Profile displays with avatar, name, email
- [ ] Click "Edit Profile" button
- [ ] Change name and email
- [ ] Click "Save" → Toast notification appears
- [ ] Click "Cancel" → Changes revert

#### File Upload
- [ ] Click upload area
- [ ] Select a PDF file (< 5MB)
- [ ] File name appears
- [ ] Add description in textarea
- [ ] Click "Submit for Review"
- [ ] Confirmation modal appears
- [ ] Click "Submit" → Success toast
- [ ] File appears in "My Submissions" tab

#### Browse Submissions Tab
- [ ] See 3 sample submissions
- [ ] Each shows: name, avatar, file name, description, rating, review count
- [ ] Click "Review This" → Modal opens
- [ ] Click stars to rate (1-5)
- [ ] Type review comment
- [ ] Click "Submit Review" → Success toast
- [ ] Click "View Reviews" → Reviews section appears

#### My Submissions Tab
- [ ] Click "My Submissions" tab
- [ ] See your uploaded resume
- [ ] Shows file name and description
- [ ] Click "View Reviews" → See reviews for your submission

#### Review Functionality
- [ ] In "View Reviews" section
- [ ] See all reviews with ratings
- [ ] Click "Like" button → Counter increases
- [ ] Click "Like" again → Counter decreases
- [ ] Click "Reply" → Input field appears
- [ ] Type reply and press Enter → Success toast
- [ ] Change sort dropdown → Reviews reorder

#### Mobile Responsiveness
- [ ] Resize browser to 375px width
- [ ] All content visible (no horizontal scroll)
- [ ] Buttons are easy to tap
- [ ] Text is readable
- [ ] Modals fit on screen
- [ ] Tabs work properly

### 2. Mock Interview Testing

#### Settings
- [ ] Select "Technical" interview type
- [ ] Select "Medium" difficulty
- [ ] Select "15" questions
- [ ] Click "Start Interview"
- [ ] Verify 15 questions appear
- [ ] Questions match selected type and difficulty

#### Interview Flow
- [ ] Type answer in textarea
- [ ] Click "Next Question"
- [ ] Progress bar updates
- [ ] Click "Show Hint" → Hint appears
- [ ] Complete all questions
- [ ] See interview summary

### 3. Question Bank Testing

#### Search
- [ ] Type "array" in search box
- [ ] See filtered results
- [ ] Clear search → All questions appear

#### Company Filter
- [ ] Select "Google" from dropdown
- [ ] See only Google questions
- [ ] Select "All" → All questions appear

#### Difficulty Filter
- [ ] Click "Easy" button
- [ ] See only easy questions
- [ ] Click "All" → All questions appear

#### Solve Button
- [ ] Click "Solve" on any question
- [ ] New tab opens with LeetCode link

#### Clear Filters
- [ ] Apply multiple filters
- [ ] Click "Clear Filters"
- [ ] All filters reset

### 4. Authentication Testing

#### Sign Up
- [ ] Go to Sign Up page
- [ ] Fill in name, email, password
- [ ] Click "Sign Up"
- [ ] Redirects to Dashboard
- [ ] User name appears in sidebar

#### Sign In
- [ ] Go to Sign In page
- [ ] Enter any email and password
- [ ] Click "Sign In"
- [ ] Redirects to Dashboard

#### Logout
- [ ] Click "Logout" in sidebar
- [ ] Redirects to Landing page
- [ ] Try accessing Dashboard → Redirects to Sign In

### 5. Responsive Testing

#### Mobile (375px)
- [ ] Landing page looks good
- [ ] Dashboard cards stack vertically
- [ ] Sidebar becomes hamburger menu
- [ ] All buttons are tappable
- [ ] Forms are usable

#### Tablet (768px)
- [ ] Two-column layouts work
- [ ] Sidebar visible
- [ ] Cards have proper spacing

#### Desktop (1440px)
- [ ] Three-column layouts work
- [ ] Sidebar fixed
- [ ] Proper use of white space

## Browser Testing

Test in:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Performance Checks

- [ ] Page loads in < 2 seconds
- [ ] Animations are smooth (60fps)
- [ ] No console errors
- [ ] No console warnings
- [ ] Images load properly
- [ ] Fonts load properly

## Accessibility Checks

- [ ] Tab navigation works
- [ ] Focus indicators visible
- [ ] Buttons have proper labels
- [ ] Forms have labels
- [ ] Color contrast is good
- [ ] Text is readable

## Common Issues & Solutions

### Issue: File upload not working
**Solution**: Check file size (< 5MB) and type (PDF, DOC, DOCX only)

### Issue: Reviews not appearing
**Solution**: Make sure you're viewing the correct submission ID

### Issue: Filters not working
**Solution**: Clear browser cache and reload

### Issue: Mobile layout broken
**Solution**: Check Tailwind CSS is loaded properly

### Issue: Animations not smooth
**Solution**: Check if Framer Motion is installed

## Test Data

### Sample Users
- Name: Student User
- Email: student@example.com
- Password: (any password works in demo mode)

### Sample Submissions
1. Priya Sharma - "Need help with formatting"
2. Rahul Kumar - "First resume, any feedback appreciated"
3. Sneha Patel - "Applying for frontend roles"

### Sample Questions
- 20 questions across 8 companies
- Easy, Medium, Hard difficulties
- Behavioral, Technical, System Design types

## Success Criteria

✅ All buttons work  
✅ All forms submit  
✅ All filters apply  
✅ All modals open/close  
✅ All animations play  
✅ All data displays  
✅ Mobile layout works  
✅ No console errors  

---

**Testing Status**: Ready for comprehensive testing!

**Estimated Testing Time**: 30-45 minutes for full test suite
