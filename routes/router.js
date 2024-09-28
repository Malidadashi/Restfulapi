const express = require('express');
const router = express.Router();
const fs = require('fs');
const { Module } = require('module');
const path = require('path');

// Load articles data
const loadArticles = () => {
  const dataPath = path.join(__dirname,'../data/article.json');
  const jsonData = fs.readFileSync(dataPath);
  return JSON.parse(jsonData);
};

// Get all articles with optional filters
router.get('/', (req, res) => {
  let articles = loadArticles();
  const { tag, date } = req.query;

  if (tag) {
    articles = articles.filter(article => article.tags.includes(tag));
  }

  if (date) {
    articles = articles.filter(article => article.publishedDate === date);
  }

  res.json(articles);
});

// Get a single article by ID
router.get('/:id', (req, res) => {
  const articles = loadArticles();
  const article = articles.find(a => a.id === parseInt(req.params.id));

  if (!article) {
    return res.status(404).send('Article not found.');
  }

  res.json(article);
});

// Create a new article
router.post('/', (req, res) => {
  const articles = loadArticles();
  const newArticle = {
    id: articles.length + 1,
    ...req.body
  };

  articles.push(newArticle);
  fs.writeFileSync(path.join(__dirname, '../data/articles.json'), JSON.stringify(articles, null, 2));
  res.status(201).json(newArticle);
});

// Update an article by ID
router.put('/:id', (req, res) => {
  const articles = loadArticles();
  const articleIndex = articles.findIndex(a => a.id === parseInt(req.params.id));

  if (articleIndex === -1) {
    return res.status(404).send('Article not found.');
  }

  articles[articleIndex] = {
    id: parseInt(req.params.id),
    ...req.body
  };

  fs.writeFileSync(path.join(__dirname, '../data/articles.json'), JSON.stringify(articles, null, 2));
  res.json(articles[articleIndex]);
});

// Delete an article by ID
router.delete('/:id', (req, res) => {
  const articles = loadArticles();
  const articleIndex = articles.findIndex(a => a.id === parseInt(req.params.id));

  if (articleIndex === -1) {
    return res.status(404).send('Article not found.');
  }

  articles.splice(articleIndex, 1);
  fs.writeFileSync(path.join(__dirname, '../data/articles.json'), JSON.stringify(articles, null, 2));
  res.status(204).send();
});

module.exports=router
