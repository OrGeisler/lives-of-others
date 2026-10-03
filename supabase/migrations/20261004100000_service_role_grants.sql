-- "Automatically expose new tables" is off, so service_role (used by server-side code such as the
-- Grow webhook) gets no table privileges by default. Grant them explicitly, now and for future tables.
grant usage on schema public to service_role;
grant all on all tables in schema public to service_role;
grant all on all sequences in schema public to service_role;
grant execute on all functions in schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on sequences to service_role;
alter default privileges in schema public grant execute on functions to service_role;
