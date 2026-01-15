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
-- Password for all users: "password123"
-- You need to generate real bcrypt hash. For now using placeholder.

INSERT INTO users (id, email, password, full_name, avatar_url, created_at, updated_at) VALUES
(
  '11111111-1111-1111-1111-111111111111',
  'john@example.com',
  '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
  'John Doe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  NOW(),
  NOW()
),
(
  '22222222-2222-2222-2222-222222222222',
  'jane@example.com',
  '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
  'Jane Smith',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
  NOW(),
  NOW()
),
(
  '33333333-3333-3333-3333-333333333333',
  'bob@example.com',
  '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
  'Bob Johnson',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
  NOW(),
  NOW()
),
(
  '44444444-4444-4444-4444-444444444444',
  'alice@example.com',
  '$2b$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu/1u',
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
  'a0000001-0000-0000-0000-000000000001',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  NOW() - INTERVAL '10 days'
),
(
  'a0000002-0000-0000-0000-000000000002',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '22222222-2222-2222-2222-222222222222',
  'editor',
  NOW() - INTERVAL '9 days'
),
(
  'a0000003-0000-0000-0000-000000000003',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  '33333333-3333-3333-3333-333333333333',
  'viewer',
  NOW() - INTERVAL '8 days'
),

-- Product Development members
(
  'b0000004-0000-0000-0000-000000000004',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '11111111-1111-1111-1111-111111111111',
  'owner',
  NOW() - INTERVAL '20 days'
),
(
  'b0000005-0000-0000-0000-000000000005',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '33333333-3333-3333-3333-333333333333',
  'editor',
  NOW() - INTERVAL '18 days'
),
(
  'b0000006-0000-0000-0000-000000000006',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  '44444444-4444-4444-4444-444444444444',
  'editor',
  NOW() - INTERVAL '15 days'
),

