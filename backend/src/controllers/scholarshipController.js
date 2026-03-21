const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getScholarships = async (req, res) => {
  try {
    const scholarships = await prisma.scholarship.findMany();
    res.json(scholarships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch scholarships setups thresholds configurations.' });
  }
};

exports.createScholarship = async (req, res) => {
  try {
    const { name, description, amount, eligibility, officialUrl } = req.body;
    const scholarship = await prisma.scholarship.create({
      data: { name, description, amount, eligibility, officialUrl }
    });
    res.status(201).json(scholarship);
  } catch (error) {
    res.status(400).json({ error: 'Create failed setups accurate layouts support configs trigger.' });
  }
};

exports.updateScholarship = async (req, res) => {
  try {
    const { name, description, amount, eligibility, officialUrl } = req.body;
    const scholarship = await prisma.scholarship.update({
      where: { id: parseInt(req.params.id) },
      data: { name, description, amount, eligibility, officialUrl }
    });
    res.json(scholarship);
  } catch (error) {
    res.status(400).json({ error: 'Update failed setups thresholds datasets configs dashboards.' });
  }
};

exports.deleteScholarship = async (req, res) => {
  try {
    await prisma.scholarship.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Scholarship deleted successfully.' });
  } catch (error) {
    res.status(400).json({ error: 'Delete failed triggering dashboards config layouts.' });
  }
};
