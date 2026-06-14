-- KMC Support Dashboard - Required Supabase RPC Functions
-- Run this script in your Supabase SQL Editor.

-- 1. Get ticket count grouped by status
CREATE OR REPLACE FUNCTION get_ticket_count_by_status()
RETURNS TABLE(status text, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT t.status::text, COUNT(t.id) as count
  FROM support_tickets t
  GROUP BY t.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. Get ticket count grouped by category
CREATE OR REPLACE FUNCTION get_ticket_count_by_category()
RETURNS TABLE(category text, count bigint) AS $$
BEGIN
  RETURN QUERY
  SELECT t.category::text, COUNT(t.id) as count
  FROM support_tickets t
  GROUP BY t.category;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. Get ticket volume by day (Last X days)
CREATE OR REPLACE FUNCTION get_ticket_volume_by_day(days_limit int DEFAULT 7)
RETURNS TABLE(day text, open bigint, "inProgress" bigint, resolved bigint) AS $$
BEGIN
  RETURN QUERY
  WITH date_series AS (
    SELECT generate_series(
      CURRENT_DATE - (days_limit - 1) * interval '1 day',
      CURRENT_DATE,
      '1 day'::interval
    )::date AS date_val
  ),
  ticket_counts AS (
    SELECT 
      DATE(created_at) as date_val,
      COUNT(CASE WHEN status = 'open' THEN 1 END) as open_count,
      COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_count,
      COUNT(CASE WHEN status = 'resolved' THEN 1 END) as resolved_count
    FROM support_tickets
    WHERE created_at >= (CURRENT_DATE - (days_limit - 1) * interval '1 day')
    GROUP BY DATE(created_at)
  )
  SELECT 
    to_char(ds.date_val, 'Dy') as day,
    COALESCE(tc.open_count, 0) as open,
    COALESCE(tc.in_progress_count, 0) as "inProgress",
    COALESCE(tc.resolved_count, 0) as resolved
  FROM date_series ds
  LEFT JOIN ticket_counts tc ON ds.date_val = tc.date_val
  ORDER BY ds.date_val ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 4. Increment template usage counter
CREATE OR REPLACE FUNCTION increment_template_usage(template_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE reply_templates
  SET usage_count = usage_count + 1, updated_at = NOW()
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 5. Get average response time across agents (Last X days)
CREATE OR REPLACE FUNCTION get_avg_response_mins(days_limit int DEFAULT 7)
RETURNS numeric AS $$
DECLARE
  result numeric;
BEGIN
  SELECT COALESCE(AVG(avg_response_mins), 0)
  INTO result
  FROM agent_performance
  WHERE date >= (CURRENT_DATE - days_limit * interval '1 day');
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 6. Get average CSAT score across agents (Last X days)
CREATE OR REPLACE FUNCTION get_avg_csat(days_limit int DEFAULT 30)
RETURNS numeric AS $$
DECLARE
  result numeric;
BEGIN
  SELECT 
    CASE 
      WHEN SUM(csat_count) > 0 THEN ROUND(SUM(csat_avg * csat_count) / SUM(csat_count), 1)
      ELSE 0 
    END
  INTO result
  FROM agent_performance
  WHERE date >= (CURRENT_DATE - days_limit * interval '1 day') AND csat_count > 0;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
