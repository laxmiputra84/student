-- Aura Management System Database Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com)

-- 1. Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    usn TEXT UNIQUE NOT NULL,
    branch TEXT NOT NULL,
    semester TEXT NOT NULL,
    attendance INTEGER DEFAULT 0,
    email TEXT,
    phone TEXT,
    address TEXT,
    cgpa TEXT DEFAULT '0.0',
    credits TEXT DEFAULT '0/160',
    avatar_url TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Staff Table
CREATE TABLE IF NOT EXISTS staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    dept TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    type TEXT NOT NULL, -- Faculty, Staff, Admin
    campus TEXT DEFAULT 'Main Campus',
    avatar_url TEXT,
    status TEXT DEFAULT 'On Duty',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Subjects Table
CREATE TABLE IF NOT EXISTS subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    dept TEXT NOT NULL,
    credits INTEGER NOT NULL,
    semester TEXT NOT NULL,
    type TEXT NOT NULL, -- Core, Elective, Specialization
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Academic Works Table (Assignments/Projects)
CREATE TABLE IF NOT EXISTS academic_works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- Assignment, Lab, Project
    dept TEXT NOT NULL,
    deadline DATE NOT NULL,
    priority TEXT DEFAULT 'Medium',
    total_expected INTEGER DEFAULT 60,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Transport Routes Table
CREATE TABLE IF NOT EXISTS transport_routes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    bus_no TEXT UNIQUE NOT NULL,
    driver TEXT NOT NULL,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Transport Stops Table
CREATE TABLE IF NOT EXISTS transport_stops (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    route_id UUID REFERENCES transport_routes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Attendance Records
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES students(id),
    subject_id UUID REFERENCES subjects(id),
    status TEXT NOT NULL, -- Present, Absent
    marked_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sample Data for Students
INSERT INTO students (name, usn, branch, semester, attendance, email, phone, address, cgpa, credits, status)
VALUES 
('Laxmiputra', '1RV22CS001', 'CSE', '6th', 85, 'laxmi@aura.edu', '+91 99000 11000', 'Bengaluru', '9.2', '128/160', 'Active'),
('Aditi Sharma', '1RV22CS042', 'CSE', '4th', 92, 'aditi@aura.edu', '+91 99000 22000', 'Delhi', '8.9', '84/160', 'Active'),
('Rohan Das', '1RV22EC015', 'ECE', '6th', 65, 'rohan@aura.edu', '+91 99000 33000', 'Mumbai', '7.5', '110/160', 'Active')
ON CONFLICT (usn) DO NOTHING;

-- Sample Data for Staff
INSERT INTO staff (name, role, dept, email, type, campus, status)
VALUES 
('Dr. Arvind Kumar', 'Dean of Academics', 'Administration', 'arvind.k@aura.edu', 'Faculty', 'Main Campus', 'On Duty'),
('Prof. Megha Rao', 'HOD - CSE', 'Computer Science', 'megha.r@aura.edu', 'Faculty', 'Main Campus', 'In Meeting')
ON CONFLICT (email) DO NOTHING;

-- Sample Data for Subjects
INSERT INTO subjects (code, name, dept, credits, semester, type, status)
VALUES 
('CS601', 'Algorithm Design & Analysis', 'Computer Science', 4, '6th', 'Core', 'Active'),
('MAT402', 'Discrete Mathematics', 'Mathematics', 3, '4th', 'Core', 'Active')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    msg TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);


INSERT INTO activity_logs (msg, type) VALUES
('Portal connection established from Bengaluru Node', 'success'),
('Academic curriculum database synchronized', 'info'),

CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );


CREATE POLICY "Anon Write Access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.extension(name) = 'jpg' OR storage.extension(name) = 'png' OR storage.extension(name) = 'jpeg')
  AND LOWER((storage.foldername(name))[1]) = 'public'
);
