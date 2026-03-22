const prisma = require('../prisma');

exports.getPackages = async (req, res) => {
  try {
    const packages = await prisma.package.findMany();
    res.json(packages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch packages.' });
  }
};

exports.createPackage = async (req, res) => {
  try {
    const { name, price, benefits, actionText, isFeatured } = req.body;
    const pkg = await prisma.package.create({ data: { name, price, benefits, actionText, isFeatured: Boolean(isFeatured) } });
    res.status(201).json(pkg);
  } catch (error) { res.status(400).json({ error: 'Create failed.' }); }
};

exports.updatePackage = async (req, res) => {
  try {
    const { name, price, benefits, actionText, isFeatured } = req.body;
    const pkg = await prisma.package.update({
      where: { id: parseInt(req.params.id) },
      data: { name, price, benefits, actionText, isFeatured: Boolean(isFeatured) }
    });
    res.json(pkg);
  } catch (error) { res.status(400).json({ error: 'Update failed.' }); }
};

exports.deletePackage = async (req, res) => {
  try {
    await prisma.package.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Package deleted.' });
  } catch (error) { res.status(400).json({ error: 'Delete failed.' }); }
};
