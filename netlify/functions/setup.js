const { createClient } = require('@supabase/supabase-js');
const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret' };

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST' || event.headers['x-admin-secret'] !== process.env.ADMIN_SECRET) {
    return { statusCode: 403, body: 'Forbidden' };
  }
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
  const demoProducts = [
    { name: "L'ABSOLU", arabic: "الأمثل", badge: "Protecteur Universel", price: 890, img: "https://i.ibb.co/DHm1MLjY/2.png", img_before: "https://i.ibb.co/Cp9Khsqy/1-plante-saine-1.jpg", img_after: "https://i.ibb.co/5h8Tmhsc/1-plante-malade-1.jpg", description: "Concentré Neem universel 25ml", util: "Insecticide bio à base d'extrait de Neem. Élimine pucerons, cochenilles, mouches blanches, fourmis, araignées. Action prolongée 21 jours.", dose: "5ml par litre d'eau. Agiter avant usage. Maximum 2 applications par mois.", inst: "Vaporiser sur toutes les faces du feuillage en fin de journée, hors soleil direct." },
    { name: "ÉCLAT", arabic: "نقاء", badge: "Sérum Purificateur", price: 750, img: "https://images.unsplash.com/photo-1608688463959-1e3df6a15291?q=80&w=600", img_before: "https://i.ibb.co/fGNRMT62/2-plante-saine-2.jpg", img_after: "https://i.ibb.co/yBWR1Qxz/2-plante-malade-2.jpg", description: "Fongicide purificateur · Oïdium, rouille & taches. 25ml.", util: "Fongicide préventif et curatif. Éradique oïdium, rouille, pourriture grise et taches foliaires.", dose: "2,5ml par litre d'eau froide.", inst: "Pulvériser dessus et dessous des feuilles uniformément. Renouveler après 7 à 10 jours." },
    { name: "GENÈSE", arabic: "الأصل", badge: "Élixir de Croissance", price: 650, img: "https://images.unsplash.com/photo-1597055181300-e3623ddfac0b?q=80&w=600", img_before: "https://i.ibb.co/rf35FHcy/3-plante-saine-3.png", img_after: "https://i.ibb.co/5W9cf9Vp/3-plante-malade-3.png", description: "Engrais NPK équilibré · Croissance & feuillage. 100g.", util: "Formule NPK complète enrichie en oligo-éléments.", dose: "5g par litre d'eau d'arrosage.", inst: "Dissoudre entièrement avant usage. Arroser au pied toutes les deux semaines." },
    { name: "BOUCLIER", arabic: "الدرع", badge: "Défense Microscopique", price: 820, img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600", img_before: "https://i.ibb.co/Qv3T96wy/4-plante-saine-4.jpg", img_after: "https://i.ibb.co/MkGtyWYP/4-plante-malade-4.jpg", description: "Acaricide de précision · Araignées rouges. 30ml.", util: "Formulé contre les acariens tétranyques (araignées rouges). Action de choc immédiat.", dose: "2ml par litre d'eau.", inst: "Traiter par temps couvert, insister sur le dessous des feuilles." }
  ];
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
  if (count === 0) {
    const { error } = await supabase.from('products').insert(demoProducts);
    if (error) return { statusCode: 500, body: JSON.stringify({ error }) };
  }
  return { statusCode: 200, headers, body: JSON.stringify({ message: 'Données initiales insérées' }) };
};