-- Website Redesign members
(
  'c0000007-0000-0000-0000-000000000007',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  '22222222-2222-2222-2222-222222222222',
  'owner',
  NOW() - INTERVAL '15 days'
),
(
  'c0000008-0000-0000-0000-000000000008',
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
('c0100001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Backlog', 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('c0100002-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'To Do', 1, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('c0100003-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'In Progress', 2, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('c0100004-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Review', 3, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
('c0100005-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Done', 4, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),

-- Product Development columns
('c0100006-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'To Do', 0, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('c0100007-0000-0000-0000-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'In Progress', 1, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('c0100008-0000-0000-0000-000000000008', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Testing', 2, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),
('c0100009-0000-0000-0000-000000000009', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Done', 3, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'),

-- Website Redesign columns
('c0100010-0000-0000-0000-000000000010', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'To Do', 0, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('c0100011-0000-0000-0000-000000000011', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'In Progress', 1, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
('c0100012-0000-0000-0000-000000000012', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Done', 2, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days');

-- ============================================
-- 5. Create Tasks
-- ============================================

INSERT INTO tasks (id, column_id, title, description, position, priority, assigned_to, created_by, created_at, updated_at) VALUES
-- Marketing Campaign tasks - Backlog
('e0010001-0000-0000-0000-000000000001', 'c0100001-0000-0000-0000-000000000001', 'Plan social media strategy', 'Define content calendar and posting schedule for Q1', 0, 'medium', NULL, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
('e0010002-0000-0000-0000-000000000002', 'c0100001-0000-0000-0000-000000000001', 'Research competitor campaigns', 'Analyze top 5 competitors marketing strategies', 1, 'low', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),

-- To Do
('e0010003-0000-0000-0000-000000000003', 'c0100002-0000-0000-0000-000000000002', 'Create email newsletter template', 'Design responsive email template for monthly newsletter', 0, 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
('e0010004-0000-0000-0000-000000000004', 'c0100002-0000-0000-0000-000000000002', 'Write blog post about product launch', 'SEO-optimized blog post (min 1500 words)', 1, 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
('e0010005-0000-0000-0000-000000000005', 'c0100002-0000-0000-0000-000000000002', 'Design Instagram carousel posts', 'Create 5 carousel posts for product features', 2, 'medium', NULL, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),

-- In Progress
('e0010006-0000-0000-0000-000000000006', 'c0100003-0000-0000-0000-000000000003', 'Schedule influencer partnerships', 'Reach out to 10 micro-influencers in our niche', 0, 'high', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days', NOW() - INTERVAL '2 hours'),
('e0010007-0000-0000-0000-000000000007', 'c0100003-0000-0000-0000-000000000003', 'Update landing page copy', 'Improve conversion rate with better messaging', 1, 'medium', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days', NOW() - INTERVAL '1 hour'),

-- Review
('e0010008-0000-0000-0000-000000000008', 'c0100004-0000-0000-0000-000000000004', 'Review Q4 campaign performance', 'Analyze metrics and prepare report', 0, 'high', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', NOW() - INTERVAL '30 minutes'),

-- Done
('e0010009-0000-0000-0000-000000000009', 'c0100005-0000-0000-0000-000000000005', 'Set up Google Analytics 4', 'Migrate from UA to GA4', 0, 'high', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '8 days', NOW() - INTERVAL '7 days'),
('e0010010-0000-0000-0000-000000000010', 'c0100005-0000-0000-0000-000000000005', 'Create brand style guide', 'Document colors, fonts, and logo usage', 1, 'medium', '22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '9 days', NOW() - INTERVAL '8 days'),

-- Product Development tasks - To Do
('e0010011-0000-0000-0000-000000000011', 'c0100006-0000-0000-0000-000000000006', 'Implement user authentication', 'Add JWT-based auth with refresh tokens', 0, 'high', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
('e0010012-0000-0000-0000-000000000012', 'c0100006-0000-0000-0000-000000000006', 'Design database schema', 'Create ERD for new features', 1, 'high', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
('e0010013-0000-0000-0000-000000000013', 'c0100006-0000-0000-0000-000000000006', 'Set up CI/CD pipeline', 'GitHub Actions for automated testing and deployment', 2, 'medium', NULL, '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),

-- In Progress
('e0010014-0000-0000-0000-000000000014', 'c0100007-0000-0000-0000-000000000007', 'Build REST API endpoints', 'CRUD operations for all resources', 0, 'high', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 hour'),
('e0010015-0000-0000-0000-000000000015', 'c0100007-0000-0000-0000-000000000007', 'Create responsive UI components', 'Build reusable React components', 1, 'high', '44444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day', NOW() - INTERVAL '30 minutes'),

-- Testing
('e0010016-0000-0000-0000-000000000016', 'c0100008-0000-0000-0000-000000000008', 'Write unit tests', 'Achieve 80% code coverage', 0, 'medium', '33333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours'),

-- Done
('e0010017-0000-0000-0000-000000000017', 'c0100009-0000-0000-0000-000000000009', 'Set up project repository', 'Initialize Git repo with proper .gitignore', 0, 'high', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '20 days', NOW() - INTERVAL '19 days'),
('e0010018-0000-0000-0000-000000000018', 'c0100009-0000-0000-0000-000000000009', 'Choose tech stack', 'Decide on frameworks and libraries', 1, 'high', '11111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', NOW() - INTERVAL '19 days', NOW() - INTERVAL '18 days'),

-- Website Redesign tasks - To Do
('e0010019-0000-0000-0000-000000000019', 'c0100010-0000-0000-0000-000000000010', 'Create wireframes', 'Low-fidelity wireframes for all pages', 0, 'high', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
('e0010020-0000-0000-0000-000000000020', 'c0100010-0000-0000-0000-000000000010', 'Design new logo', 'Modern, minimalist logo design', 1, 'medium', NULL, '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),

-- In Progress
('e0010021-0000-0000-0000-000000000021', 'c0100011-0000-0000-0000-000000000011', 'Design homepage mockup', 'High-fidelity design in Figma', 0, 'high', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day', NOW() - INTERVAL '3 hours'),
('e0010022-0000-0000-0000-000000000022', 'c0100011-0000-0000-0000-000000000011', 'Choose color palette', 'Select primary and secondary colors', 1, 'medium', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '1 day', NOW() - INTERVAL '2 hours'),

-- Done
('e0010023-0000-0000-0000-000000000023', 'c0100012-0000-0000-0000-000000000012', 'Conduct user research', 'Interview 20 users about current website', 0, 'high', '22222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '14 days', NOW() - INTERVAL '13 days'),
('e0010024-0000-0000-0000-000000000024', 'c0100012-0000-0000-0000-000000000012', 'Analyze competitor websites', 'Review top 10 competitor sites', 1, 'medium', '44444444-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', NOW() - INTERVAL '13 days', NOW() - INTERVAL '12 days');

-- ============================================
-- 6. Create Comments
-- ============================================

INSERT INTO comments (id, task_id, user_id, content, created_at, updated_at) VALUES
-- Comments on "Schedule influencer partnerships"
('f0000001-0000-0000-0000-000000000001', 'e0010006-0000-0000-0000-000000000006', '11111111-1111-1111-1111-111111111111', 'Great progress! Have you reached out to @beauty_guru and @tech_insider yet?', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),
('f0000002-0000-0000-0000-000000000002', 'e0010006-0000-0000-0000-000000000006', '22222222-2222-2222-2222-222222222222', 'Yes! Both responded positively. Waiting for their rate cards.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('f0000003-0000-0000-0000-000000000003', 'e0010006-0000-0000-0000-000000000006', '33333333-3333-3333-3333-333333333333', 'I can help negotiate the rates if needed!', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),

-- Comments on "Build REST API endpoints"
('f0000004-0000-0000-0000-000000000004', 'e0010014-0000-0000-0000-000000000014', '11111111-1111-1111-1111-111111111111', 'Make sure to add proper error handling and validation', NOW() - INTERVAL '5 hours', NOW() - INTERVAL '5 hours'),
('f0000005-0000-0000-0000-000000000005', 'e0010014-0000-0000-0000-000000000014', '33333333-3333-3333-3333-333333333333', 'Already done! Also added rate limiting middleware.', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
('f0000006-0000-0000-0000-000000000006', 'e0010014-0000-0000-0000-000000000014', '44444444-4444-4444-4444-444444444444', 'Awesome! Can you share the API documentation?', NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours'),

-- Comments on "Design homepage mockup"
('f0000007-0000-0000-0000-000000000007', 'e0010021-0000-0000-0000-000000000021', '22222222-2222-2222-2222-222222222222', 'Looking great! But can we make the hero section more prominent?', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours'),
('f0000008-0000-0000-0000-000000000008', 'e0010021-0000-0000-0000-000000000021', '44444444-4444-4444-4444-444444444444', 'Sure! I will increase the font size and add more whitespace.', NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),

-- Comments on "Update landing page copy"
('f0000009-0000-0000-0000-000000000009', 'e0010007-0000-0000-0000-000000000007', '11111111-1111-1111-1111-111111111111', 'Focus on benefits rather than features in the headline', NOW() - INTERVAL '6 hours', NOW() - INTERVAL '6 hours'),
('f0000010-0000-0000-0000-000000000010', 'e0010007-0000-0000-0000-000000000007', '22222222-2222-2222-2222-222222222222', 'Good point! Updated the copy. Can you review?', NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '30 minutes'),

-- Comments on "Write unit tests"
('f0000011-0000-0000-0000-000000000011', 'e0010016-0000-0000-0000-000000000016', '11111111-1111-1111-1111-111111111111', 'Do not forget to test edge cases!', NOW() - INTERVAL '4 hours', NOW() - INTERVAL '4 hours'),
('f0000012-0000-0000-0000-000000000012', 'e0010016-0000-0000-0000-000000000016', '33333333-3333-3333-3333-333333333333', 'Already covered! Current coverage is at 85%.', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- ============================================
-- 7. Create Activities
-- ============================================

INSERT INTO activities (id, board_id, user_id, action, entity_type, entity_id, metadata, created_at) VALUES
-- Marketing Campaign activities
('d0000001-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'created', 'board', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '{"title": "Marketing Campaign Q1 2024"}', NOW() - INTERVAL '10 days'),
('d0000002-0000-0000-0000-000000000002', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'created', 'task', 'e0010003-0000-0000-0000-000000000003', '{"title": "Create email newsletter template"}', NOW() - INTERVAL '7 days'),
('d0000003-0000-0000-0000-000000000003', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'moved', 'task', 'e0010006-0000-0000-0000-000000000006', '{"from": "To Do", "to": "In Progress"}', NOW() - INTERVAL '4 days'),
('d0000004-0000-0000-0000-000000000004', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 'commented', 'task', 'e0010006-0000-0000-0000-000000000006', '{"commentId": "f0000002-0000-0000-0000-000000000002"}', NOW() - INTERVAL '2 hours'),
('d0000005-0000-0000-0000-000000000005', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'updated', 'task', 'e0010008-0000-0000-0000-000000000008', '{"field": "priority", "value": "high"}', NOW() - INTERVAL '1 hour'),

-- Product Development activities
('d0000006-0000-0000-0000-000000000006', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'created', 'board', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '{"title": "Product Development"}', NOW() - INTERVAL '20 days'),
('d0000007-0000-0000-0000-000000000007', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'created', 'task', 'e0010014-0000-0000-0000-000000000014', '{"title": "Build REST API endpoints"}', NOW() - INTERVAL '2 days'),
('d0000008-0000-0000-0000-000000000008', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '33333333-3333-3333-3333-333333333333', 'moved', 'task', 'e0010014-0000-0000-0000-000000000014', '{"from": "To Do", "to": "In Progress"}', NOW() - INTERVAL '2 days'),
('d0000009-0000-0000-0000-000000000009', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '44444444-4444-4444-4444-444444444444', 'commented', 'task', 'e0010014-0000-0000-0000-000000000014', '{"commentId": "f0000006-0000-0000-0000-000000000006"}', NOW() - INTERVAL '3 hours'),
('d0000010-0000-0000-0000-000000000010', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'created', 'column', 'c0100008-0000-0000-0000-000000000008', '{"title": "Testing"}', NOW() - INTERVAL '20 days'),
-- Website Redesign activities
('d0000011-0000-0000-0000-000000000011', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'created', 'board', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '{"title": "Website Redesign"}', NOW() - INTERVAL '15 days'),
('d0000012-0000-0000-0000-000000000012', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'created', 'task', 'e0010021-0000-0000-0000-000000000021', '{"title": "Design homepage mockup"}', NOW() - INTERVAL '1 day'),
('d0000013-0000-0000-0000-000000000013', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'moved', 'task', 'e0010023-0000-0000-0000-000000000023', '{"from": "In Progress", "to": "Done"}', NOW() - INTERVAL '13 days'),
('d0000014-0000-0000-0000-000000000014', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'commented', 'task', 'e0010021-0000-0000-0000-000000000021', '{"commentId": "f0000007-0000-0000-0000-000000000007"}', NOW() - INTERVAL '2 hours'),
('d0000015-0000-0000-0000-000000000015', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '44444444-4444-4444-4444-444444444444', 'updated', 'task', 'e0010021-0000-0000-0000-000000000021', '{"field": "description", "updated": true}', NOW() - INTERVAL '1 hour');
-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT 'Users created:' as info, COUNT() as count FROM users;
SELECT 'Boards created:' as info, COUNT() as count FROM boards;
SELECT 'Board members:' as info, COUNT() as count FROM board_members;
SELECT 'Columns created:' as info, COUNT() as count FROM columns;
SELECT 'Tasks created:' as info, COUNT() as count FROM tasks;
SELECT 'Comments created:' as info, COUNT() as count FROM comments;
SELECT 'Activities logged:' as info, COUNT(*) as count FROM activities;
-- Show board summary
SELECT
b.title as board,
COUNT(DISTINCT c.id) as columns,
COUNT(DISTINCT t.id) as tasks,
COUNT(DISTINCT cm.id) as comments
FROM boards b
LEFT JOIN columns c ON c.board_id = b.id
LEFT JOIN tasks t ON t.column_id = c.id
LEFT JOIN comments cm ON cm.task_id = t.id
GROUP BY b.id, b.title;


-- ============================================
-- 8. Create Sample Notifications
-- ============================================

INSERT INTO notifications (id, user_id, type, title, message, entity_type, entity_id, is_read, created_at) VALUES
-- Notifications for John
(
  'n0000001-0000-0000-0000-000000000001',
  '11111111-1111-1111-1111-111111111111',
  'task_assigned',
  'Task assigned to you',
  'You were assigned to "Review Q4 campaign performance"',
  'task',
  'e0010008-0000-0000-0000-000000000008',
  false,
  NOW() - INTERVAL '30 minutes'
),

-- Notifications for Jane
(
  'n0000002-0000-0000-0000-000000000002',
  '22222222-2222-2222-2222-222222222222',
  'task_assigned',
  'New task assigned',
  'John Doe assigned you to "Schedule influencer partnerships"',
  'task',
  'e0010006-0000-0000-0000-000000000006',
  false,
  NOW() - INTERVAL '4 days'
),
(
  'n0000003-0000-0000-0000-000000000003',
  '22222222-2222-2222-2222-222222222222',
  'comment_added',
  'New comment on your task',
  'John Doe commented on "Update landing page copy"',
  'task',
  'e0010007-0000-0000-0000-000000000007',
  true,
  NOW() - INTERVAL '6 hours'
),

-- Notifications for Bob
(
  'n0000004-0000-0000-0000-000000000004',
  '33333333-3333-3333-3333-333333333333',
  'task_assigned',
  'Task assigned to you',
  'You were assigned to "Implement user authentication"',
  'task',
  'e0010011-0000-0000-0000-000000000011',
  false,
  NOW() - INTERVAL '5 days'
),

-- Notifications for Alice
(
  'n0000005-0000-0000-0000-000000000005',
  '44444444-4444-4444-4444-444444444444',
  'task_assigned',
  'New task assigned',
  'Jane Smith assigned you to "Create wireframes"',
  'task',
  'e0010019-0000-0000-0000-000000000019',
  false,
  NOW() - INTERVAL '3 days'
),
(
  'n0000006-0000-0000-0000-000000000006',
  '44444444-4444-4444-4444-444444444444',
  'comment_added',
  'New comment',
  'Jane Smith commented on "Design homepage mockup"',
  'task',
  'e0010021-0000-0000-0000-000000000021',
  false,
  NOW() - INTERVAL '2 hours'
);

-- ============================================
-- UPDATED VERIFICATION QUERIES
-- ============================================
SELECT 'Notifications created:' as info, COUNT(*) as count FROM notifications;

-- Show notifications summary
SELECT
  u.full_name as user,
  COUNT(*) as total_notifications,
  SUM(CASE WHEN is_read = false THEN 1 ELSE 0 END) as unread
FROM notifications n
JOIN users u ON u.id = n.user_id
GROUP BY u.id, u.full_name;