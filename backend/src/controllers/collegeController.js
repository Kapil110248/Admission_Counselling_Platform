const prisma = require('../prisma');

exports.getColleges = async (req, res) => {
  try { res.json(await prisma.college.findMany({ include: { cutoffs: true } })); } catch (error) { res.status(500).json({ error: 'Server error setups thresholds configurations.' }); }
};

exports.createCollege = async (req, res) => {
  try {
    const { name, location, nirfRank, fees, avgPackage, website } = req.body;
    const college = await prisma.college.create({ data: { name, location, nirfRank, fees, avgPackage, website } });
    res.status(201).json(college);
  } catch (error) { res.status(400).json({ error: 'Create failed setups accurate layouts support configs trigger.' }); }
};

exports.updateCollege = async (req, res) => {
  try {
    const { name, location, nirfRank, fees, avgPackage, website } = req.body;
    const college = await prisma.college.update({ where: { id: parseInt(req.params.id) }, data: { name, location, nirfRank, fees, avgPackage, website } });
    res.json(college);
  } catch (error) { res.status(400).json({ error: 'Update failed setups thresholds datasets configs dashboards.' }); }
};

exports.deleteCollege = async (req, res) => {
  try {
    await prisma.college.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'College deleted setups threshold framed data layouts.' });
  } catch (error) { res.status(400).json({ error: 'Delete failed triggering dashboards config layouts.' }); }
};

// Predictor endpoint logic datasets match thresholds triggers
exports.predictColleges = async (req, res) => {
  try {
    const { examId, rank, category } = req.body;
    const predictions = await prisma.cutoff.findMany({
      where: {
        examId: parseInt(examId),
        category: category || 'General',
        closingRank: { gte: parseInt(rank) } // Closing rank is greater than or equal to user's rank
      },
      include: { college: true }
    });
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Predicting failed setups thresholds mapping config.' });
  }
};

exports.getCutoffs = async (req, res) => {
  try {
    const cutoffs = await prisma.cutoff.findMany({ include: { college: true, exam: true } });
    res.json(cutoffs);
  } catch (error) {
    res.status(500).json({ error: 'Failed fetching cutoffs setups thresholds configurations.' });
  }
};

exports.createCutoff = async (req, res) => {
  try {
    const { collegeId, examId, branch, category, closingRank, round, quota, year } = req.body;
    const cutoff = await prisma.cutoff.create({
      data: {
        collegeId: parseInt(collegeId),
        examId: parseInt(examId),
        branch,
        category,
        closingRank: parseInt(closingRank),
        round: round ? parseInt(round) : 1,
        quota: quota || 'All India',
        year: year ? parseInt(year) : 2025
      }
    });
    res.status(201).json(cutoff);
  } catch (error) {
    res.status(400).json({ error: 'Create failed setups accurate datasets with layout overlays.' });
  }
};

exports.updateCutoff = async (req, res) => {
  try {
    const { collegeId, examId, branch, category, closingRank, round, quota, year } = req.body;
    const cutoff = await prisma.cutoff.update({
      where: { id: parseInt(req.params.id) },
      data: {
        collegeId: parseInt(collegeId),
        examId: parseInt(examId),
        branch,
        category,
        closingRank: parseInt(closingRank),
        round: round ? parseInt(round) : 1,
        quota: quota || 'All India',
        year: year ? parseInt(year) : 2025
      }
    });
    res.json(cutoff);
  } catch (error) {
    res.status(400).json({ error: 'Update failed setups thresholds triggering configurations.' });
  }
};

exports.deleteCutoff = async (req, res) => {
  try {
    await prisma.cutoff.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Cutoff deleted setups threshold framed data layouts.' });
  } catch (error) {
    res.status(400).json({ error: 'Delete failed triggering dashboards config layouts.' });
  }
};
