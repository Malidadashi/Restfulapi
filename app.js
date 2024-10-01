const express = require('express');
const fs = require("node:fs");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

// Function to read articles from JSON file
const getArticles = () => {
    const data = fs.readFileSync('./articles.json');
    return JSON.parse(data);
};

// Function to write articles to JSON file
const saveArticles = (articles) => {
    fs.writeFileSync('./articles.json', JSON.stringify(articles, null, 2));
};

// Route to get all articles, with optional filters
app.get('/articles', (req, res) => {
    let articles = getArticles()

    // Get filter params from query string
    const { tags, startDate, endDate } = req.query;

    // Filter by tags if provided
    if (tags) {
        const tagList = tags.split(','); // comma-separated tags
        articles = articles.filter(article =>
            tagList.every(tag => article.tags.includes(tag))
        );
    }

    // Filter by publishing date range if provided
    if (startDate) {
        articles = articles.filter(article => new Date(article.publishedDate) >= new Date(startDate));
    }
    if (endDate) {
        articles = articles.filter(article => new Date(article.publishedDate) <= new Date(endDate));
    }

    res.json(articles);
});


// Route to get a single article by ID
app.get('/articles/:id', (req, res) => {
    const articles = getArticles();
    const articleId = parseInt(req.params.id);  // Convert the ID to a number

    // Find the article by ID
    const article = articles.find(a => a.id === articleId);

    if (article) {
        res.json(article);  // Return the article if found
    } else {
        res.status(404).json({ error: 'Article not found' });  // Return 404 if not found
    }
});

//create a new article |

// Route to create a new article
app.post('/articles', (req, res) => {
    const articles = getArticles();
    const newArticle = req.body;

    // Validate required fields
    if (!newArticle.title || !newArticle.content || !newArticle.tags || !newArticle.publishedDate) {
        return res.status(400).json({ error: 'All fields (title, content, tags, publishedDate) are required' });
    }

    // Generate new article ID
    const newId = articles.length > 0 ? articles[articles.length - 1].id + 1 : 1;

    // Create new article object
    const articleToAdd = {
        id: newId,
        title: newArticle.title,
        content: newArticle.content,
        tags: newArticle.tags,  // Assuming tags are sent as an array
        publishedDate: newArticle.publishedDate  // Format: "YYYY-MM-DD"
    };
    articles.push(articleToAdd)
    saveArticles(articles);

    res.status(201).json(articleToAdd);  // Return the newly created article

});

// Route to delete a single article by ID
app.delete('/articles/:id', (req, res) => {
    const articles = getArticles();
    const articleId = parseInt(req.params.id);

    // Find the index of the article to delete
    const articleIndex = articles.findIndex(a => a.id === articleId);

    if (articleIndex !== -1) {
        // Remove the article from the array
        articles.splice(articleIndex, 1);
        // Save the updated articles array back to the file
        saveArticles(articles);
        res.status(204).send(); // No content to send back
    } else {
        res.status(404).json({ error: 'Article not found' });
    }
});


// Route to update a single article by ID
app.put('/articles/:id', (req, res) => {
    const articles = getArticles();
    const articleId = parseInt(req.params.id);
    const updatedData = req.body;
  
    // Find the index of the article to update
    const articleIndex = articles.findIndex(a => a.id === articleId);
  
    if (articleIndex !== -1) {
      // Update the article's properties
      const articleToUpdate = articles[articleIndex];
      articles[articleIndex] = {
        ...articleToUpdate,
        ...updatedData,
      };
  
      // Save the updated articles array back to the file
      saveArticles(articles);
      res.json(articles[articleIndex]); // Return the updated article
    } else {
      res.status(404).json({ error: 'Article not found' });
    }
  });


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});