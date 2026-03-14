DO $$
DECLARE
  new_user_id uuid := '11111111-1111-1111-1111-111111111111'::uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = new_user_id) THEN
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id, '00000000-0000-0000-0000-000000000000', 'student@example.com',
      crypt('password123', gen_salt('bf')), NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}', '{"full_name": "Estudante Demo"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );
    
    INSERT INTO public.tasks (user_id, title, description, status, priority, due_date)
    VALUES 
      (new_user_id, 'Revisar Biologia', 'Capítulo 4: Genética e DNA', 'pending', 'high', NOW() + INTERVAL '1 day'),
      (new_user_id, 'Fazer simulado de Matemática', 'Provas antigas do ENEM 2023', 'in_progress', 'high', NOW() + INTERVAL '2 days'),
      (new_user_id, 'Ler Redação nota 1000', 'Analisar estrutura', 'completed', 'medium', NOW() - INTERVAL '1 day');
  END IF;
END $$;
