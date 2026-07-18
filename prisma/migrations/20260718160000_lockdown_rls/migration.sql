-- Lock down VMKTA Prisma tables from Supabase Data API (anon / authenticated).
-- Prisma connects as the DB owner and still works (owner bypasses RLS unless FORCE is set).

DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'User',
    'Coach',
    'Lead',
    'LeadNote',
    'FollowUp',
    'TrialAppointment',
    'Student',
    'Guardian',
    'ProgressNote',
    'StudentDocument',
    'Program',
    'Batch',
    'Enrollment',
    'AttendanceRecord',
    'FeePlan',
    'Payment',
    'Testimonial',
    'GalleryItem',
    'Faq',
    'SiteSetting'
  ];
BEGIN
  FOREACH t IN ARRAY tables
  LOOP
    IF to_regclass(format('public.%I', t)) IS NOT NULL THEN
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM PUBLIC', t);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon', t);
      EXECUTE format('REVOKE ALL ON TABLE public.%I FROM authenticated', t);
      -- No policies for anon/authenticated = no Data API access
    END IF;
  END LOOP;
END $$;
