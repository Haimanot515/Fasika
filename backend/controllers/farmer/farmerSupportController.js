// controllers/farmer/farmerSupportController.js
const pool = require('../../config/dbConfig');
const { v4: uuidv4 } = require('uuid');

// =======================
// FAQs
// =======================
exports.getFAQs = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faqs ORDER BY created_at DESC');
    res.json({ success: true, faqs: result.rows });
  } catch (err) {
    console.error('getFAQs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getFAQById = async (req, res) => {
  try {
    const { faqId } = req.params;
    const result = await pool.query('SELECT * FROM faqs WHERE faq_id=$1', [faqId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'FAQ not found' });
    res.json({ success: true, faq: result.rows[0] });
  } catch (err) {
    console.error('getFAQById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =======================
// Extension Officers
// =======================
exports.getExtensionServices = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM extension_officers ORDER BY name');
    res.json({ success: true, services: result.rows });
  } catch (err) {
    console.error('getExtensionServices error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getExtensionOfficerById = async (req, res) => {
  try {
    const { officerId } = req.params;
    const result = await pool.query('SELECT * FROM extension_officers WHERE officer_id=$1', [officerId]);
    if (!result.rowCount) return res.status(404).json({ success: false, message: 'Officer not found' });
    res.json({ success: true, officer: result.rows[0] });
  } catch (err) {
    console.error('getExtensionOfficerById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Contact a single extension officer
exports.contactExtensionOfficer = async (req, res) => {
  try {
    const { officer_id, message } = req.body;
    const { farmer_id } = req.user;
    const msgId = uuidv4();

    await pool.query(
      'INSERT INTO messages (message_id, sender_id, recipient_id, content) VALUES ($1,$2,$3,$4)',
      [msgId, farmer_id, officer_id, message]
    );

    res.json({ success: true, message: 'Message sent' });
  } catch (err) {
    console.error('contactExtensionOfficer error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Contact multiple extension officers at once
exports.contactMultipleExtensionOfficers = async (req, res) => {
  try {
    const { officer_ids, message } = req.body; // array of officer_ids
    const { farmer_id } = req.user;

    const queries = officer_ids.map(officer_id => {
      const msgId = uuidv4();
      return pool.query(
        'INSERT INTO messages (message_id, sender_id, recipient_id, content) VALUES ($1,$2,$3,$4)',
        [msgId, farmer_id, officer_id, message]
      );
    });

    await Promise.all(queries);

    res.json({ success: true, message: 'Messages sent to all officers' });
  } catch (err) {
    console.error('contactMultipleExtensionOfficers error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =======================
// Government Programs
// =======================
exports.getGovPrograms = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM gov_programs ORDER BY created_at DESC');
    res.json({ success: true, programs: result.rows });
  } catch (err) {
    console.error('getGovPrograms error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// =======================
// Forum Posts
// =======================
exports.addForumPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const { farmer_id } = req.user;
    const postId = uuidv4();

    await pool.query(
      'INSERT INTO forum_posts (post_id, farmer_id, title, content) VALUES ($1,$2,$3,$4)',
      [postId, farmer_id, title, content]
    );

    res.json({ success: true, message: 'Post created', postId });
  } catch (err) {
    console.error('addForumPost error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.replyForumPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const { farmer_id } = req.user;
    const replyId = uuidv4();

    await pool.query(
      'INSERT INTO forum_replies (reply_id, post_id, farmer_id, content) VALUES ($1,$2,$3,$4)',
      [replyId, postId, farmer_id, content]
    );

    res.json({ success: true, message: 'Reply added', replyId });
  } catch (err) {
    console.error('replyForumPost error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getForumPosts = async (req, res) => {
  try {
    const posts = await pool.query('SELECT * FROM forum_posts ORDER BY created_at DESC');
    res.json({ success: true, posts: posts.rows });
  } catch (err) {
    console.error('getForumPosts error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getForumPostById = async (req, res) => {
  try {
    const { postId } = req.params;
    const postQuery = await pool.query('SELECT * FROM forum_posts WHERE post_id=$1', [postId]);
    if (!postQuery.rowCount) return res.status(404).json({ success: false, message: 'Post not found' });

    const repliesQuery = await pool.query(
      'SELECT * FROM forum_replies WHERE post_id=$1 ORDER BY created_at ASC',
      [postId]
    );

    res.json({ success: true, post: postQuery.rows[0], replies: repliesQuery.rows });
  } catch (err) {
    console.error('getForumPostById error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteForumPost = async (req, res) => {
  try {
    const { postId } = req.params;
    await pool.query('DELETE FROM forum_posts WHERE post_id=$1', [postId]);
    res.json({ success: true, message: 'Forum post deleted' });
  } catch (err) {
    console.error('deleteForumPost error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteForumReply = async (req, res) => {
  try {
    const { replyId } = req.params;
    await pool.query('DELETE FROM forum_replies WHERE reply_id=$1', [replyId]);
    res.json({ success: true, message: 'Forum reply deleted' });
  } catch (err) {
    console.error('deleteForumReply error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
