const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { cards: true } } },
    });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

  try {
    const group = await prisma.group.create({
      data: { name: name.trim() },
      include: { _count: { select: { cards: true } } },
    });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required' });

  try {
    const group = await prisma.group.update({
      where: { id },
      data: { name: name.trim() },
      include: { _count: { select: { cards: true } } },
    });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.group.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
