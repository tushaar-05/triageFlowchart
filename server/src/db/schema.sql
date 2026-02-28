-- ============================================================
--  TriageFlow AI — MySQL Schema
--  Run:  npm run db:init   (executes initDb.ts which runs this)
-- ============================================================

CREATE DATABASE IF NOT EXISTS triageflow
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE triageflow;

-- ─── 1. STAFF ────────────────────────────────────────────────────────────────
-- Healthcare workers and admins who log in to the system
CREATE TABLE IF NOT EXISTS staff (
  id          INT           NOT NULL AUTO_INCREMENT,
  staff_id    VARCHAR(50)   NOT NULL UNIQUE,          -- e.g. TF-00142
  name        VARCHAR(100)  NOT NULL,
  role        ENUM('nurse', 'paramedic', 'community_worker', 'admin') NOT NULL DEFAULT 'nurse',
  password_hash VARCHAR(255) NOT NULL,
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ─── 2. PATIENTS ─────────────────────────────────────────────────────────────
-- Registered patients — lightweight record; vitals captured per case
CREATE TABLE IF NOT EXISTS patients (
  id          INT           NOT NULL AUTO_INCREMENT,
  name        VARCHAR(100)  NOT NULL,
  age         TINYINT UNSIGNED NOT NULL,
  gender      ENUM('male', 'female', 'other') NOT NULL,
  weight_kg   DECIMAL(5,2)  DEFAULT NULL,
  contact     VARCHAR(20)   DEFAULT NULL,              -- optional phone
  created_at  TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB;

-- ─── 3. PROTOCOLS ────────────────────────────────────────────────────────────
-- Each protocol is a triage decision-tree authored in Builder Mode.
-- start_node_id references nodes.node_key (see below).
-- thresholds JSON format: {"LOW": [0,30], "MODERATE": [31,60], "HIGH": [61,999]}
CREATE TABLE IF NOT EXISTS protocols (
  id            INT           NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)  NOT NULL,
  description   TEXT          DEFAULT NULL,
  category      VARCHAR(100)  NOT NULL,               -- AI classification maps to this
  start_node_key VARCHAR(100) NOT NULL,               -- first node to enter
  thresholds    JSON          NOT NULL,
  is_active     BOOLEAN       NOT NULL DEFAULT TRUE,
  created_by    INT           DEFAULT NULL,           -- FK → staff.id
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (created_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── 4. NODES ────────────────────────────────────────────────────────────────
-- Individual decision points within a protocol.
-- options JSON format (for yes_no or mcq):
--   [{"label":"Yes","risk_weight":10,"next_node_key":"node_2"}, ...]
-- For numeric nodes the branching is handled server-side using range rules stored in options.
CREATE TABLE IF NOT EXISTS nodes (
  id            INT           NOT NULL AUTO_INCREMENT,
  protocol_id   INT           NOT NULL,
  node_key      VARCHAR(100)  NOT NULL,               -- human-readable key, unique per protocol
  question      TEXT          NOT NULL,
  input_type    ENUM('yes_no','mcq','numeric') NOT NULL,
  options       JSON          NOT NULL,               -- answer options with weights + next keys
  is_terminal   BOOLEAN       NOT NULL DEFAULT FALSE, -- TRUE = this node ends the flow
  is_ai_assist  BOOLEAN       NOT NULL DEFAULT FALSE, -- AI selects best follow-up from remaining nodes
  node_order    SMALLINT      NOT NULL DEFAULT 0,     -- for Builder UI ordering
  PRIMARY KEY (id),
  UNIQUE KEY uq_protocol_node (protocol_id, node_key),
  FOREIGN KEY (protocol_id) REFERENCES protocols(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── 5. CASES ────────────────────────────────────────────────────────────────
-- One record per triage session
CREATE TABLE IF NOT EXISTS cases (
  id                INT           NOT NULL AUTO_INCREMENT,
  patient_id        INT           NOT NULL,
  protocol_id       INT           NOT NULL,
  attended_by       INT           DEFAULT NULL,       -- staff.id of nurse
  chief_complaint   TEXT          NOT NULL,
  ai_classification VARCHAR(100)  DEFAULT NULL,       -- what AI mapped the complaint to
  total_risk_score  SMALLINT      NOT NULL DEFAULT 0,
  risk_level        ENUM('LOW','MODERATE','HIGH') NOT NULL,
  recommendation    TEXT          DEFAULT NULL,
  status            ENUM('in_progress','completed','referred') NOT NULL DEFAULT 'completed',
  -- Vitals captured at time of case (denormalized for audit trail)
  bp_systolic       SMALLINT      DEFAULT NULL,
  bp_diastolic      SMALLINT      DEFAULT NULL,
  heart_rate        SMALLINT      DEFAULT NULL,
  temperature_c     DECIMAL(4,1)  DEFAULT NULL,
  spo2_pct          TINYINT       DEFAULT NULL,
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (patient_id)  REFERENCES patients(id),
  FOREIGN KEY (protocol_id) REFERENCES protocols(id),
  FOREIGN KEY (attended_by) REFERENCES staff(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ─── 6. CASE ANSWERS ─────────────────────────────────────────────────────────
-- Full audit trail — every node answer during a triage session
CREATE TABLE IF NOT EXISTS case_answers (
  id                  INT           NOT NULL AUTO_INCREMENT,
  case_id             INT           NOT NULL,
  node_key            VARCHAR(100)  NOT NULL,
  question_snapshot   TEXT          NOT NULL,         -- question text at time of answer
  answer_given        TEXT          NOT NULL,
  risk_weight_applied SMALLINT      NOT NULL DEFAULT 0,
  answered_at         TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ─── SEED: Default admin account ─────────────────────────────────────────────
-- Password: Admin@1234  (bcrypt hash — change immediately in production)
INSERT IGNORE INTO staff (staff_id, name, role, password_hash)
VALUES (
  'TF-ADMIN',
  'System Administrator',
  'admin',
  '$2b$10$Kix5K1.1IpE5eRGJL2g5IeRBM7OzV6NAv5.FzOrk8jK8SXKF3oJAm'
);
