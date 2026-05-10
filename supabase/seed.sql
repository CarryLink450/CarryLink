insert into public.profiles (id, full_name, email, phone, current_country, home_country, user_type, avatar_initials, verified)
values
  ('00000000-0000-0000-0000-000000000101', 'Sara Haddad', 'sara.haddad@example.com', '+1 514 555 0124', 'Canada', 'Lebanon', 'Sender', 'SH', true),
  ('00000000-0000-0000-0000-000000000102', 'Karim Mansour', 'karim.mansour@example.com', '+1 438 555 0198', 'Canada', 'Lebanon', 'Traveler', 'KM', true),
  ('00000000-0000-0000-0000-000000000103', 'Nour El Khoury', 'nour.khoury@example.com', '+961 70 555 902', 'Lebanon', 'Canada', 'Both', 'NE', true),
  ('00000000-0000-0000-0000-000000000104', 'Amina Diop', 'amina.diop@example.com', '+33 6 55 55 22 10', 'France', 'Senegal', 'Both', 'AD', false),
  ('00000000-0000-0000-0000-000000000105', 'David Chen', 'david.chen@example.com', '+1 647 555 0117', 'Canada', 'Singapore', 'Traveler', 'DC', true)
on conflict (id) do nothing;

insert into public.trips (
  id, traveler_id, from_country, from_city, to_country, to_city, departure_date, arrival_date,
  available_space, max_item_weight_kg, accepted_item_types, items_not_accepted,
  expected_compensation, meeting_preferences, notes
)
values
  ('10000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000102', 'Canada', 'Montreal', 'Lebanon', 'Beirut', '2026-05-18', '2026-05-19', 'Small backpack pocket and 3 kg in checked luggage', 3, array['Documents', 'Gifts', 'Clothing', 'Small electronics'], array['Liquids', 'Medicine', 'Cash', 'Batteries'], '$35-70 CAD', 'Meet in downtown Montreal or at YUL before security.', 'Prefer unsealed items I can inspect with the sender.'),
  ('10000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000103', 'Lebanon', 'Beirut', 'Canada', 'Montreal', '2026-06-04', '2026-06-05', 'Half carry-on, around 5 kg', 5, array['Documents', 'Packaged sweets', 'Books', 'Clothing'], array['Tobacco', 'Alcohol', 'Prescription medicine', 'Fragile glass'], '$50 CAD or agreed equivalent', 'Pickup in Achrafieh or airport handoff.', 'Happy to coordinate with family on both sides.'),
  ('10000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000104', 'France', 'Paris', 'Senegal', 'Dakar', '2026-05-28', '2026-05-28', '2 kg in checked luggage', 2, array['Documents', 'Small gifts', 'Clothing'], array['Food', 'Liquids', 'Electronics with batteries'], 'EUR 25-45', 'Meet near Gare du Nord or CDG Terminal 2.', 'Items must be clearly labeled and customs-safe.'),
  ('10000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000105', 'Canada', 'Toronto', 'Singapore', 'Singapore', '2026-07-12', '2026-07-14', 'Document sleeve and 1 kg personal item space', 1, array['Documents', 'Light accessories'], array['Food', 'Medicine', 'Liquids', 'Power banks'], '$30 CAD', 'Meet in North York or YYZ departures.', 'Best for urgent papers or very small items.')
on conflict (id) do nothing;

insert into public.delivery_requests (
  id, sender_id, from_country, from_city, to_country, to_city, preferred_start_date, preferred_end_date,
  item_category, item_description, approximate_size, approximate_weight_kg, is_sealed,
  offered_compensation, pickup_flexibility, delivery_flexibility, legal_confirmation
)
values
  ('20000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000101', 'Canada', 'Montreal', 'Lebanon', 'Beirut', '2026-05-16', '2026-05-23', 'Documents', 'University transcript envelope and a small family photo album.', 'Envelope plus slim book', 0.7, false, '$55 CAD', 'Can meet evenings in Montreal or near YUL.', 'Family can pick up in Beirut within 48 hours.', true),
  ('20000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000103', 'Lebanon', 'Beirut', 'Canada', 'Montreal', '2026-06-01', '2026-06-08', 'Gift', 'A boxed handmade scarf and greeting card.', 'Shoe box', 0.9, false, '$40 CAD', 'Pickup from Hamra or Achrafieh.', 'Recipient can meet downtown Montreal.', true),
  ('20000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000104', 'France', 'Paris', 'Senegal', 'Dakar', '2026-05-25', '2026-06-02', 'Clothing', 'Two folded children''s outfits in a soft pouch.', 'Small packing cube', 1.2, false, 'EUR 30', 'Flexible within central Paris.', 'A relative can meet in Dakar Plateau.', true)
on conflict (id) do nothing;
