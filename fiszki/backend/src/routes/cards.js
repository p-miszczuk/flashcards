const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const groupId = parseInt(req.query.groupId);
  if (!groupId) return res.status(400).json({ error: 'groupId is required' });

  try {
    const cards = await prisma.card.findMany({
      where: { groupId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { front, back, sentence, sentenceTranslation, groupId } = req.body;
  if (!front?.trim() || !back?.trim())
    return res.status(400).json({ error: 'Front and back are required' });
  if (!groupId) return res.status(400).json({ error: 'groupId is required' });

  try {
    const card = await prisma.card.create({
      data: {
        front: front.trim(),
        back: back.trim(),
        sentence: sentence?.trim() || null,
        sentenceTranslation: sentenceTranslation?.trim() || null,
        groupId: parseInt(groupId),
      },
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { front, back, sentence, sentenceTranslation, status } = req.body;

  const data = {};
  if (front !== undefined) data.front = front.trim();
  if (back !== undefined) data.back = back.trim();
  if (sentence !== undefined) data.sentence = sentence?.trim() || null;
  if (sentenceTranslation !== undefined)
    data.sentenceTranslation = sentenceTranslation?.trim() || null;
  if (status !== undefined) data.status = status;

  try {
    const card = await prisma.card.update({ where: { id }, data });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.card.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
