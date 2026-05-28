import db from "../config/db.js";
import ExpressError from "../ExpressError.js";

export const getDashboard = async (req, res, next) => {
  try {
    const posted_by = req.user.id;

    /* ── Stats ── */
    const [[{ total_jobs }]] = await db.execute(
      `SELECT COUNT(*) AS total_jobs FROM jobs WHERE posted_by = ?`,
      [posted_by]
    );

    const [[{ total_applicants }]] = await db.execute(
      `SELECT COUNT(*) AS total_applicants
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       WHERE j.posted_by = ?`,
      [posted_by]
    );

    const [[{ shortlisted }]] = await db.execute(
      `SELECT COUNT(*) AS shortlisted
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       WHERE j.posted_by = ? AND a.status = 'shortlisted'`,
      [posted_by]
    );

    const [[{ rejected }]] = await db.execute(
      `SELECT COUNT(*) AS rejected
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       WHERE j.posted_by = ? AND a.status = 'rejected'`,
      [posted_by]
    );

    /* ── Recent Jobs (latest 5) ── */
    const [recent_jobs] = await db.execute(
      `SELECT job_id, job_name, company, job_type, created_at
       FROM jobs
       WHERE posted_by = ?
       ORDER BY created_at DESC
       LIMIT 5`,
      [posted_by]
    );

    /* ── Recent Applicants (latest 5) ── */
    const [recent_applicants] = await db.execute(
      `SELECT
          a.app_id,
          a.name,
          a.status,
          a.applied_at,
          j.job_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       WHERE j.posted_by = ?
       ORDER BY a.applied_at DESC
       LIMIT 5`,
      [posted_by]
    );

    res.status(200).json({
      success: true,
      stats: {
        total_jobs,
        total_applicants,
        shortlisted,
        rejected,
      },
      recent_jobs,
      recent_applicants,
    });

  } catch (err) {
    console.log("Dashboard Error:", err);
    next(new expressError("Failed to load dashboard", 500));
  }
};