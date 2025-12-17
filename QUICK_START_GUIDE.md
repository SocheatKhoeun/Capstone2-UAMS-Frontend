# Quick Start Guide: Student Image Upload

## What's New?

The student creation form now supports uploading profile images for face recognition! This guide shows you how to use the new feature.

## User Interface Changes

### Before

```
┌─────────────────────────────────────┐
│  Add New Student                    │
├─────────────────────────────────────┤
│  Student ID: [__________]           │
│  Email:      [__________]           │
│  Password:   [__________]           │
│  ...                                │
│  [Cancel]  [Create Student]         │
└─────────────────────────────────────┘
```

### After

```
┌─────────────────────────────────────┐
│  Add New Student                    │
├─────────────────────────────────────┤
│  Student ID: [__________]           │
│  Email:      [__________]           │
│  Password:   [__________]           │
│  ...                                │
│                                     │
│  Profile Image (optional) ℹ️         │
│  Max 5MB • JPG, PNG, GIF, WEBP     │
│  ┌───────────────────────────────┐ │
│  │         📷                    │ │
│  │  Click to upload student photo│ │
│  │  Recommended: 800x800px       │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Cancel]  [Create Student]         │
└─────────────────────────────────────┘
```

## How to Use

### Step 1: Open Create Student Form

Click the **"Add Student"** button on the student management page.

### Step 2: Fill Required Fields

- **Student ID** (required): e.g., STU-2025001
- **Email** (required): e.g., student@university.edu
- **Password** (required): 8-32 characters

### Step 3: Add Profile Image (Optional)

1. Scroll down to the "Profile Image" section
2. Click on the upload area (with camera icon)
3. Select an image from your computer
4. Image preview will appear immediately

**Supported Formats:**

- JPG / JPEG
- PNG
- GIF
- WEBP

**Size Limit:** Maximum 5MB

**Recommended:**

- Square aspect ratio (1:1)
- Resolution: 800x800px or higher
- Face clearly visible and centered

### Step 4: Review and Submit

- Check the image preview
- Click ❌ button on preview to remove/change image
- Click **"Create Student"** to save

### Step 5: Success!

✅ Student created with profile image successfully!

## Features

### ✅ Image Validation

The system automatically checks:

- File type (only images allowed)
- File size (max 5MB)
- Shows error if invalid

### ✅ Live Preview

See the uploaded image immediately before submitting.

### ✅ Easy Removal

Click the ❌ button to remove and choose another image.

### ✅ Optional Upload

You can still create students without images - the field is completely optional.

### ✅ Smart Endpoint Selection

- **With Image**: Uses `/students/with-image` endpoint
- **Without Image**: Uses regular `/students/` endpoint

## Error Messages

### "Invalid file type"

**Cause:** Uploaded file is not a supported image format.  
**Solution:** Upload JPG, PNG, GIF, or WEBP only.

### "File size exceeds 5MB"

**Cause:** Image file is too large.  
**Solution:** Compress or resize the image before uploading.

### "Email already registered"

**Cause:** Another student already has this email.  
**Solution:** Use a different email address.

### "Student code already registered"

**Cause:** Student ID is already in use.  
**Solution:** Use a unique student ID.

## API Details

### Endpoint Used

```
POST /api/v1/admins/students/with-image
```

### Request Type

```
Content-Type: multipart/form-data
```

### Authorization

```
Authorization: Bearer {admin_token}
```

_(Automatically handled by the system)_

### Response

```json
{
  "status": "success",
  "code": 201,
  "message": "Student created with image",
  "data": {
    "id": 1,
    "global_id": "uuid...",
    "student_code": "STU2025001",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "profile_image": "http://localhost:8000/uploads/students/uuid-filename.jpg",
    ...
  }
}
```

## Technical Details

### Files Modified

1. **pages/admin/student/index.vue**

   - Added image upload UI
   - Added image validation
   - Updated form submission logic

2. **store/studentStore.js**

   - Added `createStudentWithImage()` action
   - Handles FormData submission

3. **services/studentService.ts**

   - Added `createStudentWithImage()` API function

4. **types/student.ts**
   - Added `profile_image` field to interfaces

### Data Flow

```
User Selects Image
      ↓
Client Validation (type, size)
      ↓
Preview Generated (FileReader)
      ↓
User Submits Form
      ↓
FormData Created (all fields + image)
      ↓
Store Action (createStudentWithImage)
      ↓
Service Function (API call)
      ↓
Backend API (/students/with-image)
      ↓
Response with Image URL
      ↓
Student List Updated
      ↓
Success Message Displayed
```

## Best Practices

### For Admins

1. **Use high-quality photos** for better face recognition
2. **Ensure face is visible** and well-lit
3. **Center the face** in the photo
4. **Use consistent background** across all student photos
5. **Square format preferred** (1:1 aspect ratio)

### For Developers

1. **Test file validation** with various file types
2. **Test size limits** with large files
3. **Monitor upload performance** with slow connections
4. **Check backend storage** regularly
5. **Implement image optimization** for better performance

## Future Enhancements

### Planned Features

- ✨ **Image Cropping**: Crop images before upload
- ✨ **Drag & Drop**: Drag files directly onto upload area
- ✨ **Face Detection**: Validate face presence before upload
- ✨ **Compression**: Auto-compress large images
- ✨ **Progress Bar**: Show upload progress
- ✨ **Edit Image**: Update images for existing students

## Troubleshooting

### Image won't upload

1. Check file size (must be < 5MB)
2. Verify file format (JPG, PNG, GIF, WEBP)
3. Check browser console for errors
4. Ensure backend server is running

### Preview not showing

1. Check if FileReader is supported
2. Try a different image file
3. Check browser console for errors
4. Clear browser cache

### Form submission fails

1. Verify all required fields are filled
2. Check network connection
3. Review backend API logs
4. Check authentication token

## Support

For issues or questions:

1. Check this guide first
2. Review backend API documentation
3. Check console errors
4. Contact system administrator

---

**Version:** 1.0  
**Last Updated:** December 16, 2025  
**Status:** ✅ Production Ready
