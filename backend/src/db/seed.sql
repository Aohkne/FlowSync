-- ============================================
-- FlowSync Database Seed Data
-- ============================================

-- Clear existing data (careful in production!)
TRUNCATE TABLE activities CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE tasks CASCADE;
TRUNCATE TABLE columns CASCADE;
TRUNCATE TABLE board_members CASCADE;
TRUNCATE TABLE boards CASCADE;
TRUNCATE TABLE users CASCADE;

-- ============================================
-- 1. Create Users
-- ============================================
-- Password for all users: "password123" (hashed with bcrypt)
-- Hash generated with: await bcrypt.hash('password123', 10)

INSERT INTO users (id, email, password, full_name, avatar_url, created_at, updated_at) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'john@example.com',
  '$2b$10$rXAJmNvz5cZ5vYx5YX5YXOqZ5X5X5X5X5X5X5X5X5X5X5X5X5X5Xe',
  'John Doe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  NOW(),
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222',
  'jane@example.com',
  '$2b$10$rXAJmNvz5cZ5vYx5YX5YXOqZ5X5X5X5X5X5X5X5X5X5X5X5X5X5Xe',
  'Jane Smith',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  NOW(),
  NOW()
),
(
  '33333333-3333-3333-3333-333333333333',
  'bob@example.com',
  '$2b$10$rXAJmNvz5cZ5vYx5YX5YXOqZ5X5X5X5X5X5X5X5X5X5X5X5X5X5Xe',
  'Bob Johnson',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  NOW(),
  NOW()
),
(
  '44444444-4444-4444-4444-444444444444',
  'alice@example.com',
  '$2b$10$rXAJmNvz5cZ5vYx5YX5YXOqZ5X5X5X5X5X5X5X5X5X5X5X5X5X5Xe',
  'Alice Williams',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
  NOW(),
  NOW()
);

-- ============================================
-- 2. Create Boards
-- ============================================

INSERT INTO boards (id, title, description, owner_id, is_public, created_at, updated_at) VALUES
(
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'Marketing Campaign Q1 2024',
  'Planning and tracking all marketing activities for Q1',
  '11111111-1111-1111-1111-111111111111',
  false,
  NOW() - INTERVAL '10 days',
  NOW() - INTERVAL '2 hours'
),
(
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'Product Development',
  'New features and bug fixes',
  '11111111-1111-1111-1111-111111111111',
  false,
  NOW() - INTERVAL '20 days',
  NOW() - INTERVAL '1 hour'
),
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'Website Redesign',
  'Complete website overhaul project',
  '22222222-2222-2222-2222-222222222222',
  true,
  NOW() - INTERVAL '15 days',
  NOW() - INTERVAL '30 minutes'
);

-- ============================================
-- 3. Add Board Members
-- ============================================

INSERT INTO board_members (id, board_id, user_id, role, joined_at) VALUES
-- Marketing Campaign members
(
  'bm000001-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  NOW() - INTERVAL '10 days'
),
(
  'bm000002-0000-0000-0000-000000000002',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  'editor',
  NOW() - INTERVAL '9 days'
),
(
  'bm000003-0000-0000-0000-000000000003',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '33333333-3333-3333-3333-333333333333',
  'viewer',
  NOW() - INTERVAL '8 days'
),

-- Product Development members
(
  'bm000004-0000-0000-0000-000000000004',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  NOW() - INTERVAL '20 days'
),
(
  'bm000005-0000-0000-0000-000000000005',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '33333333-3333-3333-3333-333333333333',
  'editor',
  NOW() - INTERVAL '18 days'
),
(
  'bm000006-0000-0000-0000-000000000006',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '44444444-4444-4444-4444-444444444444',
  'editor',
  NOW() - INTERVAL '15 days'
),

-- Website Redesign members
(
  'bm000007-0000-0000-0000-000000000007',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '22222222-2222-2222-2222-222222222222',
  'owner',
  NOW() - INTERVAL '15 days'
),
(
  'bm000008-0000-0000-0000-000000000008',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '44444444-4444-4444-4444-444444444444',
  'editor',
  NOW() - INTERVAL '14 days'
);

-- ============================================
-- 4. Create Columns
-- ============================================

