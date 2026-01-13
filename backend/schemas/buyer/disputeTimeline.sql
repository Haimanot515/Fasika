CREATE TABLE dispute_timelines (
  dispute_timeline_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  dispute_id UUID NOT NULL
    REFERENCES disputes(dispute_id)
    ON DELETE CASCADE,

  status VARCHAR(30) NOT NULL,

  note TEXT,                -- Optional admin/buyer comment
  changed_by UUID,          -- user_id or admin_id
  changed_by_role VARCHAR(20), -- BUYER | ADMIN | SYSTEM

  created_at TIMESTAMP DEFAULT NOW()
);
