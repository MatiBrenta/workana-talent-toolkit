export default async function handler(req, res) {
  const { shortcode } = req.query;

  if (!shortcode || !/^[A-Z0-9]+$/i.test(shortcode)) {
    return res.status(400).json({ error: 'shortcode requerido' });
  }

  const apiKey = process.env.WORKABLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'WORKABLE_API_KEY no configurada en variables de entorno' });
  }

  const subdomain = req.query.subdomain;
  if (!subdomain || !/^[a-z0-9-]+$/i.test(subdomain)) {
    return res.status(400).json({ error: 'subdomain requerido (se extrae del link de Workable)' });
  }

  try {
    const response = await fetch(
      `https://${subdomain}.workable.com/spi/v3/jobs/${shortcode.toUpperCase()}`,
      { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' } }
    );

    if (!response.ok) {
      return res.status(response.status).json({ error: `Workable respondió ${response.status}` });
    }

    const data = await response.json();

    res.status(200).json({
      title: data.title,
      department: data.department,
      shortcode: data.shortcode,
      shortlink: data.shortlink,
      workplace_type: data.workplace_type,
      location: data.location,
      description: data.description,
      requirements: data.requirements,
      benefits: data.benefits,
      employment_type: data.employment_type,
      industry: data.industry,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