-- Marketing Campaign columns
INSERT INTO columns (id, board_id, title, position, created_at, updated_at) VALUES
('col00001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backlog', 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('col00002-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'To Do', 1, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('col00003-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'In Progress', 2, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('col00004-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Review', 3, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('col00005-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Done', 4, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

-- Product Development columns
('col00006-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'To Do', 0, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('col00007-0000-0000-0000-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'In Progress', 1, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('col00008-0000-0000-0000-000000000008', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Testing', 2, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('col00009-0000-0000-0000-000000000009', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Done', 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

-- Website Redesign columns
('col00010-0000-0000-0000-000000000010', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'To Do', 0, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('col00011-0000-0000-0000-000000000011', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'In Progress', 1, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('col00012-0000-0000-0000-000000000012', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Done', 2, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days');

-- ============================================
-- 5. Create Tasks
-- ============================================

-- Marketing Campaign tasks
INSERT INTO tasks (id, column_id, title, description, position, priority, assigned_to, created_by, created_at, updated_at) VALUES
-- Backlog
('task0001-0000-0000-0000-000000000001', 'col00001-0000-0000-0000-000000000001', 'Plan social media strategy', 'Define content calendar and posting schedule for Q1', 0, 'medium', NULL, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('task0002-0000-0000-0000-000000000002', 'col00001-0000-0000-0000-000000000001', 'Research competitor campaigns', 'Analyze top 5 competitors marketing strategies', 1, 'low', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- To Do
('task0003-0000-0000-0000-000000000003', 'col00002-0000-0000-0000-000000000002', 'Create email newsletter template', 'Design responsive email template for monthly newsletter', 0, 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('task0004-0000-0000-0000-000000000004', 'col00002-0000-0000-0000-000000000002', 'Write blog post about product launch', 'SEO-optimized blog post (min 1500 words)', 1, 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('task0005-0000-0000-0000-000000000005', 'col00002-0000-0000-0000-000000000002', 'Design Instagram carousel posts', 'Create 5 carousel posts for product features', 2, 'medium', NULL, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- In Progress
('task0006-0000-0000-0000-000000000006', 'col00003-0000-0000-0000-000000000003', 'Schedule influencer partnerships', 'Reach out to 10 micro-influencers in our niche', 0, 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 hours'),
('task0007-0000-0000-0000-000000000007', 'col00003-0000-0000-0000-000000000003', 'Update landing page copy', 'Improve conversion rate with better messaging', 1, 'medium', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour'),

-- Review
('task0008-0000-0000-0000-000000000008', 'col00004-0000-0000-0000-000000000004', 'Review Q4 campaign performance', 'Analyze metrics and prepare report', 0, 'high', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', NOW() - INTERVAL '30 minutes'),

-- Done
('task0009-0000-0000-0000-000000000009', 'col00005-0000-0000-0000-000000000005', 'Set up Google Analytics 4', 'Migrate from UA to GA4', 0, 'high', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),
('task0010-0000-0000-0000-000000000010', 'col00005-0000-0000-0000-000000000005', 'Create brand style guide', 'Document colors, fonts, and logo usage', 1, 'medium', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days'),

-- Product Development tasks
-- To Do
('task0011-0000-0000-0000-000000000011', 'col00006-0000-0000-0000-000000000006', 'Implement user authentication', 'Add JWT-based auth with refresh tokens', 0, 'high', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('task0012-0000-0000-0000-000000000012', 'col00006-0000-0000-0000-000000000006', 'Design database schema', 'Create ERD for new features', 1, 'high', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('task0013-0000-0000-0000-000000000013', 'col00006-0000-0000-0000-000000000006', 'Set up CI/CD pipeline', 'GitHub Actions for automated testing and deployment', 2, 'medium', NULL, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- In Progress
('task0014-0000-0000-0000-000000000014', 'col00007-0000-0000-0000-000000000007', 'Build REST API endpoints', 'CRUD operations for all resources', 0, 'high', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour'),
('task0015-0000-0000-0000-000000000015', 'col00007-0000-0000-0000-000000000007', 'Create responsive UI components', 'Build reusable React components', 1, 'high', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 minutes'),

-- Testing
('task0016-0000-0000-0000-000000000016', 'col00008-0000-0000-0000-000000000008', 'Write unit tests', 'Achieve 80% code coverage', 0, 'medium', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours'),

-- Done
('task0017-0000-0000-0000-000000000017', 'col00009-0000-0000-0000-000000000009', 'Set up project repository', 'Initialize Git repo with proper .gitignore', 0, 'high', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
('task0018-0000-0000-0000-000000000018', 'col00009-0000-0000-0000-000000000009', 'Choose tech stack', 'Decide on frameworks and libraries', 1, 'high', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days'),

-- Website Redesign tasks
-- To Do
('task0019-0000-0000-0000-000000000019', 'col00010-0000-0000-0000-000000000010', 'Create wireframes', 'Low-fidelity wireframes for all pages', 0, 'high', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('task0020-0000-0000-0000-000000000020', 'col00010-0000-0000-0000-000000000010', 'Design new logo', 'Modern, minimalist logo design', 1, 'medium', NULL, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- In Progress
('task0021-0000-0000-0000-000000000021', 'col00011-0000-0000-0000-000000000011', 'Design homepage mockup', 'High-fidelity design in Figma', 0, 'high', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 hours'),
('task0022-0000-0000-0000-000000000022', 'col00011-0000-0000-0000-000000000011', 'Choose color palette', 'Select primary and secondary colors', 1, 'medium', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours'),

-- Done
('task0023-0000-0000-0000-000000000023', 'col00012-0000-0000-0000-000000000012', 'Conduct user research', 'Interview 20 users about current website', 0, 'high', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'),
('task0024-0000-0000-0000-000000000024', 'col00012-0000-0000-0000-000000000012', 'Analyze competitor websites', 'Review top 10 competitor sites', 1, 'medium', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days');

-- ============================================
-- 6. Create Comments
-- ============================================

INSERT INTO comments (id, task_id, user_id, content, created_at, updated_at) VALUES
-- Comments on "Schedule influencer partnerships"
('cmt00001-0000-0000-0000-000000000001', 'task0006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Great progress! Have you reached out to @beauty_guru and @tech_insider yet?', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('cmt00002-0000-0000-0000-000000000002', 'task0006-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'Yes! Both responded positively. Waiting for their rate cards.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('cmt00003-0000-0000-0000-000000000003', 'task0006-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'I can help negotiate the rates if needed!', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),

-- Comments on "Build REST API endpoints"
('cmt00004-0000-0000-0000-000000000004', 'task0014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'Make sure to add proper error handling and validation', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
('cmt00005-0000-0000-0000-000000000005', 'task0014-0000-0000-0000-000000000014', '33333333-3333-3333-3333-333333333333', 'Already done! Also added rate limiting middleware.', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
('cmt00006-0000-0000-0000-000000000006', 'task0014-0000-0000-0000-000000000014', '44444444-4444-4444-4444-444444444444', 'Awesome! Can you share the API documentation?', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),

-- Comments on "Design homepage mockup"
('cmt00007-0000-0000-0000-000000000007', 'task0021-0000-0000-0000-000000000021', '22222222-2222-2222-2222-222222222222', 'Looking great! But can we make the hero section more prominent?', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('cmt00008-0000-0000-0000-000000000008', 'task0021-0000-0000-0000-000000000021', '44444444-4444-4444-4444-444444444444', 'Sure! I''ll increase the font size and add more whitespace.', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),

-- Comments on "Update landing page copy"
('cmt00009-0000-0000-0000-000000000009', 'task0007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Focus on benefits rather than features in the headline', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
('cmt00010-0000-0000-0000-000000000010', 'task0007-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'Good point! Updated the copy. Can you review?', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),

-- Comments on "Write unit tests"
('cmt00011-0000-0000-0000-000000000011', 'task0016-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', 'Don''t forget to test edge cases!', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
('cmt00012-0000-0000-0000-000000000012', 'task0016-0000-0000-0000-000000000016', '33333333-3333-3333-3333-333333333333', 'Already covered! Current coverage is at 85%.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- ============================================
-- 7. Create Activities
-- ============================================

INSERT INTO activities (id, board_id, user_id, action, entity_type, entity_id, metadata, created_at) VALUES
-- Marketing Campaign activities
('act00001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'created', 'board', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{"title": "Marketing Campaign Q1 2024"}', NOW() - INTERVAL '10 days'),
('act00002-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'created', 'task', 'task0003-0000-0000-0000-000000000003', '{"title": "Create email newsletter template"}', NOW() - INTERVAL '7 days'),
('act00003-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'moved', 'task', 'task0006-0000-0000-0000-000000000006', '{"from": "To Do", "to": "In Progress"}', NOW() - INTERVAL '4 days'),
('act00004-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'commented', 'task', 'task0006-0000-0000-0000-000000000006', '{"commentId": "cmt00002-0000-0000-0000-000000000002"}', NOW() - INTERVAL '2 hours'),
('act00005-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'updated', 'task', 'task0008-0000-0000-0000-000000000008', '{"field": "priority", "value": "high"}', NOW() - INTERVAL '1 hour'),

-- Product Development activities
('act00006-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'created', 'board', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '{"title": "Product Development"}', NOW() - INTERVAL '20 days'),
('act00007-0000-0000-0000-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'created', 'task', 'task0014-0000-0000-0000-000000000014', '{"title": "Build REST API endpoints"}', NOW() - INTERVAL '2 days'),
('act00008-0000-0000-0000-000000000008', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'moved', 'task', 'task0014-0000-0000-0000-000000000014', '{"from": "To Do", "to": "In Progress"}', NOW() - INTERVAL '2 days'),
('act00009-0000-0000-0000-000000000009', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'commented', 'task', 'task0014-0000-0000-0000-000000000014', '{"commentId": "cmt00006-0000-0000-0000-000000000006"}', NOW() - INTERVAL '3 hours'),
