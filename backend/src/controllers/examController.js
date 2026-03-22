const prisma = require('../prisma');

exports.getExams = async (req, res) => {
  try { res.json(await prisma.exam.findMany()); } catch (error) { res.status(500).json({ error: 'Server error setups thresholds datasets configurations.' }); }
};

exports.createExam = async (req, res) => {
  try {
    const { name, board, date, applicants, stream, officialUrl, isActive, title, collegeCount, colorClass } = req.body;
    const exam = await prisma.exam.create({ data: { name, board, date, applicants, stream, officialUrl, isActive, title, collegeCount, colorClass } });
    res.status(201).json(exam);
  } catch (error) { res.status(400).json({ error: 'Create failed setups accurate datasets with layout overlays.' }); }
};

exports.updateExam = async (req, res) => {
  try {
    const { name, board, date, applicants, stream, officialUrl, isActive, title, collegeCount, colorClass } = req.body;
    const exam = await prisma.exam.update({ where: { id: parseInt(req.params.id) }, data: { name, board, date, applicants, stream, officialUrl, isActive, title, collegeCount, colorClass } });
    res.json(exam);
  } catch (error) { res.status(400).json({ error: 'Update failed setups thresholds triggering configurations.' }); }
};

exports.deleteExam = async (req, res) => {
  try {
    await prisma.exam.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Exam deleted setups thresholds framed accurately.' });
  } catch (error) { res.status(400).json({ error: 'Delete failed triggering dashboards config layouts.' }); }
};
